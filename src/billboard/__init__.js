/**
 * Billboard initialization script
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var R      = RightJS,
    $      = RightJS.$,
    $$     = RightJS.$$,
    $w     = RightJS.$w,
    $E     = RightJS.$E,
    Fx     = RightJS.Fx,
    Class  = RightJS.Class,
    Object = RightJS.Object;


include_module_files(
  'billboard',
  'billboard/fx',
  'billboard/fx/fade',
  'billboard/fx/slide',
  'billboard/fx/stripe',
  'document'
);