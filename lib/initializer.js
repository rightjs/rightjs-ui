/**
 * Intialization script, finds out the routes, modules and stuff
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

// finding the application location
var url_tokens  = document.location.toString().split('/');
var test_type   = url_tokens.pop().split('.').first();
var module_name = url_tokens.pop();
var working_dir = '../../src/'+ module_name + '/';

// copule of functions to nice the things up
var include_javascript = function(url) {
  document.write('<scr'+'ipt src="'+ url +'.js"></scr'+'ipt>');
};

var include_stylesheet = function(url) {
  document.write('<li'+'nk rel="stylesheet" type="text/css" href="'+ url +'.css" />');
};

// setting up the charset
document.write('<me'+'ta http-equiv="content-type" content="text/html;charset=UTF-8" />');

// hooking up the module init script and includer script
include_javascript(working_dir + 'init');
include_javascript('../../lib/includer');
