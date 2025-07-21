/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",        // All app-directory pages/components
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Any shared components
    "./styles/**/*.{css,scss}",              // Global or custom CSS files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
