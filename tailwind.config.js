/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "background-snow": "#F8FAFC",
        "surface-white": "#FFFFFF",
        "surface-border": "#E2E8F0",
        "alert-red": "#FCA5A5",
        "alert-orange": "#FDBA74",
        "alert-amber": "#FDE047",
        "alert-green": "#86EFAC",
        "text-main": "#1e293b",
        "text-muted": "#64748b",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(0,0,0,0.05), 0 1px 4px -1px rgba(0,0,0,0.02)",
      },
    },
  },
  plugins: [],
}
