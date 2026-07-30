import { useEffect } from "react";

const TEXT_SELECTOR = "h1,h2,h3,h4,p,span,a,button,small,strong,figcaption,label,li,blockquote";
const MEDIA_SELECTOR = "img,video";
const CMS_SCHEMA = "v2";

function pageKey() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

function editableTextElements(root = document) {
  return [...root.querySelectorAll(TEXT_SELECTOR)].filter((element) => {
    if (element.closest("[data-cms-ui]")) return false;
    if (!element.textContent.trim()) return false;
    return ![...element.children].some((child) => !["BR", "I", "SUP"].includes(child.tagName));
  });
}

function stableHash(value) {
  let hash = 2166136261;
  for (const character of String(value || "")) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function stableToken(value, fallback) {
  const normalized = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);
  return normalized || fallback;
}

export function createCmsElementId({ path, scope, kind, key }) {
  return `${path}:${CMS_SCHEMA}:${stableToken(scope, "page")}:${kind}:${stableToken(key, stableHash(key))}`;
}

function scopeFor(element) {
  return element.closest("main > section, main > header, main > footer") || element.closest("main") || document.body;
}

function scopeKey(element) {
  const scope = scopeFor(element);
  const primaryClass = [...scope.classList].find((name) => !name.startsWith("cms-"));
  const source = scope.dataset.cmsSectionKey || scope.dataset.cmsKey || scope.id || primaryClass || scope.tagName;
  return stableToken(source, "page");
}

function originalMediaSource(element, kind) {
  if (kind === "background") return getComputedStyle(element).backgroundImage;
  if (element.tagName === "VIDEO") return element.getAttribute("src") || element.querySelector("source")?.getAttribute("src") || "";
  return element.getAttribute("src") || "";
}

function generatedElementId(element, kind) {
  const explicitKey = element.dataset.cmsKey;
  const source = explicitKey || (
    kind === "text"
      ? `${element.tagName}:${element.textContent.trim().slice(0, 180)}`
      : `${element.tagName}:${originalMediaSource(element, kind)}`
  );
  return createCmsElementId({
    path: pageKey(),
    scope: scopeKey(element),
    kind,
    key: explicitKey || stableHash(source),
  });
}

function assignElementId(element, kind) {
  const authoredId = element.dataset.cmsId && !element.dataset.cmsGenerated;
  const keySnapshot = element.dataset.cmsKey || "";
  const needsGeneratedId = (
    !element.dataset.cmsId
    || element.dataset.cmsGenerated !== CMS_SCHEMA
    || element.dataset.cmsKeySnapshot !== keySnapshot
  );
  if (!authoredId && needsGeneratedId) {
    element.dataset.cmsId = generatedElementId(element, kind);
    element.dataset.cmsGenerated = CMS_SCHEMA;
    element.dataset.cmsKeySnapshot = keySnapshot;
  }
  element.dataset.cmsKind = kind;
}

