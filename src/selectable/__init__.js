/**
 * The filenames to include
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var R        = RightJS,
    $        = RightJS.$,
    $$       = RightJS.$$,
    $w       = RightJS.$w,
    $E       = RightJS.$E,
    $A       = RightJS.$A,
    Object   = RightJS.Object,
    isHash   = RightJS.isHash,
    isArray  = RightJS.isArray,
    isString = RightJS.isString,
    isNumber = RightJS.isNumber,
    defined  = RightJS.defined,
    Input    = RightJS.Input,
    Element  = RightJS.Element;

include_shared_js(
  'updater'
);

include_shared_css(
  'dd-menu'
);

include_module_files(
  'selectable',
  'document'
);
