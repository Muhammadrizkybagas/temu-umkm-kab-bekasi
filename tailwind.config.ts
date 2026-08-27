import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          lightest: "#FFFFFF", 
          light: "#A5E9DD",   
          medium: "#6FBEB2", 
          dark: "#34908B",   
          deep: "#1C524F",  
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;