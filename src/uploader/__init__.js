/**
 * The uploader initialization script
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var R      = RightJS,
    $      = RightJS.$,
    $w     = RightJS.$w,
    $E     = RightJS.$E,
    Xhr    = RightJS.Xhr,
    Form   = RightJS.Form,
    RegExp = RightJS.RegExp;

include_shared_css(
  'progress-bar'
);

include_module_files(
  'uploader',
  'form'
);
