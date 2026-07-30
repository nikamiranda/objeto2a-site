import { HomePage } from "./HomePage.jsx";
import { Subpage } from "./Subpages.jsx";
import { Admin } from "./Admin.jsx";
import { useCmsRuntime } from "./cmsRuntime.js";

export function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  useCmsRuntime();
  if (path === "/admin") return <Admin />;
  return path === "/" ? <HomePage /> : <Subpage path={path} />;
}
