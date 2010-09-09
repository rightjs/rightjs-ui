/**
 * This module handles media-links, like youtube, vimeo etc.
 *
 * Copyright (C) 2010 Nikolay V. Nemshilov
 */
Lightbox.include((function(proto) {
  var old_show = proto.show,
      one = "D27CDB6E-AE6D-11cf-96B8-444553540000",
      two = "http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0",
      thr = "application/x-shockwave-flash",
      media_types = {
        swf: [one, two, thr]
      };
  
  // builds the actual embedded tag
  function build_embedded(addr, type) {
    var sizes = ' width="'+ this.options.mediaWidth + '" height="'+ this.options.mediaHeight + '"';
    
    return '<object classid="clsid:' + media_types[type][0] +
      '" codebase="' + media_types[type][1] + '"'+ sizes + '>' +
      '<param name="src" value="'+addr+'" />'+
      '<embed src="'+ addr +'" type="'+ media_types[type][2]+'"'+ sizes + ' />' +
    '</object>';
  };
  
  // checks and builds an embedded object content if necessary
  function build_media_content(link) {
    if (isElement(link) && link.href) {
      var addr = link.href;
      
      return Lightbox.Medias.map(function(desc) {
        return addr.match(desc[0]) ? build_embedded.call(this, addr.replace(desc[0], desc[1]), desc[2]) : null;
      }, this).compact()[0];
    }
  }
  
return {
  
  // stubbs the show method to hijack the media links
  show: function(link) {
    var media_content = build_media_content.call(this, link);
    
    this.element[media_content ? 'addClass' : 'removeClass']('lightbox-media');
    
    if (media_content) {
      this.content.update(media_content);
      return this.showingSelf(function() {
        this
          .checkTheRoad(link)
          .setTitle(link.title);
          
      }.bind(this));
    }
    
    return old_show.apply(this, arguments);
  }
  
}})(Lightbox.prototype));