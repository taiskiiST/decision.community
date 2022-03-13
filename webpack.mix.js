const mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .js('resources/js/react/ManageItems/index.js', 'public/js/ManageItems.js')
    .js('resources/js/react/AddQuestionsToPoll/index.js', 'public/js/AddQuestionsToPoll.js')
    .react()
    .sass('resources/sass/app.scss', 'public/css')
    .copy('node_modules/antd/dist/antd.css', 'public/css')
    .extract(['react', 'react-dom', 'antd'])
    .options({
        processCssUrls: false,
        postCss: [
            tailwindcss('./tailwind.config.js')
        ],
    });

if (mix.inProduction()) {
    mix.version();
}
