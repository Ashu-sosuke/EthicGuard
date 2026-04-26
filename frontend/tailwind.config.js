/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#0a0a0a',
        'surface-lighter': '#121212',
        primary: {
          DEFAULT: '#00f2ff',
          hover: '#00d8e6',
          muted: 'rgba(0, 242, 255, 0.1)',
        },
        secondary: {
          DEFAULT: '#7000ff',
          hover: '#6200e6',
          muted: 'rgba(112, 0, 255, 0.1)',
        },
        accent: {
          DEFAULT: '#ff007a',
          hover: '#e6006e',
          muted: 'rgba(255, 0, 122, 0.1)',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'main': 'linear-gradient(135deg, #00f2ff 0%, #7000ff 50%, #ff007a 100%)',
        'gradient-surface': 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(0, 242, 255, 0.3)',
        'glow-secondary': '0 0 20px rgba(112, 0, 255, 0.3)',
        'glow-accent': '0 0 20px rgba(255, 0, 122, 0.3)',
      },
    },
  },
  plugins: [],
}
