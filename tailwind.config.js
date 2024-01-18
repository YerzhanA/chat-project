/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        customBlue: 'rgba(42, 43, 69, 1)',
        customFon: "#382a1e"
      },
      maxHeight: {
        '200': '200px',
      },
    }
  },
  plugins: [],
}