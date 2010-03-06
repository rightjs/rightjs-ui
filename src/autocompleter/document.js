/**
 * The document events hooking
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
document.on({
  ready: function() {
    Autocompleter.rescan();
  },
  
  // the autocompletion list navigation
  keydown: function(event) {
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
  }
});