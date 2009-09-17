/**
 * A script that scans the document links and automatically
 * generates the lightbox calls to show the content
 *
 * Credits:
 *   Inspired by and monkeys the Lightbox 2 project
 *    -- http://www.huddletogether.com/projects/lightbox2/ 
 *      Copyright (C) Lokesh Dhakar
 *
 * @copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
document.onReady(Lightbox.rescan = function() {
  // grabbing the singles
  $$('a[rel='+Lightbox.Options.relName+']').each(function(a) {
    if (!a.showLightbox) {
      a.showLightbox = function(event) {
        event.stop();
        Lightbox.show(this);
      };
      a.onClick('showLightbox');
    }
  });

  // grabbing the roadtrip
  var roadtrip = $$('a[rel="'+Lightbox.Options.relName+'[roadtrip]"]');
  roadtrip.each(function(a) {
    // removing the listener case the roadmap might get changed
    if (a.showLightbox) {
      a.stopObserving(a.showLightbox);
    }
    
    a.roadtrip = roadtrip;
    a.showLightbox = function(event) {
      event.stop();
      Lightbox.show(this);
    };
    a.onClick(a.showLightbox);
  });
});