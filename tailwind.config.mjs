/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Paleta de colores FUTURISTA con acentos de NEÓN
      colors: {
        // Colores neón principales
        neon: {
          cyan: '#00fff2',
          magenta: '#ff00ff',
          pink: '#ff2d95',
          green: '#00ff88',
          yellow: '#ffff00',
          orange: '#ff6b00',
          blue: '#00b4ff',
          purple: '#bf00ff',
        },
        // Color primario - Cyan neón
        primary: {
          50: '#ecffff',
          100: '#cffffe',
          200: '#a5fffc',
          300: '#67fff9',
          400: '#22ffef',
          500: '#00fff2',
          600: '#00d4d4',
          700: '#00a8aa',
          800: '#008486',
          900: '#006b6e',
          950: '#004547',
        },
        // Color secundario - Magenta neón
        secondary: {
          50: '#fff0ff',
          100: '#ffe0ff',
          200: '#ffc1ff',
          300: '#ff93ff',
          400: '#ff55ff',
          500: '#ff00ff',
          600: '#e600e6',
          700: '#bf00bf',
          800: '#990099',
          900: '#7d007d',
          950: '#520052',
        },
        // Colores de acento - Verde neón
        accent: {
          50: '#edfff5',
          100: '#d5ffea',
          200: '#aeffd6',
          300: '#70ffb8',
          400: '#2bff91',
          500: '#00ff88',
          600: '#00c96a',
          700: '#009e54',
          800: '#007b44',
          900: '#00653a',
          950: '#003d23',
        },
        // Superficie/Fondos OSCUROS futuristas
        surface: {
          50: '#2a2a3d',
          100: '#232334',
          200: '#1c1c2b',
          300: '#161622',
          400: '#12121c',
          500: '#0e0e16',
          600: '#0a0a10',
          700: '#07070b',
          800: '#050507',
          900: '#030304',
          950: '#010102',
        },
        // Fondos de tarjetas con glassmorphism
        glass: {
          light: 'rgba(255, 255, 255, 0.05)',
          medium: 'rgba(255, 255, 255, 0.08)',
          dark: 'rgba(0, 0, 0, 0.4)',
        },
      },
      // Tipografía
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Sombras NEÓN futuristas
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.4), 0 2px 10px -2px rgba(0, 0, 0, 0.3)',
        // Glows neón
        'glow-cyan': '0 0 20px rgba(0, 255, 242, 0.4), 0 0 40px rgba(0, 255, 242, 0.2)',
        'glow-cyan-lg': '0 0 30px rgba(0, 255, 242, 0.5), 0 0 60px rgba(0, 255, 242, 0.3), 0 0 100px rgba(0, 255, 242, 0.1)',
        'glow-magenta': '0 0 20px rgba(255, 0, 255, 0.4), 0 0 40px rgba(255, 0, 255, 0.2)',
        'glow-magenta-lg': '0 0 30px rgba(255, 0, 255, 0.5), 0 0 60px rgba(255, 0, 255, 0.3)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.4), 0 0 40px rgba(0, 255, 136, 0.2)',
        'glow-green-lg': '0 0 30px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.3)',
        'glow-pink': '0 0 20px rgba(255, 45, 149, 0.4), 0 0 40px rgba(255, 45, 149, 0.2)',
        'glow-multi': '0 0 20px rgba(0, 255, 242, 0.3), 0 0 40px rgba(255, 0, 255, 0.2)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'neon-border': 'inset 0 0 0 1px rgba(0, 255, 242, 0.3)',
        // Cards futuristas
        'card': '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 255, 242, 0.05)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 255, 242, 0.1)',
      },
      // Animaciones FUTURISTAS
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        // Animaciones neón
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'neon-flicker': 'neonFlicker 3s linear infinite',
        'glow-breathe': 'glowBreathe 4s ease-in-out infinite',
        'border-flow': 'borderFlow 3s linear infinite',
        'scan-line': 'scanLine 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        // Keyframes neón futuristas
        neonPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(0, 255, 242, 0.5), 0 0 20px rgba(0, 255, 242, 0.3)',
            borderColor: 'rgba(0, 255, 242, 0.5)'
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(0, 255, 242, 0.8), 0 0 40px rgba(0, 255, 242, 0.5)',
            borderColor: 'rgba(0, 255, 242, 0.8)'
          },
        },
        neonFlicker: {
          '0%, 100%': { opacity: '1' },
          '41%': { opacity: '1' },
          '42%': { opacity: '0.8' },
          '43%': { opacity: '1' },
          '45%': { opacity: '0.3' },
          '46%': { opacity: '1' },
        },
        glowBreathe: {
          '0%, 100%': { 
            filter: 'drop-shadow(0 0 10px rgba(0, 255, 242, 0.4))'
          },
          '50%': { 
            filter: 'drop-shadow(0 0 25px rgba(0, 255, 242, 0.7))'
          },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      // Espaciado adicional
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // Transiciones
      transitionDuration: {
        '400': '400ms',
      },
      // Backdrop blur
      backdropBlur: {
        xs: '2px',
      },
      // Gradientes FUTURISTAS con neón
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Fondos futuristas
        'dark-gradient': 'linear-gradient(135deg, #0a0a10 0%, #12121c 50%, #0e0e16 100%)',
        'neon-gradient': 'linear-gradient(135deg, rgba(0, 255, 242, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%)',
        'cyber-gradient': 'linear-gradient(180deg, #0a0a10 0%, #161622 50%, #0a0a10 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        // Bordes con gradiente neón
        'neon-border-gradient': 'linear-gradient(90deg, #00fff2, #ff00ff, #00ff88, #00fff2)',
        'neon-cyan-gradient': 'linear-gradient(135deg, #00fff2, #00b4ff)',
        'neon-magenta-gradient': 'linear-gradient(135deg, #ff00ff, #ff2d95)',
        // Patrón de grid futurista
        'grid-pattern': 'linear-gradient(rgba(0, 255, 242, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 242, 0.03) 1px, transparent 1px)',
        'hex-pattern': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'28\' height=\'49\' viewBox=\'0 0 28 49\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%2300fff2\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      },
    },
  },
  plugins: [],
}
