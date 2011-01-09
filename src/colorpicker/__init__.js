/**
 * The initialization files list
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

var R = RightJS,
    $ = RightJS.$,
    $w = RightJS.$w,
    $$ = RightJS.$$,
    $E = RightJS.$E,
    $A = RightJS.$A,
    isArray = RightJS.isArray,
    Class   = RightJS.Class,
    Element = RightJS.Element,
    Input   = RightJS.Input;

include_shared_js(
  'button',
  'toggler',
  'assignable'
);

include_shared_css(
  'button',
  'anchor',
  'panel'
);

include_module_files(
  'colorpicker',
  'colorpicker/field',
  'colorpicker/colors',
  'colorpicker/controls',
  'colorpicker/calculator',
  'document'
);
