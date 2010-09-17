/**
 * This module contains the remote tabs loading logic
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
var old_select = Tab.prototype.select;

Tab.include({

  // wrapping the original mehtod, to catch the remote requests
  select: function() {
    if (this.dogPiling(arguments)) { return this; }

    var result  = old_select.apply(this, arguments);
    var url     = R(this.link.get('href'));
    var options = this.main.options;

    // building the url
    if (url.includes('#')) {
      url = options.url ? options.url.replace('%{id}', url.split('#')[1]) : null;
    }

    // if there is an actual url and no ongoing request or a cache, starting the request
    if (url && !this.request && !(options.cache || this.cache)) {
      this.panel.lock();

      try { // basically that's for the development tests, so the IE browsers didn't get screwed on the test page

        this.request = new RightJS.Xhr(url, Object.merge({method: 'get'}, options.Xhr))
          .onComplete(R(function(response) {
            if (this.main.__working) {
              return arguments.callee.bind(this, response).delay(100);
            }

            this.panel.update(response.text);

            this.request = null; // removing the request marker so it could be rerun
            if (options.cache) {
              this.cache = true;
            }

            this.fire('load');
          }).bind(this)
        ).send();

      } catch(e) { if (!Browser.OLD) { throw(e); } }
    }

    return result;
  },

// protected

  dogPiling: function(args) {
    if (this.main.__working) {
      if (this.main.__timeout) {
        this.main.__timeout.cancel();
      }

      this.main.__timeout = R(function(args) {
        this.select.apply(this, args);
      }).bind(this, args).delay(100);

      return true;
    }

    return (this.main.__timeout = null);
  }

});
