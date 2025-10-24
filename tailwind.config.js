/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      colors: {
        brand: {
          primary: "#D81B60", // 🌸 Koseli crimson-pink
          accent: "#ffd166",  // golden highlight
          bg: "#0b0b0c",
          fg: "#f5f5f7",
        },
      },
      fontFamily: {
        sans: [
          "Poppins",
          "Montserrat",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        serif: ["Georgia", "serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
