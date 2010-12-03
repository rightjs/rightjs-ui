/**
 * the 'video' tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Video = new Class(Rte.Tool.Url, {
  command: 'inserthtml',

  element: function() {
    return this.rte.status.findElement('OBJECT', {});
  },

  // works with url address of the embedded object
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

  // creates the actual object block
  create: function(url) {
    var swf_url = this.swfUrl(url),
        size =  'width="'+  this.rte.options.videoSize.split('x')[0] +
              '" height="'+ this.rte.options.videoSize.split('x')[1] + '"';

    this.$super('<object '+ size +'>'+
      '<param name="src" value="'+ swf_url +'" />'+
      '<embed src="'+ swf_url +'" type="application/x-shockwave-flash" '+ size + ' />' +
    '</object>');
  },

  // making the actual 'swf' url
  swfUrl: function(url) {
    return R(Rte.Videos).map(function(desc) {
      return url.match(desc[0]) ?
        url.replace(desc[0], desc[1]) : null;
    }).compact()[0] || url;
  }
});