const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('start', done => {
  nodemon({
    script: 'app.js',
    done
  });
});

gulp.task('default', gulp.series('start'));

/*

INSTALLATION

If gulp is not installed globally, run
>sudo npm install gulp -g

You will be prompted to enter the password you use to login into your computer.

Then run
>npm install

USAGE

run
>gulp

It will start the app and automatically restart it when you save changes.

Magic!

*/
