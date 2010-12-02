/**
 * the 'video' tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Video = new Class(Rte.Tool.Url, {
  extend: {
    medias: R([
      // supported media formats
      [/(http:\/\/.*?youtube\.[a-z]+)\/watch\?v=([^&]+)/,       '$1/v/$2'],
      [/(http:\/\/video.google.com)\/videoplay\?docid=([^&]+)/, '$1/googleplayer.swf?docId=$2'],
      [/(http:\/\/vimeo\.[a-z]+)\/([0-9]+).*?/,                 '$1/moogaloop.swf?clip_id=$2']
    ]),

    width:  425, // default width
    height: 344  // default height
  },

  command: 'inserthtml',

  element: function() {
    return this.rte.status.findElement('object');
  },

  url: function(url) {
    var element = this.element() && this.element().getElementsByTagName('embed')[0];

    if (element) {
      if (url !== undefined) {
        element.src = this.swfUrl(url);
      } else {
        return element.src;
      }
    }
  },

  create: function(url) {
    var swf_url = this.swfUrl(url), size = 'width="'+ this.constructor.width + '" height="'+ this.constructor.height + '"';

    this.$super('<object '+ size +'>'+
      '<param name="src" value="'+ swf_url +'" />'+
      '<embed src="'+ swf_url +'" type="application/x-shockwave-flash" '+ size + ' />' +
    '</object>');
  },

  // making the actual 'swf' url
  swfUrl: function(url) {
    return this.constructor.medias.map(function(desc) {
      return url.match(desc[0]) ?
        url.replace(desc[0], desc[1]) : null;
    }).compact()[0] || url;
  }
});