export function prepareEditableDocument(root = document) {
  editableTextElements(root).forEach((element) => {
    assignElementId(element, "text");
  });
  [...root.querySelectorAll(MEDIA_SELECTOR)].forEach((element) => {
    assignElementId(element, element.tagName.toLowerCase());
  });
  [...root.querySelectorAll("main *")]
    .filter((element) => {
      if (element.dataset.cmsId || element.closest("[data-cms-ui]")) return false;
      return /^url\(/.test(getComputedStyle(element).backgroundImage || "");
    })
    .forEach((element) => {
      assignElementId(element, "background");
    });
  [...root.querySelectorAll("main > section")].forEach((element) => {
    const primaryClass = [...element.classList].find((name) => !name.startsWith("cms-"));
    const key = element.dataset.cmsSectionKey || element.id || primaryClass || stableHash(element.textContent.slice(0, 120));
    element.dataset.cmsSection = `${pageKey()}:${CMS_SCHEMA}:section:${stableToken(key, "section")}`;
  });
}

function safeText(element, value) {
  element.replaceChildren();
  String(value ?? "").split("\n").forEach((line, index) => {
    if (index) element.append(document.createElement("br"));
    element.append(document.createTextNode(line));
  });
}

function applyOrder(order = []) {
  const main = document.querySelector("main");
  if (!main || !order.length) return;
  const sections = new Map(
    [...main.querySelectorAll(":scope > section[data-cms-section]")].map((section) => [
      section.dataset.cmsSection,
      section,
    ]),
  );
  order.forEach((id) => {
    const section = sections.get(id);
    if (section) main.append(section);
  });
}

export function applyCmsContent(content = {}, root = document) {
  prepareEditableDocument(root);
  Object.entries(content.patches || {}).forEach(([id, patch]) => {
    const elements = root.querySelectorAll(`[data-cms-id="${CSS.escape(id)}"]`);
    elements.forEach((element) => {
      if (patch.text !== undefined && element.dataset.cmsKind === "text") safeText(element, patch.text);
      if (patch.src && ["img", "video"].includes(element.dataset.cmsKind)) {
        if (element.dataset.cmsKind === "video") {
          const source = element.querySelector("source");
          if (source) source.src = patch.src;
          else element.src = patch.src;
          element.load?.();
        } else {
          element.src = patch.src;
        }
      }
      if (patch.src && element.dataset.cmsKind === "background") {
        element.style.backgroundImage = `url("${String(patch.src).replaceAll('"', "%22")}")`;
      }
      if (patch.alt !== undefined && element.tagName === "IMG") element.alt = patch.alt;
      if (patch.styles) Object.assign(element.style, patch.styles);
    });
  });
  applyOrder(content.order);
  if (content.pageStyles) {
    const main = root.querySelector("main");
    if (main) Object.assign(main.style, content.pageStyles);
  }
  if (content.seo) {
    if (content.seo.title) document.title = content.seo.title;
    const description = document.querySelector('meta[name="description"]');
    if (description && content.seo.description) description.content = content.seo.description;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogTitle && content.seo.title) ogTitle.content = content.seo.title;
    if (ogDescription && content.seo.description) ogDescription.content = content.seo.description;
    if (ogImage && content.seo.image) ogImage.content = new URL(content.seo.image, window.location.origin).href;
  }
}

