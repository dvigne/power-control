let mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');

mix.sass('src/css/index.scss', 'public/css/index.css')
   .options({
     postCss: [ tailwindcss('./tailwind.config.js') ],
   });

mix.browserSync({
  files: ["src/js/*.js", "src/css/*.scss", "src/html/*.html"],
  server: {
    index: "src/html/index.html"
  }
});
