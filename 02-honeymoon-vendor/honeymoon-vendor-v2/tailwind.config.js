/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream:   '#EDE8D3',
        'cream-dark': '#E4DEC8',
        green:   '#1A3828',
        'green-mid': '#234D37',
        'green-light': '#2D6047',
        gold:    '#B8965A',
        'gold-light': '#D4B07A',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        modal: '0 20px 60px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
};
