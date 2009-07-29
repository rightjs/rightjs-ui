/**
 * Lightbox Photo is the lightbox photo display
 *
 * Credits:
 *   Inspired by and monkeys the Lightbox 2 project
 *    -- http://www.huddletogether.com/projects/lightbox2/ 
 *      Copyright (C) Lokesh Dhakar
 *
 * @copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Lightbox.Photo = new Class(Lightbox, {
  extend: {
    Options: Object.extend(Lightbox.Options, {
      blockContent: true
    })
  },
  
// protected
  
  updateContent: function(link, roadtrip) {
    this.load(link.href, {onComplete: this.updateImage.bind(this, link, roadtrip)});
  },
  
  updateImage: function(link, roadtrip) {
    
  }
});

// scanning the document on load for the photos to process
document.onLoad(function() {
  var lightbox = new Lightbox.Photo();
  
  // grabbing the singles
  $$('a[rel=lightbox]').each(function(a) {
    a.onClick(function(event) {
      event.stop();
      lightbox.show(this);
    });
  });
  
  // grabbing the roadtrip
  var roadtrip = $$('a[rel="lightbox[roadtrip]"]');
  raodtrip.each(function(a) {
    a.onClick(function(event) {
      event.stop();
      lightbox.show(this, roadtrip)
    })
  });
  
});