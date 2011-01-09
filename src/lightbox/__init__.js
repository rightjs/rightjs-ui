/**
 * The filenames to include
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var R       = RightJS,
    $       = RightJS.$,
    $$      = RightJS.$$,
    $w      = RightJS.$w,
    $E      = RightJS.$E,
    $ext    = RightJS.$ext,
    Xhr     = RightJS.Xhr,
    Class   = RightJS.Class,
    Object  = RightJS.Object,
    Element = RightJS.Element,
    Browser = RightJS.Browser;

// IE6 doesn't support position:fixed so it needs a crunch
Browser.IE6 = Browser.OLD && navigator.userAgent.indexOf("MSIE 6") > 0;

include_shared_js(
  'spinner'
);

include_shared_css(
  'spinner'
);

include_module_files(
  'lightbox',
  'lightbox/static',
  'lightbox/locker',
  'lightbox/dialog',
  'lightbox/loader',
  'lightbox/pager',
  'document'
);
