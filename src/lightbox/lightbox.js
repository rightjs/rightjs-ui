/**
 * The lightbox widget
 *
 * Copyright (C) 2009-2012 Nikolay Nemshilov
 */
var Lightbox = new Widget({

  extend: {
    version: '2.4.0',

    EVENTS: $w('show hide load'),

    Options: {
      fxName:          'fade',
      fxDuration:      300,

      group:           null, // a group marker

      hideOnEsc:       true,
      hideOnOutClick:  true,
      showCloseButton: true,

      cssRule:         "a[data-lightbox]", // all lightbox links css-rule

      // video links default size
      mediaWidth:      425,
      mediaHeight:     350,

      fullscreen:      true // allow fullscreen video
    },

    i18n: {
      Close: 'Close',
      Prev:  'Previous Image',
      Next:  'Next Image'
    },

    // the supported image-urls regexp
    Images: /\.(jpg|jpeg|gif|png|bmp)/i,

    // media content sources
    Medias: [
      [/(http:\/\/.*?youtube\.[a-z]+)\/watch\?v=([^&]+)/i,       '$1/v/$2',                      'swf'],
      [/(http:\/\/video.google.com)\/videoplay\?docid=([^&]+)/i, '$1/googleplayer.swf?docId=$2', 'swf'],
      [/(http:\/\/vimeo\.[a-z]+)\/([0-9]+).*?/i,                 '$1/moogaloop.swf?clip_id=$2',  'swf']
    ]
  },

  /**
   * basic constructor
   *
   * @param Object options override
   * @param Element optional options holder
   * @return void
   */
  initialize: function(options, context) {
    this
      .$super('lightbox', {})
      .setOptions(options, context)
      .insert([
        this.locker = new Locker(this.options),
        this.dialog = new Dialog(this.options)
      ])
      .on({
        close: this._close,
        next:  this._next,
        prev:  this._prev
      });
  },

  /**
   * Extracting the rel="lightbox[groupname]" attributes
   *
   * @param Object options
   * @param Element link with options
   * @return Dialog this
   */
  setOptions: function(options, context) {
    this.$super(options, context);

    if (context) {
      var rel = context.get('rel');
      if (rel && (rel = rel.match(/lightbox\[(.+?)\]/))) {
        this.options.group = rel[1];
      }
    }

    return this;
  },

  /**
   * Sets the popup's title
   *
   * @param mixed string or element or somethin'
   * @return Lighbox self
   */
  setTitle: function(text) {
    this.dialog.setTitle(text);

    return this;
  },

  /**
   * Shows the lightbox
   *
   * @param String/Array... content
   * @return Lightbox this
   */
  show: function(content) {
    return this._showAnd(function() {
      this.dialog.show(content, !content);
    });
  },

  /**
   * Hides the lightbox
   *
   * @return Lightbox this
   */
  hide: function() {
    Lightbox.current = null;

    return this.$super(this.options.fxName, {
      duration: this.options.fxDuration/3,
      onFinish: R(function() {
        this.fire('hide');
        this.remove();
      }).bind(this)
    });
  },

  /**
   * Loads up the data from url or a link
   *
   * @param String address or a link element
   * @param Object Xhr options
   * @return Lightbox this
   */
  load: function(link, options) {
    return this._showAnd(function() {
      this.dialog.load(link, options);
    });
  },

  /**
   * Resizes the content block to the given size
   *
   * @param Hash size
   * @return Lightbox this
   */
  resize: function(size) {
    this.dialog.resize(size);
    return this;
  },

// protected

  // handles the 'close' event
  _close: function(event) {
    event.stop();
    this.hide();
  },

  // handles the 'prev' event
  _prev: function(event) {
    event.stop();
    Pager.prev();
  },

  // handles the 'next' event
  _next: function(event) {
    event.stop();
    Pager.next();
  },

  // shows the lightbox element and then calls back
  _showAnd: function(callback) {
    if (Lightbox.current !== this) {
      Lightbox.current = this;

      // hidding all the hanging around lightboxes
      $$('div.rui-lightbox').each('remove');

      this.insertTo(document.body);
      this.dialog.show('', true);

      if (Browser.OLD) { // IE's get screwed by the transparency tricks
        this.reposition();
        Element.prototype.show.call(this);
        callback.call(this);
      } else {
        this.setStyle('display:none');
        Element.prototype.show.call(this, this.options.fxName, {
          duration: this.options.fxDuration/2,
          onFinish: R(function() {
            callback.call(this);
            this.fire('show');
          }).bind(this)
        });
      }
    } else {
      callback.call(this);
    }

    return this;
  },

  // manually repositioning under IE6 browser
  reposition: function() {
    if (Browser.IE6) {
      var win = $(window);

      this.setStyle({
        top:      win.scrolls().y + 'px',
        width:    win.size().x    + 'px',
        height:   win.size().y    + 'px',
        position: "absolute"
      });
    }
  }
});
