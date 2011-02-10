/**
 * Processes the link-groups showing things in a single Lightbox
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Pager = {
  /**
   * Checks and shows the pager links on the dialog
   *
   * @param Dialog dialog
   * @param String url-address
   * @return void
   */
  show: function(dialog, url) {
    if (dialog.options.group) {
      this.dialog = dialog;
      this.links  = this.find(dialog.options.group);
      this.link   = this.links.first(function(link) {
        return link.get('href') === url;
      });

      var index = this.links.indexOf(this.link), size = this.links.length;

      dialog.prevLink[size && index > 0 ? 'show' : 'hide']();
      dialog.nextLink[size && index < size - 1 ? 'show' : 'hide']();
    } else {
      this.dialog = null;
    }
  },

  /**
   * Shows the prev link
   *
   * @return void
   */
  prev: function() {
    if (this.dialog && !this.timer) {
      var id   = this.links.indexOf(this.link),
          link = this.links[id - 1];

      if (link) {
        this.dialog.load(link);
        this.timeout();
      }
    }
  },

  /**
   * Shows the next link
   *
   * @return void
   */
  next: function() {
    if (this.dialog && !this.timer) {
      var id   = this.links.indexOf(this.link),
          link = this.links[id + 1];

      if (link) {
        this.dialog.load(link);
        this.timeout();
      }
    }
  },

// private

  // finding the links list
  find: function(group) {
    return $$('a').filter(function(link) {
      var data = link.get('data-lightbox');
      var rel  = link.get('rel');

      return (data && new Function("return "+ data)().group === group) ||
        (rel && rel.indexOf('lightbox['+ group + ']') > -1);
    });
  },

  // having a little nap to prevent ugly quick scrolling
  timeout: function() {
    this.timer = R(function() {
      Pager.timer = null;
    }).delay(300);
  }
};
