import { HomePage } from "./HomePage.jsx";
import { Subpage } from "./Subpages.jsx";
import { Admin } from "./Admin.jsx";
import { useCmsRuntime } from "./cmsRuntime.js";
import { ArticlesPage } from "./Articles.jsx";

export function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const isAdminHost = window.location.hostname === "admin.objeto2a.com";
  const isCmsPreview = new URLSearchParams(window.location.search).has("cms_preview");
  const isLocalAdmin = import.meta.env.DEV && path === "/admin";
  useCmsRuntime();
  if ((isAdminHost && path === "/" && !isCmsPreview) || isLocalAdmin) return <Admin />;
  if (path === "/artigos" || path.startsWith("/artigos/")) return <ArticlesPage path={path} />;
  return path === "/" ? <HomePage /> : <Subpage path={path} />;
}
