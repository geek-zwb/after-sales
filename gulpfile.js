var elixir = require('laravel-elixir');

require('./tasks/bower.task.js');
require('./tasks/ngHtml2Js.task.js');
require('./tasks/appJs.task.js');
var bowerDir='resources/assets/bower/';

//elixir.config.sourcemaps = false;

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    var assets = [
        'public/js/vendor.js',
        'public/js/partials.js',
        'public/js/appinit.js',
        'public/js/app.js',
        'public/css/vendor.css',
        'public/css/less.css',
        'public/css/app.css'
    ];

    //mix.less('app.less', './public/css/test.css');

   mix.bower()
        .scripts([
            'assets/app/base.js',
            'assets/app/ocLazyload.config.js',
            'assets/app/route.config.js'
        ], 'public/js/appinit.js','./resources/')
        .scripts([
            'public/libs/loadsh/lodash.js',
            'resources/assets/app/common/directives/orderTrackedTable.js',
            'public/libs/jquerydatetime/jquery.datetimepicker.js',
            'resources/assets/app/common/directives/angular.datetime.js',
            'resources/assets/app/common/service/common.js',
            'resources/assets/app/user/user.js'
        ], 'public/js/app.js')
        .styles([
            'resources/assets/css/base.css',
            'resources/assets/css/libs.css',
            'resources/assets/css/user.css',
            'resources/assets/css/post.css',
            'resources/assets/css/directive.css',
            'resources/assets/css/rewrite.css'
        ], 'public/css/app.css')
        .ngHtml2Js('./resources/views/tpl/**/*.html')
        .appJs()
        .copy([bowerDir + 'font-awesome/fonts', bowerDir+'bootstrap/fonts'], 'public/build/fonts')
        .copy(['public/fonts'], 'public/build/fonts')
        .version(assets)
        .browserSync({
            proxy: 'www.autoaftersale.com'
        });
});
