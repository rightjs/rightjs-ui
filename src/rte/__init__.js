/**
 * RTE's initialization script
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */

var R       = RightJS,
    $       = RightJS.$,
    $$      = RightJS.$$,
    $w      = RightJS.$w,
    $E      = RightJS.$E,
    $A      = RightJS.$A,
    isArray = RightJS.isArray,
    RegExp  = RightJS.RegExp,
    Class   = RightJS.Class,
    Element = RightJS.Element,
    Input   = RightJS.Input;


include_module_files(
  'rte',

  'rte/toolbar',
  'rte/editor',
  'rte/status',
  'rte/undoer',

  'rte/selection',

  'rte/tool',
  'rte/tool/command',
  'rte/tool/format',
  'rte/tool/options',
  'rte/tool/style',
  'rte/tool/color',
  'rte/tool/url',

  'tools/bold',
  'tools/italic',
  'tools/underline',
  'tools/strike',

  'tools/cut',
  'tools/copy',
  'tools/paste',
  //'tools/pastetext',

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

  'tools/forecolor',
  'tools/backcolor',

  'tools/source',
  'tools/clear',
  'tools/save',

  'tools/format',
  'tools/fontname',
  'tools/fontsize',
  'tools/subscript',
  'tools/superscript',

  'document',
  'input'
);