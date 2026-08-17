import { HomePage } from "./HomePage.jsx";
import { Subpage } from "./Subpages.jsx";
import { Admin } from "./Admin.jsx";
import { useCmsRuntime } from "./cmsRuntime.js";

export function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const isAdminHost = window.location.hostname === "admin.objeto2a.com";
  const isCmsPreview = new URLSearchParams(window.location.search).has("cms_preview");
  useCmsRuntime();
  if (isAdminHost && path === "/" && !isCmsPreview) return <Admin />;
  return path === "/" ? <HomePage /> : <Subpage path={path} />;
}
