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
        'nyc-blue': '#0A1D49',
        'soft-blue': '#66B2FF',
        'pastel-blue': '#00AEEF',
        'nyc-orange': '#FF741C',
        'nyc-light-gray': '#F2F2F2',
        'nyc-medium-gray': '#E6E6E6',
        'dark-bg': '#121212',
        'dark-card': '#1E1E1E',
      },
    },
  },
  plugins: [],
};
