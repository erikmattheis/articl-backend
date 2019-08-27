import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import livereload from 'rollup-plugin-livereload';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';
import copy from 'rollup-plugin-copy';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/js/app.js',
  output: {
    file: './public/bundle.js',
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true,
    globals: {
      jQuery: 'jquery',
      $: 'jquery',
      bootstrap: 'bootstrap',
      popper: 'popper',
      typeahead: 'typeahead.js'
    }
  },
  plugins: [
    copy({
      targets: [{ src: './node_modules/font-awesome/fonts', dest: './public' }]
    }),
    resolve(),
    postcss({
      plugins: [cssnano()]
    }),
    commonjs(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
      include: ['./src/**/*']
    }),
    !production && livereload('public'),
    production && terser() // minify, but only in production
  ]
};

/*
import { rollup } from 'rollup'


rollup({
  entry: 'main.js',
  plugins: [
    purgecss({
      content: ['index.html']
    })
  ]
})
*/
