/**
 * Xhr/images/medias loading module
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
var Loader = new Class({
  /**
   * Constructor
   *
   * @param String url address
   * @param Object Xhr options
   * @param Function on-finish callback
   */
  initialize: function(url, options, on_finish) {
    // adjusting the dialog look for different media-types
    if (this.isImage(url, on_finish)) {
      Lightbox.current.addClass('rui-lightbox-image');
    } else if (this.isMedia(url, on_finish)) {
      Lightbox.current.addClass('rui-lightbox-media');
    } else {
      this.xhr = new Xhr(url,
        Object.merge({method: 'get'}, options)
      ).onComplete(function() {
        on_finish(this.text);
      }).send();
    }
  },

  /**
   * Cancels the request
   *
   * @return Loader this
   */
  cancel: function() {
    if (this.xhr) {
      this.xhr.cancel();
    } else if (this.img) {
      this.img.onload = function() {};
    }
  },

// protected

  // tries to initialize it as an image loading
  isImage: function(url, on_finish) {
    if (url.match(Lightbox.Images)) {
      var img = this.img = $E('img')._;
      img.onload = function() {
        on_finish(img);
      };
      img.src = url;
      return true;
    }
  },

  // tries to initialize it as a flash-element
  isMedia: function(url, on_finish) {
    var media = R(Lightbox.Medias).map(function(desc) {
      return url.match(desc[0]) ? this.buildEmbed(
        url.replace(desc[0], desc[1]), desc[2]) : null;
    }, this).compact()[0];

    if (media) {
      on_finish(media, true);
      return true;
    }
  },

  // builds an embedded media block
  buildEmbed: function(url, type) {
    var media_types = {
      swf: [
        'D27CDB6E-AE6D-11cf-96B8-444553540000',
        'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0',
        'application/x-shockwave-flash'
      ]
    },
    options = Lightbox.current ? Lightbox.current.options : Lightbox.Options,
    sizes = ' width="'+ options.mediaWidth + '" height="'+ options.mediaHeight + '"',
    fullscreen_param = options.fullscreen ? '<param name="allowFullScreen" value="true"></param>' : '',
    fullscreen_attr  = options.fullscreen ? ' allowfullscreen="true"' : '';

    if (url.indexOf('youtube.com') > 0 && options.fullscreen) {
      url += '?version=3&amp;hl=en_US&amp;rel=0';
    }

    return '<object classid="clsid:' + media_types[type][0] +
      '" codebase="' + media_types[type][1] + '"'+ sizes + '>' +
      '<param name="src" value="'+ url +'" />'+ fullscreen_param +
      '<embed src="'+ url +'" type="'+ media_types[type][2]+'"'+ sizes + fullscreen_attr+ ' />' +
    '</object>';
  }

});
