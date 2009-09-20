/**
 * The document events hooking
 *
 * Copyright (C) Nikolay V. Nemshilov aka St.
 */
document.onReady(function() {
  // hookup the autodiscoveries in here
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