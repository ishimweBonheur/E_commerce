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
        footerGray: '#FAFAFB',
        white: '#FFFFFF',
        violeteBg: '#F5F1FE',
        blueBg: '#15ABFF',
        primary: '#EA580C',
        grayDark: '#CCD0D8',
        grayLight: '#F3F4F6',
        redBg: '#DC2627',
        textBlack: '#171A1F',
        lightGrey: '#DEE1E6',
        grey: '#565D6D',
        black: '#171A1F',
        bannerBg: '#F4F1EB',
        thickorenge: '#EA580C',
        thinorenge: '#FFEDD5',
        dashgrey: '#F5F6F6',
        dashgreytext: '#737791',
        salesbg: '#FFE2E5',
        iconsales: '#FA5A7D',
        orderbg: '#FFF4DE',
        iconorder: '#FF947A',
        psoldbg: '#DCFCE7',
        psoldicon: '#3CD856',
        customerbg: '#F3E8FF',
        customericon: '#BF83FF',
        dashbordblue: '#4079ED',
        linkGrey: '#9095A1',
        sliderBg: '#F0F9FF',
        wishlistBg: '#F5F1F1',
        textareaBorder: '#A8ADB7',
        statusBlue: '#15ABFF',
        statusRed: '#E82E2E',
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
