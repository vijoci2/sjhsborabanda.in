/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B2D4D",
          dark: "#061A2E",
          soft: "#123B62"
        },
        gold: "#D4AF37",
        mist: "#F5F7FA",
        ink: "#1F2937"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(6, 26, 46, 0.12)",
        lift: "0 14px 30px rgba(6, 26, 46, 0.14)"
      }
    }
  },
  plugins: []
};

module.exports = config;
