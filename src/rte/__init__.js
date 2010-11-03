/**
 * RTE's initialization script
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

var R  = RightJS,
    $  = RightJS.$,
    $$ = RightJS.$$,
    $w = RightJS.$w;


include_module_files(
  'rte',

  'rte/toolbar',
  'rte/editor',
  'rte/status',

  'rte/action',

  'rte/action/bold',
  'rte/action/italic',
  'rte/action/underline',
  'rte/action/strike',
  'rte/action/ttext',

  'rte/action/cut',
  'rte/action/copy',
  'rte/action/paste',

  'rte/action/left',
  'rte/action/center',
  'rte/action/right',
  'rte/action/justify',

  'rte/action/undo',
  'rte/action/redo',

  'rte/action/code',
  'rte/action/quote',

  'rte/action/link',
  'rte/action/image',
  'rte/action/video',

  'rte/action/dotlist',
  'rte/action/numlist',
  'rte/action/listin',
  'rte/action/listout',

  'rte/action/color',
  'rte/action/background',

  'rte/action/source',
  'rte/action/clear',
  'rte/action/save',

  'document',
  'input'
);