/**
 * Handles the actual files inclusion
 *
 * Called by the initializer script
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

// including the basic test-page stylesheet
include_stylesheet('../../lib/test_page');

if (test_type == 'build') {
  // including the build file
  include_javascript('../../build/right-'+ module_name.replace('_', '-'));
} else {
  // including the javascripts of the module
  js_files.each(function(name) {
    include_javascript(working_dir + name);
  });
  
  // including the stylesheet for the module
  include_stylesheet(working_dir + module_name);
}
