import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        editorial: {
          dark: "#000000",
          muted: "#666666",
          soft: "#f9f9fb",
          pink: "#fbcfe8",
          peach: "#fed7aa",
          rose: "#fda4af",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        didone: ["'Bodoni Moda'", "'Playfair Display'", "Didot", "serif"],
        serif: ["'Bodoni Moda'", "'Playfair Display'", "Didot", "serif"],
        syne: ["'Syne'", "'Space Grotesk'", "sans-serif"],
      },
      letterSpacing: {
        widestEditorial: "0.25em",
        ultraWide: "0.45em",
      },
    },
  },
  plugins: [],
} satisfies Config;
