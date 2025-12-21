/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        maskImage: {
            concave: "radial-gradient(ellipse at top center, rgba(0,0,0,1) 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0) 100%)"
        },
    },
  },
  plugins: [],
}