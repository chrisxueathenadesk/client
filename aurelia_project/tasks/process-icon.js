import gulp from 'gulp';
import merge from 'merge-stream';
import changedInPlace from 'gulp-changed-in-place';
import project from '../aurelia.json';

export default function processIcon() {
  const source = 'node_modules/material-design-iconic-font';

  const taskCss = gulp.src(`${source}/dist/css/material-design-iconic-font.min.css`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulp.dest(`${project.platform.output}/css`));

  const taskFonts = gulp.src(`${source}/dist/fonts/*`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulp.dest(`${project.platform.output}/fonts`));

  return merge(taskCss, taskFonts);
}
