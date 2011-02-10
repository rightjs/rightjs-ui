/**
 * RightJS UI development tools
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var javascripts    = document.getElementsByTagName('script');
var current_path   = javascripts[0].getAttribute('src');
var current_module = current_path.split('?')[1];
var root_path      = current_path.split('util/ui-tools')[0];

if (current_module) {
  var module_name = current_module.replace('_', ' ').replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  var document_title = document.title = 'RightJS UI: '+ module_name;
}

document.write(
  '<scr'+'ipt type="text/javascript" src="'+
    current_path.split('ui-tools')[0] + 'tools.js' +
  '"></scr'+'ipt>'
);

/**
 * Loads up the ui-modules
 * basically the same as `load_modules` but also
 * hooks up the module css files
 *
 * @param String module name
 * .......
 * @return void
 */
function load_ui_modules() {
  load_modules.apply(this, arguments);

  if (!testing_builds) {
    for (var i=0; i < arguments.length; i++) {
      include_css('src/'+ arguments[i] + '/' + arguments[i]);
    }
  }
}

/**
 * Initializes an UI module test-page
 *
 * @param String module name
 * .....
 * @return void
 */
function initialize_ui_test_page() {
  include_right_js.apply(this, arguments);
  include_shared_js('widget');
  build_test_page();
}
