import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0A0A0C",
        surface: "#111114",
        crimson: "#FF2A2A",
        amber: "#FF6B2B",
        emerald: "#00FFAA",
        neonblue: "#0052FF",
        allow: "#00FF66",
        deny: "#FF0000",
        override: "#FFB000",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
