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
        // Primary brand ramp (indigo / violet) — single source of truth for accents.
        brand: {
          50: '#f4f2ff',
          100: '#ebe6ff',
          200: '#d9cfff',
          300: '#bda5ff',
          400: '#9b75f5',
          500: '#5e39e0',
          600: '#4c2bc2',
          700: '#3f23a3',
          800: '#341d85',
          900: '#1c0062'
        },
        slate: {
          850: '#151f32',
          900: '#0f172a',
          950: '#020617'
        }
      },
      borderRadius: {
        '4xl': '2rem'
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.04)',
        'soft-lg': '0 4px 24px rgba(15,23,42,0.06), 0 12px 48px rgba(15,23,42,0.06)',
        'brand': '0 10px 30px rgba(94,57,224,0.18)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Hanken Grotesk', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
        'fade-in': 'fadeIn 0.35s ease-out both',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'shimmer': 'shimmer 1.6s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' }
        }
      }
    }
  },
  plugins: []
};
