/**
 * Dialog widget initialization script
 *
 * Copyright (C) 2010-2012 Nikolay Nemshilov
 */
var R  = RightJS,
    $  = RightJS.$,
    $w = RightJS.$w,
    $E = RightJS.$E,
    Xhr     = RightJS.Xhr,
    Class   = RightJS.Class,
    Object  = RightJS.Object,
    Element = RightJS.Element;

include_shared_js(
  'button',
  'spinner'
);

include_shared_css(
  'button',
  'spinner',
  'screen-locker'
);

include_module_files(
  'dialog',
  'dialog/head',
  'dialog/body',
  'dialog/foot',
  'dialog/alert',
  'dialog/confirm',
  'dialog/prompt',
  'document'
);