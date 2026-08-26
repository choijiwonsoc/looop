/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#F7F6F2',
        ink: '#1C1B19',
        'ink-soft': '#635F57',
        line: '#E4E1D8',
        'line-strong': '#CFCABC',
        loop: '#2F5EFF',
        'loop-soft': '#E9EDFF',
        urgent: '#E85D4A',
        'urgent-soft': '#FCE7E3',
        normal: '#C88A2A',
        'normal-soft': '#FBF0DD',
        optional: '#8A9A7E',
        'optional-soft': '#EBF0E6',
      },
    },
  },
  plugins: [],
}