function elementSummary(element) {
  const backgroundImage = getComputedStyle(element).backgroundImage;
  const backgroundSrc = /^url\(["']?(.*?)["']?\)$/.exec(backgroundImage)?.[1];
  return {
    id: element.dataset.cmsId,
    kind: element.dataset.cmsKind,
    label:
      element.dataset.cmsKind === "text"
        ? element.innerText.trim().slice(0, 70)
        : element.getAttribute("alt") || element.currentSrc || element.src || "Mídia",
    text: element.dataset.cmsKind === "text" ? element.innerText : undefined,
    src: ["img", "video"].includes(element.dataset.cmsKind)
      ? element.currentSrc || element.src || element.querySelector?.("source")?.src
      : element.dataset.cmsKind === "background" ? backgroundSrc : undefined,
    alt: element.getAttribute("alt") || "",
    styles: {
      textAlign: element.style.textAlign,
      fontSize: element.style.fontSize,
      color: element.style.color,
      marginTop: element.style.marginTop,
      marginBottom: element.style.marginBottom,
      width: element.style.width,
      borderRadius: element.style.borderRadius,
      objectPosition: element.style.objectPosition,
    },
  };
}

function postToAdmin(type, payload = {}) {
  if (window.parent === window) return;
  window.parent.postMessage({ source: "objeto2a-cms", type, ...payload }, window.location.origin);
}

function enableEditorBridge(getContent = () => ({})) {
  document.documentElement.classList.add("cms-preview-mode");
  prepareEditableDocument();
  let editorMode = "edit";

  const mediaBelowPointer = (event) =>
    document
      .elementsFromPoint(event.clientX, event.clientY)
      .find((candidate) => ["img", "video", "background"].includes(candidate.dataset?.cmsKind));

  const select = (event) => {
    if (editorMode === "navigate") return;
    prepareEditableDocument();
    const element = event.target.closest("[data-cms-id]") || mediaBelowPointer(event);
    if (!element) return;
    event.preventDefault();
    event.stopPropagation();
    document.querySelectorAll(".cms-selected").forEach((item) => item.classList.remove("cms-selected"));
    element.classList.add("cms-selected");
    if (element.dataset.cmsKind === "text") {
      element.contentEditable = "true";
      element.focus({ preventScroll: true });
    }
    postToAdmin("select", { element: elementSummary(element) });
  };

  const replaceMedia = (event) => {
    if (editorMode === "navigate") return;
    prepareEditableDocument();
    const element = event.target.closest('[data-cms-kind="img"],[data-cms-kind="video"],[data-cms-kind="background"]')
      || mediaBelowPointer(event);
    if (!element) return;
    event.preventDefault();
    event.stopPropagation();
    document.querySelectorAll(".cms-selected").forEach((item) => item.classList.remove("cms-selected"));
    element.classList.add("cms-selected");
    postToAdmin("select", { element: elementSummary(element) });
    postToAdmin("replace-media", { element: elementSummary(element) });
  };

  const input = (event) => {
    const element = event.target.closest('[data-cms-kind="text"]');
    if (!element) return;
    postToAdmin("change", {
      element: { ...elementSummary(element), text: element.innerText },
    });
  };

  const changeMode = (event) => {
    if (event.origin !== window.location.origin || event.data?.source !== "objeto2a-admin") return;
    if (event.data.type !== "set-editor-mode") return;
    editorMode = event.data.mode === "navigate" ? "navigate" : "edit";
    document.documentElement.classList.toggle("cms-navigation-mode", editorMode === "navigate");
    if (editorMode === "navigate") {
      document.querySelectorAll('[contenteditable="true"]').forEach((element) => element.removeAttribute("contenteditable"));
    }
  };

  let mutationFrame = 0;
  const observer = new MutationObserver(() => {
    cancelAnimationFrame(mutationFrame);
    mutationFrame = requestAnimationFrame(() => {
      prepareEditableDocument();
      applyCmsContent(getContent());
    });
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-cms-key"],
    subtree: true,
  });

  document.addEventListener("click", select, true);
  document.addEventListener("dblclick", replaceMedia, true);
  document.addEventListener("input", input, true);
  window.addEventListener("message", changeMode);
  postToAdmin("ready", {
    path: pageKey(),
    sections: [...document.querySelectorAll("main > section[data-cms-section]")].map((section) => ({
      id: section.dataset.cmsSection,
      label:
        section.querySelector("h1,h2,h3")?.textContent.trim().slice(0, 60) ||
        section.id ||
        section.className.split(" ")[0] ||
        "Seção",
    })),
  });

  return () => {
    cancelAnimationFrame(mutationFrame);
    observer.disconnect();
    document.removeEventListener("click", select, true);
    document.removeEventListener("dblclick", replaceMedia, true);
    document.removeEventListener("input", input, true);
    window.removeEventListener("message", changeMode);
  };
}

export function useCmsRuntime() {
  useEffect(() => {
    if (pageKey() === "/admin") return undefined;
    let disposed = false;
    let bridgeCleanup;
    let currentContent = {};
    const preview = new URLSearchParams(window.location.search).has("cms_preview");

    const load = async () => {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      prepareEditableDocument();
      try {
        const response = await fetch(
          `/api/cms?path=${encodeURIComponent(pageKey())}&mode=${preview ? "draft" : "published"}`,
        );
        if (response.ok) {
          const data = await response.json();
          currentContent = data.content || {};
          if (!disposed) applyCmsContent(currentContent);
        }
      } catch {
        // The static local preview may not have the worker API. The live site does.
      }
      if (preview && !disposed) bridgeCleanup = enableEditorBridge(() => currentContent);
    };

    const message = (event) => {
      if (event.origin !== window.location.origin || event.data?.source !== "objeto2a-admin") return;
      if (event.data.type === "apply") {
        currentContent = event.data.content || {};
        applyCmsContent(currentContent);
      }
      if (event.data.type === "update-style") {
        const element = document.querySelector(`[data-cms-id="${CSS.escape(event.data.id)}"]`);
        if (element) {
          Object.assign(element.style, event.data.styles || {});
          postToAdmin("select", { element: elementSummary(element) });
        }
      }
    };
    window.addEventListener("message", message);
    load();
    return () => {
      disposed = true;
      bridgeCleanup?.();
      window.removeEventListener("message", message);
    };
  }, []);
}
