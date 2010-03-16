/**
 * Ajax loading support module
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
Lightbox.include((function(proto) {
  var old_show  = proto.show;
  var old_build = proto.build;
  
  return {
    // hightjacking the links
    show: function(content) {
      if (content && content.href) {
        return this.load(content.href, {
          onComplete: function(request) {
            this.checkTheRoad(content)
              .setTitle(content.title)
              .content.update(request.responseText);
          }.bind(this)
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
      this.loading = true;
      this.lock().bodyLock.addClass('lightbox-body-lock-loading');
      return this;
    },
    
    build: function() {
      var res = old_build.apply(this, arguments);
      
      // building a textual spinner
      var spinner = this.E('lightbox-body-lock-spinner', this.bodyLock);
      var dots    = '1234'.split('').map(function(i) {
        return $E('div', {'class': i == 1 ? 'glow':null}).insertTo(spinner);
      });
      (function() {
        var dot = dots.pop(); dot.insertTo(spinner, 'top'); dots.unshift(dot);
      }).periodical(400);
      
      return res;
    }
  };
})(Lightbox.prototype));