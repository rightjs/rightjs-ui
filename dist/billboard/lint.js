/**
 * JSLint file for the billboard widget
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
load('util/test/rightly_check.js');

rightly_check('build/right-billboard-src.js', [
  "Do not use 'new' for side effects.",
  "Don't make functions within a loop."
]);
