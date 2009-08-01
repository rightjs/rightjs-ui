/**
 * Ajax loading support module
 *
 * @copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Lightbox.include((function() {
  var old_show = Lightbox.prototype.show;
  
  return {
    // hightjacking the links
    show: function(content) {
      if (content && content.href) {
        return this.load(content.href, {
          onComplete: this.setTitle.bind(this, content.title)
        });
      } else {
        return old_show.apply(this, arguments);
      }
    },
    
    /**
     * Loads the url via an ajax request and assigns the box content wiht the response result
     *
     * NOTE: will perform a GET request by default
     *
     * NOTE: will just update the body content with
     *       the response text if no onComplete or
     *       onSuccess callbacks were set
     *
     * @param String url address
     * @param Object Xhr options
     * @return Lightbox self
     */
    load: function(url, options) {
      var options = options || {};
      
      $w('onCreate onComplete').each(function(name) {
        options[name] = options[name] ? isArray(options[name]) ? options[name] : [options[name]] : [];
      });

      // adding the selfupdate callback as default
      if (options.onComplete.empty() && !options.onSuccess) {
        options.onComplete.push(function(request) {
          this.content.update(request.responseText);
        }.bind(this));
      }

      options.onCreate.unshift(this.loadLock.bind(this));
      options.onComplete.push(this.resize.bind(this));

      options.method = options.method || 'get';

      return this.showingSelf(Xhr.load.bind(Xhr, url, options));
    },
    
  // protected
    
    // xhr requests loading specific lock
    loadLock: function() {
      this.lock().bodyLock.addClass('lightbox-body-lock-loading');
      return this;
    }
  };
})());