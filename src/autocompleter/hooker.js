/**
 * The document events hooking
 *
 * Copyright (C) Nikolay V. Nemshilov aka St.
 */
document.onReady(function() {
  $$('input[rel^="autocompleter"]').each(function(input) {
    var match = input.get('rel').match(/^[a-z]+\[(.*?)\]$/);
    if (match) {
      var url = match[1], options = {};
      
      // if looks like a list of local options
      if (url.match(/^['"].*?['"]$/)) {
        options.local = eval('['+url+']');
      } else if (!url.blank()) {
        options.url = url;
      }
      
      input.autocompleter = new Autocompleter(input, options);
    }
  });
}).onKeydown(function(event) {
  // the autocompletion list navigation
  if (Autocompleter.current) {
    var name;
    
    switch (event.keyCode) {
       case 27: name = 'hide'; break;
       case 37: name = 'prev'; break;
       case 39: name = 'next'; break;
       case 38: name = 'prev'; break;
       case 40: name = 'next'; break;
       case 13: name = 'done'; break;
    }
    
    if (name) {
      Autocompleter.current[name]();
      event.stop();
    }
  }
});