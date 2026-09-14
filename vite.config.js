import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: change "olist-dashboard" below to your GitHub repo name.
// If your repo is named e.g. "my-portfolio", set base to "/my-portfolio/".
export default defineConfig({
  plugins: [react()],
  base: "/olist-dashboard/",
});
