/**
 * The images displaying functionality module
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
Lightbox.include((function() {
  var old_show = Lightbox.prototype.show;
  
  return {
    IMAGE_FORMATS: $w('jpg jpeg gif png bmp'),
    
    // hightjacking the links to images and image elements
    show: function(content) {
      // adjusting the element class-name
      this.element[(content && (content.tagName == 'IMG' || this.isImageUrl(content.href))) ?
        'addClass' : 'removeClass']('lightbox-image');
      
      if (content && content.href && this.isImageUrl(content.href)) {
        return this.showingSelf(function() {
          this.checkTheRoad(content).loadLock();
          
          // using the iframed request to make the browser cache work
          var image = new Image();
          image.onload = this.updateImage.bind(this, image, content);
          image.src = content.href;
          
        }.bind(this));
      } else {
        return old_show.apply(this, arguments);
      }
    },
    
  // protected
    
    // inserts the image
    updateImage: function(image, link) {
      this.content.update(image);
      this.checkRoadtrip().setTitle(link.title).resize();
    },
    
    // checks if the given url is an url to an image
    isImageUrl: function(url) {
      return this.IMAGE_FORMATS.include(String(url).toLowerCase().split('?').first().split('.').last());
    }
  };
})());