/**
 * The tags widget initialization script
 *
 * Copyright (C) 2011 Nikolay Nemshilov
 */
var R       = RightJS,
    $       = RightJS.$,
    Class   = RightJS.Class,
    Input   = RightJS.Input,
    Element = RightJS.Element;

include_shared_css(
  'dd-menu'
);

include_module_files(
  'tags',
  'tags/list',
  'tags/input',
  'tags/completer',
  'document'
);