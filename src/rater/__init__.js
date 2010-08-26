/**
 * The init script for Rater
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var R        = RightJS,
    $        = RightJS.$,
    $w       = RightJS.$w,
    Xhr      = RightJS.Xhr,
    isString = RightJS.isString,
    isNumber = RightJS.isNumber;

include_shared_js(
  'updater'
);

include_module_files(
  'rater',
  'document'
);
