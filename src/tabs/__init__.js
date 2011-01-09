/**
 * The tabs init-script
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var R  = RightJS,
    $  = RightJS.$,
    $$ = RightJS.$$,
    $w = RightJS.$w,
    $E = RightJS.$E,
    Fx       = RightJS.Fx,
    Object   = RightJS.Object,
    Browser  = RightJS.Browser,
    isArray  = RightJS.isArray,
    isNumber = RightJS.isNumber,
    Class    = RightJS.Class,
    Element  = RightJS.Element,
    Cookie   = RightJS.Cookie;

include_shared_js('spinner');
include_shared_css('spinner');

include_module_files(
  'tabs',
  'tabs/tab',
  'tabs/panel',
  'tabs/scroll',
  'tabs/current',
  'tabs/builder',
  'tabs/remote',
  'tabs/loop',
  'document'
);
