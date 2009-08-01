/**
 * Lightbox Photo is the lightbox photo display
 *
 * @copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Lightbox.Photo = new Class(Lightbox, {
  
  initialize: function(options) {
    this.$super(options);
    this.element.addClass('lightbox-photo');
  },
  

// protected
  
  update: function(link) {
    if (link && link.href) {
      this.loadLock();
      
      // using the iframed request to make the browser cache work
      var xhr = new Xhr.IFramed();
      xhr.onreadystatechange = this.updateImage.bind(this, link);
      xhr.iframe.src = link.href;
    }
  },
  
  updateImage: function(link) {
    this.link  = link;
    this.image = $E('img', {src: link.href});
    this.content.update(this.image);
    
    this.checkRoadtrip();
    
    this.resize();
  },
  
  // need this case there is a tiny delay because of the image switching
  resize: function() {
    if (this.image && this.image.offsetHeight > 0) {
      this.setTitle(this.link.title);
      return this.$super();
    } else {
      arguments.callee.bind(this).delay(10);
    }
  }
});
