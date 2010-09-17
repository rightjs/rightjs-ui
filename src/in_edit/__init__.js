/**
 * In-Edit plugin initalization
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var R = RightJS,
    $ = RightJS.$,
    $w = RightJS.$w,
    Xhr     = RightJS.Xhr,
    Object  = RightJS.Object,
    Element = RightJS.Element,
    Input   = RightJS.Input;


include_shared_js(
  'spinner'
);

include_shared_css(
  'spinner'
);

include_module_files(
  'in_edit',
  'document',
  'element'
);
