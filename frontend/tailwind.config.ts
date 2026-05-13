import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: '#000000',
          1: '#0A0A0A',
          2: '#0D0D0D',
          3: '#111111',
          4: '#1A1A1A',
          5: '#222222',
        },
        primary: {
          DEFAULT: '#DAA520',
          hover: '#C4901A',
          strong: '#FFD700',
        },
        border: {
          subtle: '#1A1A1A',
          DEFAULT: '#1F1F1F',
          strong: '#222222',
          emphasis: '#333333',
          muted: '#444444',
        },
        kicker: {
          danger: '#E24B4A',
          'danger-bg': '#FCEBEB',
          'danger-border': '#F09595',
          'danger-text': '#791F1F',
          success: '#1D9E75',
          'success-bg': '#E1F5EE',
          'success-text': '#085041',
          warning: '#EF9F27',
          'warning-bg': '#FAEEDA',
          'warning-text': '#633806',
          terracotta: '#712B13',
          'terracotta-bg': '#FAECE7',
        },
      },
      fontFamily: {
        sans: [
          '42dot Sans',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
      },
      borderRadius: {
        xs: '2px',
        sm: '8px',
        DEFAULT: '10px',
        md: '10px',
        lg: '12px',
        xl: '14px',
        '2xl': '16px',
        pill: '20px',
        phone: '36px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.32s cubic-bezier(0.16,1,0.3,1) both',
        'slide-up': 'slideUp 0.32s cubic-bezier(0.16,1,0.3,1) both',
        'slide-down': 'slideDown 0.28s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in': 'scaleIn 0.20s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
}

export default config
