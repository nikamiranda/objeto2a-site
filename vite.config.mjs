import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    outDir: "dist/client",
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, "index.html"),
        articles: resolve(import.meta.dirname, "artigos/index.html"),
        articleLanguage: resolve(import.meta.dirname, "artigos/quando-a-organizacao-nao-encontra-palavras/index.html"),
        articleNr1: resolve(import.meta.dirname, "artigos/nr-1-e-riscos-psicossociais/index.html"),
        articleLeadership: resolve(import.meta.dirname, "artigos/lideranca-como-leitura-de-contexto/index.html"),
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react()],
});
