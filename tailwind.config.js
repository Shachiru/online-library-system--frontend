/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animationDelay: {
                2000: "2000ms",
                4000: "4000ms",
                6000: "6000ms",
            },
            animation: {
                'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-slower': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'blob': 'blob 7s infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'card-flip': 'cardFlip 0.6s ease-in-out',
                'icon-flip': 'iconFlip 0.8s ease-in-out',
                'icon-out': 'iconOut 0.3s ease-out',
                'text-swap': 'textSwap 0.5s ease-in-out',
                'indicator-move': 'indicatorMove 0.5s ease-in-out',
                'container-height': 'containerHeight 0.5s ease-in-out',
                'forms-swap': 'formsSwap 0.5s ease-in-out',
                'form-out': 'formOut 0.3s ease-out forwards',
                'form-in': 'formIn 0.3s ease-in forwards',
            },
            keyframes: {
                fadeInDown: {
                    '0%': {opacity: '0', transform: 'translateY(-10px)'},
                    '100%': {opacity: '1', transform: 'translateY(0)'},
                },
                fadeInUp: {
                    '0%': {opacity: '0', transform: 'translateY(10px)'},
                    '100%': {opacity: '1', transform: 'translateY(0)'},
                },
                blob: {
                    '0%': {transform: 'translate(0px, 0px) scale(1)'},
                    '33%': {transform: 'translate(30px, -50px) scale(1.1)'},
                    '66%': {transform: 'translate(-20px, 20px) scale(0.9)'},
                    '100%': {transform: 'translate(0px, 0px) scale(1)'},
                },
                shimmer: {
                    '100%': {transform: 'translateX(100%)'},
                },
                cardFlip: {
                    '0%': {transform: 'rotateY(0deg)', opacity: '1'},
                    '20%': {transform: 'rotateY(10deg)', opacity: '0.8'},
                    '80%': {transform: 'rotateY(-10deg)', opacity: '0.8'},
                    '100%': {transform: 'rotateY(0deg)', opacity: '1'},
                },
                iconFlip: {
                    '0%': {transform: 'rotateY(0deg) scale(1)', opacity: '1'},
                    '50%': {transform: 'rotateY(180deg) scale(1.2)', opacity: '0'},
                    '51%': {transform: 'rotateY(-180deg) scale(1.2)', opacity: '0'},
                    '100%': {transform: 'rotateY(0deg) scale(1)', opacity: '1'},
                },
                iconOut: {
                    '0%': {transform: 'scale(1) rotate(0)', opacity: '1'},
                    '100%': {transform: 'scale(0) rotate(90deg)', opacity: '0'},
                },
                textSwap: {
                    '0%': {transform: 'translateY(0)', opacity: '1'},
                    '50%': {transform: 'translateY(10px)', opacity: '0'},
                    '51%': {transform: 'translateY(-10px)', opacity: '0'},
                    '100%': {transform: 'translateY(0)', opacity: '1'},
                },
                indicatorMove: {
                    '0%': {width: '50%', opacity: '1'},
                    '25%': {width: '60%', opacity: '0.7'},
                    '50%': {width: '50%', opacity: '0.5'},
                    '75%': {width: '40%', opacity: '0.7'},
                    '100%': {width: '50%', opacity: '1'},
                },
                containerHeight: {
                    '0%': {opacity: '1'},
                    '50%': {opacity: '0.7'},
                    '100%': {opacity: '1'},
                },
                formsSwap: {
                    '0%': {transform: 'translateX(var(--initial-x))', opacity: '1'},
                    '50%': {opacity: '0.7'},
                    '100%': {transform: 'translateX(var(--target-x))', opacity: '1'},
                },
                formOut: {
                    '0%': {transform: 'translateZ(0) rotateY(0)', opacity: '1'},
                    '100%': {transform: 'translateZ(-100px) rotateY(-10deg)', opacity: '0'},
                },
                formIn: {
                    '0%': {transform: 'translateZ(-100px) rotateY(10deg)', opacity: '0'},
                    '100%': {transform: 'translateZ(0) rotateY(0)', opacity: '1'},
                },
            },
        },
    },
    plugins: [
        function ({addUtilities}) {
            addUtilities({
                '.animation-delay-2000': {animationDelay: '2000ms'},
                '.animation-delay-4000': {animationDelay: '4000ms'},
                '.animation-delay-6000': {animationDelay: '6000ms'},
            });
        },
    ],
}