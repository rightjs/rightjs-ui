/**
 * JSLint file for the autocompliter widget
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
load('util/test/rightly_check.js');

rightly_check('build/right-colorpicker-src.js', [
  "Do not use 'new' for side effects.",
  "Missing radix parameter.",
  "Use '===' to compare with '0'."
]);
