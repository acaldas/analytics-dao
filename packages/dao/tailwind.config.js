/** @type {import('tailwindcss').Config} */

const baseConfig = require("../ui/tailwind.config.cjs");
baseConfig.content.push(
  ...[
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ]
);

module.exports = baseConfig;
