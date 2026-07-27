import { useEffect } from "react";

const TEXT_SELECTOR = "h1,h2,h3,h4,p,span,a,button,small,strong,figcaption,label,li,blockquote";
const MEDIA_SELECTOR = "img,video";

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

export function prepareEditableDocument(root = document) {
  const path = pageKey();
  editableTextElements(root).forEach((element, index) => {
    element.dataset.cmsId ||= `${path}:text:${index}`;
    element.dataset.cmsKind = "text";
  });
  [...root.querySelectorAll(MEDIA_SELECTOR)].forEach((element, index) => {
    element.dataset.cmsId ||= `${path}:media:${index}`;
    element.dataset.cmsKind = element.tagName.toLowerCase();
  });
  [...root.querySelectorAll("main *")]
    .filter((element) => {
      if (element.dataset.cmsId || element.closest("[data-cms-ui]")) return false;
      return /^url\(/.test(getComputedStyle(element).backgroundImage || "");
    })
    .forEach((element, index) => {
      element.dataset.cmsId ||= `${path}:background:${index}`;
      element.dataset.cmsKind = "background";
    });
  [...root.querySelectorAll("main > section")].forEach((element, index) => {
    element.dataset.cmsSection ||= `${path}:section:${index}`;
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
    const element = root.querySelector(`[data-cms-id="${CSS.escape(id)}"]`);
    if (!element) return;
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

function enableEditorBridge() {
  document.documentElement.classList.add("cms-preview-mode");
  prepareEditableDocument();

  const mediaBelowPointer = (event) =>
    document
      .elementsFromPoint(event.clientX, event.clientY)
      .find((candidate) => ["img", "video", "background"].includes(candidate.dataset?.cmsKind));

  const select = (event) => {
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

  document.addEventListener("click", select, true);
  document.addEventListener("dblclick", replaceMedia, true);
  document.addEventListener("input", input, true);
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
    document.removeEventListener("click", select, true);
    document.removeEventListener("dblclick", replaceMedia, true);
    document.removeEventListener("input", input, true);
  };
}

export function useCmsRuntime() {
  useEffect(() => {
    if (pageKey() === "/admin") return undefined;
    let disposed = false;
    let bridgeCleanup;
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
          if (!disposed) applyCmsContent(data.content || {});
        }
      } catch {
        // The static local preview may not have the worker API. The live site does.
      }
      if (preview && !disposed) bridgeCleanup = enableEditorBridge();
    };

    const message = (event) => {
      if (event.origin !== window.location.origin || event.data?.source !== "objeto2a-admin") return;
      if (event.data.type === "apply") applyCmsContent(event.data.content || {});
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
