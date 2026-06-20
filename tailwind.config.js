/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Primary — Dark Slate Blue #385A74 (dari logo Zoya: diagonal 'Z')
        brand: {
          50:  '#f0f5f8',
          100: '#d9e8f0',
          200: '#b3d1e1',
          300: '#7fb0ca',
          400: '#5490b5',
          500: '#3f6e91',
          600: '#385A74', // base
          700: '#2d4a60',
          800: '#1f3345',
          900: '#121e2b',
        },
        // Accent / CTA — Golden Mustard #D1AB66 (bagian atas 'Z')
        accent: {
          50:  '#fdf8f0',
          100: '#f9efd1',
          200: '#f2dba3',
          300: '#e8c475',
          400: '#D1AB66', // base
          500: '#b88d3a',
          600: '#9a7228',
          700: '#7c591c',
          800: '#5e4114',
          900: '#402d0d',
        },
        // Secondary Greens (dari logo: daun kiri/kanan dan bawah 'Z')
        'zoya-green': {
          fresh: '#8FC593', // daun kiri
          sage:  '#A6BCA8', // daun kanan
          moss:  '#567568', // bawah 'Z' / footer
        },
        // Neutral
        slate: {
          850: '#151f32',
          900: '#0f172a',
          950: '#020617'
        }
      },
      backgroundColor: {
        'surface': '#F7F9F7', // Light Surface dengan sentuhan sage
      },
      textColor: {
        'body': '#1A2A36',   // Dark Text — turunan Primary, nyaman dibaca
      },
      borderRadius: {
        '4xl': '2rem'
      },
      boxShadow: {
        'soft':     '0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.04)',
        'soft-lg':  '0 4px 24px rgba(15,23,42,0.06), 0 12px 48px rgba(15,23,42,0.06)',
        'brand':    '0 10px 30px rgba(56,90,116,0.22)',  // shadow dari brand-600
        'accent':   '0 8px 24px rgba(209,171,102,0.30)', // shadow dari accent-400
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Hanken Grotesk', 'sans-serif']
      },
      animation: {
        'float':          'float 6s ease-in-out infinite',
        'marquee':        'marquee 25s linear infinite',
        'fade-in':        'fadeIn 0.35s ease-out both',
        'slide-up':       'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'shimmer':        'shimmer 1.6s linear infinite'
      },
      keyframes: {
        float:        { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        marquee:      { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(-100%)' } },
        fadeIn:       { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:      { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(24px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        shimmer:      { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } }
      }
    }
  },
  plugins: []
};
