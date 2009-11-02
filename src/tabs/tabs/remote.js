/**
 * This module contains the remote tabs loading logic
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Tabs.Tab.include((function() {
  var old_show = Tabs.Tab.prototype.show;
  
return {
  
  // wrapping the show mehtod, to catch the remote requests
  show: function() {
    var result  = old_show.apply(this, arguments);
    var url     = this.link.getAttribute('href');
    var options = this.controller.options;
    
    // building the url
    if (url.startsWith('#')) 
      url = options.url ? options.url.replace('%{id}', url.slice(1)) : null;
    
    // if there is an actual url and no ongoing request or a cache, starting the request
    if (url && !this.request && !(options.cache || this.cache)) {
      this.panel.lock();
      
      this.request = Xhr.load(url, options.Xhr).onComplete(function(response) {
        this.panel.update(response.text);
        
        this.request = null; // removing the request marker so it could be rerun
        
        if (options.cache) this.cache = true;
      }.bind(this));
    }
    
    return result;
  }
  
// protected

  
  
}})());