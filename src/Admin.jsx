import { useEffect, useMemo, useRef, useState } from "react";
import "./admin.css";

const pages = [
  ["/", "Página inicial"],
  ["/metodo", "Método"],
  ["/solucoes", "Soluções"],
  ["/trabalhos", "Trabalhos"],
  ["/sobre", "Sobre"],
];

const emptyContent = { patches: {}, order: [], seo: {} };

function Icon({ children }) {
  return <span className="admin-icon" aria-hidden="true">{children}</span>;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function Admin() {
  const [page, setPage] = useState("/");
  const [content, setContent] = useState(emptyContent);
  const [savedContent, setSavedContent] = useState(emptyContent);
  const [sections, setSections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [panel, setPanel] = useState("content");
  const [device, setDevice] = useState("desktop");
  const [status, setStatus] = useState("Carregando…");
  const [media, setMedia] = useState([]);
  const [versions, setVersions] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [toast, setToast] = useState("");
  const iframeRef = useRef(null);
  const fileRef = useRef(null);
  const dirty = JSON.stringify(content) !== JSON.stringify(savedContent);

  const pageName = useMemo(() => pages.find(([path]) => path === page)?.[1] || "Página", [page]);

  useEffect(() => {
    loadPage(page);
  }, [page]);

  useEffect(() => {
    const onMessage = (event) => {
      if (event.origin !== window.location.origin || event.data?.source !== "objeto2a-cms") return;
      if (event.data.type === "ready") {
        setSections(event.data.sections || []);
        setStatus("Preview ao vivo");
        iframeRef.current?.contentWindow?.postMessage(
          { source: "objeto2a-admin", type: "apply", content },
          window.location.origin,
        );
      }
      if (event.data.type === "select") {
        setSelected(event.data.element);
        setPanel("content");
      }
      if (event.data.type === "change") updatePatch(event.data.element.id, { text: event.data.element.text });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [content]);

  async function api(url, options) {
    const response = await fetch(url, options);
    if (response.status === 401) throw new Error("Acesso ao painel não autorizado.");
    if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "Não foi possível concluir.");
    return response.json();
  }

  async function loadPage(path) {
    setStatus("Carregando conteúdo…");
    setSelected(null);
    try {
      const [document, mediaData, history] = await Promise.all([
        api(`/api/cms?path=${encodeURIComponent(path)}&mode=draft`),
        api("/api/cms/media"),
        api(`/api/cms/versions?path=${encodeURIComponent(path)}`),
      ]);
      const next = document.content || emptyContent;
      setContent(clone(next));
      setSavedContent(clone(next));
      setMedia(mediaData.items || []);
      setVersions(history.items || []);
      setStatus("Preview ao vivo");
    } catch (error) {
      setContent(emptyContent);
      setSavedContent(emptyContent);
      setStatus(error.message);
    }
  }

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  function updatePatch(id, patch) {
    setContent((current) => ({
      ...current,
      patches: {
        ...current.patches,
        [id]: { ...(current.patches[id] || {}), ...patch },
      },
    }));
  }

  function updateStyle(name, value) {
    if (!selected) return;
    const currentPatch = content.patches[selected.id] || {};
    const styles = { ...(currentPatch.styles || {}), [name]: value };
    updatePatch(selected.id, { styles });
    setSelected((current) => ({ ...current, styles: { ...current.styles, [name]: value } }));
    iframeRef.current?.contentWindow?.postMessage(
      { source: "objeto2a-admin", type: "update-style", id: selected.id, styles },
      window.location.origin,
    );
  }

  async function save(publish = false) {
    setStatus(publish ? "Publicando…" : "Salvando rascunho…");
    try {
      const result = await api("/api/cms", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ path: page, content, publish }),
      });
      setSavedContent(clone(content));
      setStatus("Preview ao vivo");
      notify(publish ? "Alterações publicadas no site" : "Rascunho salvo");
      if (result.version) setVersions((items) => [result.version, ...items]);
    } catch (error) {
      setStatus(error.message);
      notify(error.message);
    }
  }

  async function upload(file) {
    if (!file) return;
    setStatus("Enviando mídia…");
    try {
      const result = await api("/api/cms/media", {
        method: "POST",
        headers: {
          "content-type": file.type || "application/octet-stream",
          "x-filename": encodeURIComponent(file.name),
        },
        body: file,
      });
      setMedia((items) => [result.item, ...items]);
      if (selected) {
        updatePatch(selected.id, { src: result.item.url });
        setSelected((current) => ({ ...current, src: result.item.url }));
        iframeRef.current?.contentWindow?.postMessage(
          { source: "objeto2a-admin", type: "apply", content: {
            ...content,
            patches: { ...content.patches, [selected.id]: { ...(content.patches[selected.id] || {}), src: result.item.url } },
          } },
          window.location.origin,
        );
      }
      setStatus("Preview ao vivo");
      notify(selected ? "Mídia substituída e adicionada à biblioteca" : "Mídia adicionada à biblioteca");
    } catch (error) {
      setStatus(error.message);
      notify(error.message);
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function chooseMedia(item) {
    if (!selected) return;
    updatePatch(selected.id, { src: item.url });
    setSelected((current) => ({ ...current, src: item.url }));
    const next = {
      ...content,
      patches: { ...content.patches, [selected.id]: { ...(content.patches[selected.id] || {}), src: item.url } },
    };
    iframeRef.current?.contentWindow?.postMessage(
      { source: "objeto2a-admin", type: "apply", content: next },
      window.location.origin,
    );
  }

  function reorder(target) {
    if (!dragging || dragging === target) return;
    const current = (content.order.length ? content.order : sections.map((section) => section.id)).filter((id) => id !== dragging);
    const targetIndex = current.indexOf(target);
    current.splice(targetIndex, 0, dragging);
    const next = { ...content, order: current };
    setContent(next);
    setDragging(null);
    iframeRef.current?.contentWindow?.postMessage(
      { source: "objeto2a-admin", type: "apply", content: next },
      window.location.origin,
    );
  }

  async function restore(version) {
    if (!window.confirm(`Restaurar a versão de ${new Date(version.created_at).toLocaleString("pt-BR")}?`)) return;
    try {
      const result = await api("/api/cms/restore", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ path: page, versionId: version.id }),
      });
      setContent(result.content);
      notify("Versão restaurada como rascunho");
      iframeRef.current.src = `${page}?cms_preview=1&v=${Date.now()}`;
    } catch (error) {
      notify(error.message);
    }
  }

  const orderedSections = [...sections].sort((a, b) => {
    const order = content.order.length ? content.order : sections.map((item) => item.id);
    return order.indexOf(a.id) - order.indexOf(b.id);
  });

  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <a href="/" className="admin-logo" aria-label="Objeto 2A — ver site">
          <b>OBJETO</b><span>2A</span>
        </a>
        <nav aria-label="Navegação do painel">
          <button className={panel === "content" ? "is-active" : ""} onClick={() => setPanel("content")}>
            <Icon>✦</Icon><span>Conteúdo</span>
          </button>
          <button className={panel === "pages" ? "is-active" : ""} onClick={() => setPanel("pages")}>
            <Icon>▤</Icon><span>Páginas</span>
          </button>
          <button className={panel === "media" ? "is-active" : ""} onClick={() => setPanel("media")}>
            <Icon>▧</Icon><span>Mídia</span>
          </button>
          <button className={panel === "seo" ? "is-active" : ""} onClick={() => setPanel("seo")}>
            <Icon>⌁</Icon><span>SEO</span>
          </button>
          <button className={panel === "history" ? "is-active" : ""} onClick={() => setPanel("history")}>
            <Icon>↶</Icon><span>Histórico</span>
          </button>
        </nav>
        <a className="admin-view-site" href="/" target="_blank" rel="noreferrer"><Icon>↗</Icon><span>Ver site</span></a>
      </aside>

      <aside className="admin-panel">
        <header>
          <div><small>EDITANDO</small><strong>{pageName}</strong></div>
          <span className={dirty ? "dirty" : ""}>{dirty ? "Alterações não salvas" : "Tudo salvo"}</span>
        </header>

        {panel === "pages" && (
          <div className="panel-scroll">
            <div className="panel-title"><h2>Páginas</h2><p>Escolha a página que deseja editar.</p></div>
            <div className="page-list">
              {pages.map(([path, name]) => (
                <button className={page === path ? "is-active" : ""} onClick={() => setPage(path)} key={path}>
                  <span>{name.slice(0, 1)}</span><div><strong>{name}</strong><small>{path}</small></div><i>›</i>
                </button>
              ))}
            </div>
          </div>
        )}

        {panel === "content" && (
          <div className="panel-scroll">
            {!selected ? (
              <>
                <div className="panel-title"><h2>Conteúdo da página</h2><p>Clique em qualquer texto ou imagem no preview para editar.</p></div>
                <div className="hint-card"><span>✦</span><div><strong>Edição direta</strong><p>Você verá o resultado imediatamente, exatamente no lugar em que ele aparece no site.</p></div></div>
                <div className="panel-section-head"><strong>Ordem das seções</strong><small>ARRASTE PARA REORDENAR</small></div>
                <div className="section-list">
                  {orderedSections.map((section, index) => (
                    <button
                      draggable
                      onDragStart={() => setDragging(section.id)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => reorder(section.id)}
                      key={section.id}
                    >
                      <span>⠿</span><i>{String(index + 1).padStart(2, "0")}</i><strong>{section.label}</strong>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button className="back-button" onClick={() => setSelected(null)}>← Voltar para a página</button>
                <div className="panel-title">
                  <small>{selected.kind === "text" ? "TEXTO" : "MÍDIA"}</small>
                  <h2>{selected.label || "Elemento selecionado"}</h2>
                  <p>As mudanças aparecem no preview em tempo real.</p>
                </div>
                {selected.kind === "text" ? (
                  <label className="field">
                    <span>Conteúdo</span>
                    <textarea
                      rows="7"
                      value={content.patches[selected.id]?.text ?? selected.text ?? ""}
                      onChange={(event) => {
                        updatePatch(selected.id, { text: event.target.value });
                        iframeRef.current?.contentWindow?.postMessage(
                          { source: "objeto2a-admin", type: "apply", content: {
                            ...content,
                            patches: { ...content.patches, [selected.id]: { ...(content.patches[selected.id] || {}), text: event.target.value } },
                          } },
                          window.location.origin,
                        );
                      }}
                    />
                  </label>
                ) : (
                  <>
                    <div className="media-current"><img src={content.patches[selected.id]?.src || selected.src} alt="" /></div>
                    <button className="primary-wide" onClick={() => fileRef.current?.click()}>Substituir imagem</button>
                    <button className="secondary-wide" onClick={() => setPanel("media")}>Escolher da biblioteca</button>
                    {selected.kind === "img" && (
                      <label className="field"><span>Texto alternativo</span><input value={content.patches[selected.id]?.alt ?? selected.alt ?? ""} onChange={(event) => updatePatch(selected.id, { alt: event.target.value })} /></label>
                    )}
                  </>
                )}
                <div className="panel-section-head"><strong>Aparência e posição</strong></div>
                {selected.kind === "text" ? (
                  <>
                    <div className="segmented">
                      {["left", "center", "right"].map((value) => <button className={(content.patches[selected.id]?.styles?.textAlign || selected.styles?.textAlign) === value ? "is-active" : ""} onClick={() => updateStyle("textAlign", value)} key={value}>{value === "left" ? "≡" : value === "center" ? "≣" : "≡"}</button>)}
                    </div>
                    <label className="field"><span>Tamanho da fonte</span><input placeholder="Ex.: 48px ou 3rem" value={content.patches[selected.id]?.styles?.fontSize || ""} onChange={(event) => updateStyle("fontSize", event.target.value)} /></label>
                    <label className="field"><span>Cor</span><input type="color" value={content.patches[selected.id]?.styles?.color || "#16233a"} onChange={(event) => updateStyle("color", event.target.value)} /></label>
                  </>
                ) : (
                  <>
                    <label className="field"><span>Posição focal</span><select value={content.patches[selected.id]?.styles?.objectPosition || ""} onChange={(event) => updateStyle("objectPosition", event.target.value)}><option value="">Padrão</option><option value="center top">Topo</option><option value="center center">Centro</option><option value="center bottom">Base</option><option value="left center">Esquerda</option><option value="right center">Direita</option></select></label>
                    <label className="field"><span>Largura</span><input placeholder="Ex.: 100% ou 640px" value={content.patches[selected.id]?.styles?.width || ""} onChange={(event) => updateStyle("width", event.target.value)} /></label>
                    <label className="field"><span>Arredondamento</span><input placeholder="Ex.: 24px" value={content.patches[selected.id]?.styles?.borderRadius || ""} onChange={(event) => updateStyle("borderRadius", event.target.value)} /></label>
                  </>
                )}
                <div className="two-fields">
                  <label className="field"><span>Espaço acima</span><input placeholder="0px" value={content.patches[selected.id]?.styles?.marginTop || ""} onChange={(event) => updateStyle("marginTop", event.target.value)} /></label>
                  <label className="field"><span>Espaço abaixo</span><input placeholder="0px" value={content.patches[selected.id]?.styles?.marginBottom || ""} onChange={(event) => updateStyle("marginBottom", event.target.value)} /></label>
                </div>
              </>
            )}
          </div>
        )}

        {panel === "media" && (
          <div className="panel-scroll">
            <div className="panel-title"><h2>Biblioteca de mídia</h2><p>Envie imagens ou vídeos e reutilize em qualquer página.</p></div>
            <button className="primary-wide" onClick={() => fileRef.current?.click()}>+ Enviar novo arquivo</button>
            {!selected && <div className="hint-card compact"><span>i</span><p>Selecione uma imagem no preview antes de escolher uma substituição.</p></div>}
            <div className="media-grid">
              {media.map((item) => <button onClick={() => chooseMedia(item)} disabled={!selected} key={item.id}><img src={item.url} alt={item.filename} /><span>{item.filename}</span></button>)}
            </div>
          </div>
        )}

        {panel === "seo" && (
          <div className="panel-scroll">
            <div className="panel-title"><h2>SEO e compartilhamento</h2><p>Defina como esta página aparece no Google e nas redes.</p></div>
            <label className="field"><span>Título da página</span><input value={content.seo?.title || ""} onChange={(event) => setContent((current) => ({ ...current, seo: { ...current.seo, title: event.target.value } }))} placeholder={`${pageName} — Objeto 2A`} /><small>{(content.seo?.title || "").length}/60</small></label>
            <label className="field"><span>Descrição</span><textarea rows="5" value={content.seo?.description || ""} onChange={(event) => setContent((current) => ({ ...current, seo: { ...current.seo, description: event.target.value } }))} placeholder="Uma descrição curta e clara desta página." /><small>{(content.seo?.description || "").length}/160</small></label>
            <label className="field"><span>Imagem de compartilhamento</span><input value={content.seo?.image || ""} onChange={(event) => setContent((current) => ({ ...current, seo: { ...current.seo, image: event.target.value } }))} placeholder="/og.png" /></label>
            <div className="search-preview"><small>PRÉVIA DO GOOGLE</small><a>{content.seo?.title || `${pageName} — Objeto 2A`}</a><span>objeto2a.com.br{page}</span><p>{content.seo?.description || "Conteúdo da Objeto 2A."}</p></div>
          </div>
        )}

        {panel === "history" && (
          <div className="panel-scroll">
            <div className="panel-title"><h2>Histórico de versões</h2><p>Restaure qualquer publicação anterior sem perder o conteúdo atual.</p></div>
            <div className="version-list">
              {versions.length === 0 && <div className="empty-state">Nenhuma versão publicada ainda.</div>}
              {versions.map((version) => (
                <article key={version.id}><span>✓</span><div><strong>{new Date(version.created_at).toLocaleDateString("pt-BR", { dateStyle: "long" })}</strong><small>{new Date(version.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} · {version.created_by || "Editor"}</small></div><button onClick={() => restore(version)}>Restaurar</button></article>
              ))}
            </div>
          </div>
        )}

        <footer>
          <button className="save-draft" onClick={() => save(false)} disabled={!dirty}>Salvar rascunho</button>
          <button className="publish" onClick={() => save(true)}>Publicar <span>↑</span></button>
        </footer>
      </aside>

      <main className="admin-canvas">
        <header className="canvas-toolbar">
          <div className="breadcrumb"><span>Site</span><i>/</i><strong>{pageName}</strong><span className="live-dot"></span></div>
          <div className="device-switcher" aria-label="Tamanho do preview">
            <button className={device === "desktop" ? "is-active" : ""} onClick={() => setDevice("desktop")} title="Desktop">▰</button>
            <button className={device === "tablet" ? "is-active" : ""} onClick={() => setDevice("tablet")} title="Tablet">▯</button>
            <button className={device === "mobile" ? "is-active" : ""} onClick={() => setDevice("mobile")} title="Celular">▯</button>
          </div>
          <div className="canvas-status"><span>{status}</span><button onClick={() => { iframeRef.current.src = `${page}?cms_preview=1&v=${Date.now()}`; }}>↻</button></div>
        </header>
        <div className={`preview-stage preview-stage--${device}`}>
          <iframe ref={iframeRef} title={`Preview de ${pageName}`} src={`${page}?cms_preview=1`} />
        </div>
      </main>
      <input ref={fileRef} className="visually-hidden" type="file" accept="image/*,video/*" onChange={(event) => upload(event.target.files?.[0])} />
      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
