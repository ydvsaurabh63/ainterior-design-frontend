/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#F5F2EB',          // Exact warm plaster background from the image
          card: '#FAF8F5',        // Soft off-white plaster card
          sand: '#E8E1D3',        // Architectural sand tone
          sandDark: '#DDD2BD',    // Architectural travertine/slat tone
          cream: '#FAF8F5',       // Alabaster cream
          charcoal: '#1A1D1A',    // The exact deep espresso charcoal of "aiterior" logo text
          dark: '#141714',        // Deep nocturnal architectural dark
          muted: '#6B716A',       // Exact muted charcoal of "Reimagine Spaces with AI"
          lightMuted: '#9BA199',  // Subtle secondary muted tone
          border: '#E2DACB',      // Warm organic plaster border
          borderDark: '#2C312C',  // Dark mode / footer border
          bronze: '#C6853E',      // The warm glowing pendant brass / halo backlight
          wood: '#8E623E',        // The natural wood disc on top of the "i"
          bronzeDark: '#9E652B',  // Deep amber wood shadow
          bronzeLight: '#E8B372', // Radiant backlight LED halo
          sage: '#4A6048',        // The exact olive-sage green of the 3D "i" leaf/column
          olive: '#4A6048',       // Synonym for sage
          sageDark: '#374836',    // Deep shadow tone of the green column
          sageLight: '#E3EDE1',   // Fresh leaf highlight / subtle badge background
          glow: '#DE9B52',        // Lamp filament illumination
        }
      },
      fontFamily: {
        heading: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '"Outfit"', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
      boxShadow: {
        'luxury': '0 10px 40px -10px rgba(26, 29, 26, 0.08)',
        'luxury-hover': '0 20px 50px -10px rgba(26, 29, 26, 0.14)',
        'glow': '0 0 30px rgba(222, 155, 82, 0.35)',
        'halo': '0 0 25px rgba(232, 179, 114, 0.4)',
        'sage-glow': '0 0 25px rgba(74, 96, 72, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
