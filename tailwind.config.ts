import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@rewind-ui/core/dist/theme/styles/Select.styles.js",
    "./node_modules/@rewind-ui/core/dist/theme/styles/Input.styles.js",
    "./node_modules/@rewind-ui/core/dist/theme/styles/Button.styles.js",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#1987D8",
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
