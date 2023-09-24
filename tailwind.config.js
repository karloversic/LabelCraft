/** @type {import('tailwindcss').Config} */
module.exports = {
    purge: {
        content: [
            './dist/*.html',
            './src/*.js',
        ],
    },
    content: ["./src/*.{html,js}", "*.html"],
    theme: {
        extend: {},
    },
    plugins: [],

}
