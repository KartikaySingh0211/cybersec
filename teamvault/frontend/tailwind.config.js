/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          dark: '#0a0d14',
          card: '#111726',
          border: '#1e293b',
          accent: '#3b82f6',
          vuln: '#ef4444',
          safe: '#10b981',
          warning: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
};
