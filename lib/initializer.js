/**
 * Intialization script, finds out the routes, modules and stuff
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

// finding the application location
var test_type   = document.location.toString().includes('?build') ? 'build' : 'devel';
var url_tokens  = document.location.toString().split('?')[0].split('/');
var module_name = url_tokens[url_tokens.length - 2];
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

// generating the title and swap link
var page_title = "RightJS UI: "+ module_name.camelize().capitalize() + ": Test";
var swap_link  = '<a href="index.html?build">Use build</a>';

if (test_type == 'build') {
  page_title = page_title.replace(': Test', ': Build Test');
  swap_link  = swap_link.replace('?build', '').replace('build', 'devel');
}

// setting the titles
document.title = page_title;
document.write('<h1>'+ page_title.replace(/:/g, '') + swap_link +'</h1>');