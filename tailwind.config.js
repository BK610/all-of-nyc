/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // darkMode: 'media', // Use the 'media' strategy to follow system preferences
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'nyc-blue': '#0067AC',
        'soft-blue': '#66B2FF',
        'pastel-blue': '#93C5FD',
        'nyc-orange': '#FF8200',
        'nyc-dark-gray': '#333333',
        'nyc-light-gray': '#A7A8AC',
        'dark-bg': '#121212',
        'dark-card': '#1E1E1E',
      },
    },
  },
  plugins: [],
};
