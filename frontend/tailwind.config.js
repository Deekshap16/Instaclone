/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        instagram: {
          purple: '#833AB4',
          pink: '#E1306C',
          orange: '#F77737',
        },
      },
    },
  },
  plugins: [],
}
