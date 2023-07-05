const { theme } = require('./packages/app/design/tailwind/theme')

// This config is for editor tooling ONLY. To change your apps tailwind config edit the imported theme above
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '*.{jsx,tsx}'
  ],
  plugins: [require('nativewind/tailwind/css')],
  important: 'html',
  theme: {
    ...theme,
  },
}
