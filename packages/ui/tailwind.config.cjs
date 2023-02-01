const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    `${__dirname}/components/**/*.{js,ts,jsx,tsx}`,
    "../../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(242,237,232)",
        backgroundDark: "rgb(238,230,223)",
        text: "rgb(38,38,38)",
        white: "rgb(252,252,249)",
        primary: "rgb(254,170,128)",
        secondary: "rgb(177,177,177)",
        yellow: "rgb(252,191,66)",
        blue: {
          700: "rgb(254,170,128)",
        },
      },
      fontFamily: {
        sans: ["var(--font-ubuntu)", ...fontFamily.sans],
        ubuntu: "var(--font-ubuntu)",
        comfortaa: "var(--font-comfortaa)",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
