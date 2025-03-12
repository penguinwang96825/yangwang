/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#1a202c',
            a: {
              color: '#3182ce',
              '&:hover': {
                color: '#2c5282',
              },
            },
            'h1,h2,h3,h4': {
              color: '#1a202c',
              fontWeight: '700',
            },
            code: {
              color: '#1a202c',
              backgroundColor: '#f7fafc',
              padding: '0.25rem',
              borderRadius: '0.25rem',
              border: '1px solid #e2e8f0',
            },
            pre: {
              backgroundColor: '#2d3748',
              color: '#e2e8f0',
              overflow: 'auto',
              padding: '1rem',
              borderRadius: '0.5rem',
            },
          },
        },
        dark: {
          css: {
            color: '#e2e8f0',
            a: {
              color: '#63b3ed',
              '&:hover': {
                color: '#90cdf4',
              },
            },
            'h1,h2,h3,h4': {
              color: '#f7fafc',
            },
            code: {
              color: '#f7fafc',
              backgroundColor: '#2d3748',
              border: '1px solid #4a5568',
            },
            pre: {
              backgroundColor: '#2d3748',
              color: '#e2e8f0',
            },
            strong: {
              color: '#f7fafc',
            },
            blockquote: {
              color: '#e2e8f0',
              borderLeftColor: '#4a5568',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
} 