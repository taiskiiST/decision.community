const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors')

module.exports = {
    purge: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.vue',
    ],

    theme: {
        extend: {
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1130px',
                xl: '1280px',
                '2xl': '1536px',
            },
            colors: {
                'brand-blue': '#1992d4',
                'brand-green': '#00A94E',
                'brand-green-light': '#91C73E',
                teal: colors.teal,
                'black-65-opacity': 'rgba(0,0,0,.65)'
            },
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
            spacing: {
                '72': '18rem',
                '80': '20rem',
                '96': '24rem',
                '104': '26rem',
                '112': '28rem',
                '118': '30rem',
                '128': '32rem',
                '144': '36rem',
                '56.25%': '56.25%'
            },
            width: {
                '95%': '95%',
            },
            minWidth: {
                '72': '18rem',
            },
            minHeight: {
                '0': '0',
                '1/4': '25%',
                '1/2': '50%',
                '3/4': '75%',
                'full': '100%',
                'screen': '100vh',
                '2xl': '42rem',
                '3xl': '48rem',
                '7xl': '80rem'
            },
            maxWidth: {
                '75%': '75%',
                '9xl': '100rem',
            }
        },
    },
    variants: {
        extend: {
            ringWidth: ['hover'],
            ringColor: ['hover'],
            opacity: ['responsive', 'hover', 'focus', 'disabled'],
            transitionProperty: ['hover', 'focus'],
            borderStyle: ['focus'],
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ]
};
