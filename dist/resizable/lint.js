/**
 * JSLint file for the resizable widget
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
load('util/test/rightly_check.js');

rightly_check('build/right-resizable-src.js', [
  "Do not use 'new' for side effects."
]);
