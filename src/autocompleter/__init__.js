/**
 * Autocompleter initializer
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var R       = RightJS,
    $       = RightJS.$,
    $w      = RightJS.$w,
    $E      = RightJS.$E,
    Xhr     = RightJS.Xhr,
    RegExp  = RightJS.RegExp,
    isArray = RightJS.isArray;

include_shared_js(
  'spinner',
  'toggler'
);

include_shared_css(
  'dd-menu',
  'spinner',
  'anchor'
);

include_module_files(
  'autocompleter',
  'document'
);
