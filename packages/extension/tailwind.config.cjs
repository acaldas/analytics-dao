/** @type {import('tailwindcss').Config} */

const baseConfig = require("../ui/tailwind.config.cjs");
baseConfig.content.push(...["*", "./index.html", "./src/**/*.{js,ts,jsx,tsx}"]);

module.exports = baseConfig;
