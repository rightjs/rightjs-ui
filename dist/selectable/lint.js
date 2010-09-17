/**
 * JSLint file for the selectable widget
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
load('util/test/rightly_check.js');

rightly_check('build/right-selectable-src.js', [
  "Do not use 'new' for side effects."
]);
