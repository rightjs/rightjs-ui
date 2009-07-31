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
document.onReady(function() {
 // grabbing the singles
 $$('a[rel=lightbox]').each(function(a) {
   a.onClick(function(event) {
     event.stop();
     new Lightbox.Photo().show(this);
   });
 });

 // grabbing the roadtrip
 var roadtrip = $$('a[rel="lightbox[roadtrip]"]');
 roadtrip.each(function(a) {
   a.roadtrip = roadtrip;
   a.onClick(function(event) {
     event.stop();
     new Lightbox.Photo().show(this);
   })
 });
});