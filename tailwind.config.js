// tailwind.config.js

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
    },
    extend: {
      colors: {
        // Grayscale palette
        white: '#FFFFFF',
        gray50: '#F9FAFB',
        gray100: '#F3F4F6',
        gray200: '#E5E7EB',
        gray300: '#D1D5DB',
        gray400: '#9CA3AF',
        gray500: '#6B7280',
        gray600: '#4B5563',
        gray700: '#374151',
        gray800: '#1F2937',
        gray900: '#111827',
        black: '#000000',

        // Semantic colors using grayscale
        primary: '#374151', // gray700
        secondary: '#6B7280', // gray500
        accent: '#9CA3AF', // gray400
        background: '#F9FAFB', // gray50
        surface: '#FFFFFF',
        text: '#111827', // gray900
        textLight: '#6B7280', // gray500
        border: '#E5E7EB', // gray200
        hover: '#F3F4F6', // gray100
        active: '#D1D5DB', // gray300
        disabled: '#9CA3AF', // gray400
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
