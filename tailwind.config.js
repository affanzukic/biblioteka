module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'lightgray': '#D7D2D2'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
