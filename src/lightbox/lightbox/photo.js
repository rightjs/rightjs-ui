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
      this.load(link.href, {onComplete: this.updateImage.bind(this, link)});
    }
  },
  
  updateImage: function(link) {
    this.image = $E('img', {src: link.href});
    this.roadtrip = link.roadtrip;
    this.setTitle(link.title);
    this.content.update(this.image);
  }
});
