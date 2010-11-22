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

  'rte/selection',

  'rte/prompt',
  'rte/prompt/url',

  'rte/tool',
  'rte/tool/format',

  'tools/bold',
  'tools/italic',
  'tools/underline',
  'tools/strike',

  'tools/cut',
  'tools/copy',
  'tools/paste',

  'tools/left',
  'tools/center',
  'tools/right',
  'tools/justify',

  'tools/undo',
  'tools/redo',

  'tools/code',
  'tools/quote',
  'tools/ttext',
  'tools/header',

  'tools/link',
  'tools/image',
  'tools/video',

  'tools/dotlist',
  'tools/numlist',
  'tools/indent',
  'tools/outdent',

  'tools/color',
  'tools/background',

  'tools/source',
  'tools/clear',
  'tools/save',

  'document',
  'input'
);