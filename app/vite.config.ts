import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// og:image жана canonical абсолюттук даректи талап кылат.
// SITE_URL (өз домен) же Netlify'дин URL өзгөрмөсүнөн алынат.
const siteUrl = (process.env.SITE_URL || process.env.URL || "").replace(/\/$/, "")

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    inspectAttr(),
    react(),
    {
      name: "site-url-in-html",
      transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", siteUrl),
    },
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
