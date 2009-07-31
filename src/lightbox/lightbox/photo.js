/**
 * Lightbox Photo is the lightbox photo display
 *
 * @copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Lightbox.Photo = new Class(Lightbox, {
  
  initialize: function(options) {
    this.$super(options);
    this.element.addClass('lightbox-photo');
    
    this.prevButton = this.E('lightbox-prev-button', this.dialog).update('&lsaquo;&lsaquo;&lsaquo;').set('title', 'Previous');
    this.nextButton = this.E('lightbox-next-button', this.dialog).update('&rsaquo;&rsaquo;&rsaquo;').set('title', 'Next');
    
    this.prevButton.onClick(this.showPrev.bind(this));
    this.nextButton.onClick(this.showNext.bind(this));
  },
  
  showPrev: function() {
    if (this.needPrevButton()) {
      this.show(this.link.roadtrip[this.link.roadtrip.indexOf(this.link) - 1]);
    }
    return this;
  },
  
  showNext: function() {
    if (this.needNextButton()) {
      this.show(this.link.roadtrip[this.link.roadtrip.indexOf(this.link) + 1]);
    }
    return this;
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
    this.setTitle(link.title);
    this.content.update(this.image);
    
    this.prevButton[this.needPrevButton() ? 'show' : 'hide']();
    this.nextButton[this.needNextButton() ? 'show' : 'hide']();
    
    this.resize();
  },
  
  // need this case there is a tiny delay because of the image switching
  resize: function() {
    if (this.image.offsetHeight > 0) {
      return this.$super();
    } else {
      arguments.callee.bind(this).delay(10);
    }
  },
  
  // checks if there is a previous image link
  needPrevButton: function() {
    return this.link && this.link.roadtrip && this.link.roadtrip.first() != this.link;
  },
  
  // checks if there is a next image link
  needNextButton: function() {
    return this.link && this.link.roadtrip && this.link.roadtrip.last() != this.link;
  }
});
