/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/app/**/*.ts"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["emerald"],
  },
  plugins: [require("daisyui")],
};
