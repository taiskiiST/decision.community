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
    .js('resources/js/react/AddProtocolToPoll/index.js', 'public/js/AddProtocolToPoll.js')
    .js('resources/js/react/ManageUsers/index.js', 'public/js/ManageUsers.js')
    .js('resources/js/react/RatingStarsForReports/StarRating.js', 'public/js/RatingStarsForReports.js')
    .js('resources/js/react/SuggestedQuestions/index.js', 'public/js/SuggestedQuestions.js')
    .js('resources/js/react/GlobalSearchQuestions/GlobalSearchQuestions.js', 'public/js/GlobalSearchQuestions.js')
    .js('resources/js/react/GlobalSearchQuestionsSmallScreen/GlobalSearchQuestionsSmallScreen.js', 'public/js/GlobalSearchQuestionsSmallScreen.js')
    .js('resources/js/react/PreviewTextQuestion/index.js', 'public/js/PreviewTextQuestion.js')
    .js('resources/js/react/ViewQuestion/index.js', 'public/js/ViewQuestion.js')
    .react()
    .sass('resources/sass/app.scss', 'public/css')
    .copy('node_modules/antd/dist/antd.css', 'public/css')
    .extract(['react', 'react-dom', 'antd'])
    .postCss('resources/css/tailwind.css', 'public/css', [require('tailwindcss')]);

if (mix.inProduction()) {
    mix.version();
}
