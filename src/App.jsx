import { HomePage } from "./HomePage.jsx";
import { Subpage } from "./Subpages.jsx";
import { Admin } from "./Admin.jsx";
import { useCmsRuntime } from "./cmsRuntime.js";
import { ArticlesPage } from "./Articles.jsx";

export function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  useCmsRuntime();
  if (path === "/admin") return <Admin />;
  if (path === "/artigos" || path.startsWith("/artigos/")) return <ArticlesPage path={path} />;
  return path === "/" ? <HomePage /> : <Subpage path={path} />;
}
