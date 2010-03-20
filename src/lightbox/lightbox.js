/**
 * The lightbox widget
 *
 * Credits:
 *   Inspired by and monkeys the Lightbox 2 project
 *    -- http://www.huddletogether.com/projects/lightbox2/ 
 *      Copyright (C) Lokesh Dhakar
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
Browser.IE6 = navigator.userAgent.indexOf("MSIE 6") != -1;
var Lightbox = new Class({
  include: Options,
  
  extend: {
    Version: "#{version}",
    
    Options: {
      endOpacity:      0.8,
      fxDuration:      200,
      
      hideOnEsc:       true,
      hideOnOutClick:  true,
      showCloseButton: true,
      blockContent:    false,
      
      cssRule:         "a[rel^=lightbox]",             // all lightbox links css-rule
      
      mediaWidth:      425,  // video links default size
      mediaHeight:     350
    },
    
    i18n: {
      CloseText:  '&times;',
      CloseTitle: 'Close',
      PrevText:   '&lsaquo;&lsaquo;&lsaquo;',
      PrevTitle:  'Previous Image',
      NextText:   '&rsaquo;&rsaquo;&rsaquo;',
      NextTitle:  'Next Image'
    },
    
    // media content sources
    Medias: [
      [/(http:\/\/.*?youtube\.[a-z]+)\/watch\?v=([^&]+)/,       '$1/v/$2',                      'swf'],
      [/(http:\/\/video.google.com)\/videoplay\?docid=([^&]+)/, '$1/googleplayer.swf?docId=$2', 'swf'],
      [/(http:\/\/vimeo\.[a-z]+)\/([0-9]+).*?/,                 '$1/moogaloop.swf?clip_id=$2',  'swf']
    ],
    
    boxes: [],
    
    // DEPRECATED: we use events delegation now, there's no need to call this function any more
    rescan: function() {}
  },
  
  /**
   * basic constructor
   *
   * @param Object options override
   */
  initialize: function(options) {
    this.setOptions(options).build().connectEvents();
    
    Lightbox.boxes.push(this);
  },
  
  /**
   * Sets the popup's title
   *
   * @param mixed string or element or somethin'
   * @return Lighbox self
   */
  setTitle: function(text) {
    (function() {
      this.caption.update(text)
    }).bind(this).delay(this.options.fxDuration);
    
    return this;
  },
  
  /**
   * Hides the box
   *
   * @return Lightbox self
   */
  hide: function() {
    this.element.hide('fade', {
      duration: this.options.fxDuration/2,
      onFinish: this.element.remove.bind(this.element)
    });
    return this;
  },
  
  /**
   * shows the lightbox with the content
   *
   * @param mixed content String, Element, Array, NodeList, ....
   * @return Lightbox self
   */
  show: function(content, size) {
    return this.showingSelf(function() {
      this.lock();
      this.content.update(content || '');
      this.resize(size);
    }.bind(this));
  },
  
  /**
   * resizes the dialogue to fit the content
   *
   * @param Object {x:.., y:..} optional end size definition
   * @return Lightbox self
   */
  resize: function(size, no_fx) {
    this.dialog.style.top = (window.sizes().y - this.dialog.sizes().y) / 2 + 'px';
    
    var body_style   = this.contentSize(size);
    var height_diff  = this.dialog.sizes().y - this.body.sizes().y;
    var body_height  = body_style.height.toInt() || this.minBodyHeight();
    var dialog_style = {
      top: (this.element.sizes().y - body_height - height_diff)/2 + 'px'
    };
    
    // IE6 screws with the dialog width
    if (Browser.IE6) {
      var padding = this.bodyWrap.getStyle('padding').toInt() > 0 ? 15 : 0;
      this.bodyWrap.setStyle('padding: '+padding+'px');
      
      dialog_style.width = (body_style.width.toInt() + padding * 2) + 'px';
    }
    
    if (no_fx === true) {
      this.body.setStyle(body_style);
      this.dialog.setStyle(dialog_style);
      this.loading = false;
    } else {
      this.resizeFx(body_style, dialog_style);
    }
    
    return this;
  },
  
// protected
  
  // locks the body
  lock: function() {
    this.bodyLock.removeClass('lightbox-body-lock-transparent').removeClass('lightbox-body-lock-loading').show();
    if (Browser.OLD) this.bodyLock.setStyle("opacity: 1");
    return this;
  },
  
  // unlocks the body
  unlock: function() {
    if (this.options.blockContent) {
      this.bodyLock.addClass('lightbox-body-lock-transparent');
    } else {
      this.bodyLock.hide();
    }
    return this;
  },
  
  // resize specific lock
  resizeLock: function() {
    this.lock().content.hide();
  },
  
  // resize specific unlock
  resizeUnlock: function() {
    this.unlock().content.show('fade', {
      duration: this.options.fxDuration/2
    });
    this.loading = false;
  },
  
  // returns the content size hash
  contentSize: function(size) {
    var size = size === this.$listeners ? null : size,
      max_width = this.element.offsetWidth * 0.8,
      max_height = this.element.offsetHeight * 0.8;
    
    if (size) this.content.setStyle(size);
    
    size = this.content.sizes();
    
    return {
      width:  (size.x > max_width  ? max_width  : size.x)+"px",
      height: (size.y > max_height ? max_height : size.y)+"px"
    };
  },
  
  // adjusts the box size so that it closed the whole window
  boxResize: function(resize) {
    this.element.resize(window.sizes());
    
    // IE6 needs to handle the locker position and size manually
    if (Browser.IE6) {
      this.locker.resize(window.sizes());
        
      this.element.style.position = 'absolute';
      this.element.style.top = document.documentElement.scrollTop + 'px';
    }
    
    return this.resize(false, true);
  },
  
  // performs an action showing the lighbox
  showingSelf: function(callback) {
    Lightbox.boxes.without(this).each('hide');
    
    if (this.element.hidden()) {
      this.element.insertTo(document.body).show();
      
      this.boxResize();
    }
    
    callback();
    
    return this;
  },
  
  // builds the basic structure
  build: function() {
    this.element  = this.E('lightbox').setStyle('display: none');
    this.locker   = this.E('lightbox-locker',    this.element);
    this.dialog   = this.E('lightbox-dialog',    this.element);
    this.caption  = this.E('lightbox-caption',   this.dialog);
    this.bodyWrap = this.E('lightbox-body-wrap', this.dialog);
    this.body     = this.E('lightbox-body',      this.bodyWrap);
    this.content  = this.E('lightbox-content',   this.body);
    this.bodyLock = this.E('lightbox-body-lock', this.body).hide();
    
    // the close button if asked
    if (this.options.showCloseButton) {
      this.closeButton = this.E('lightbox-close-button', this.dialog)
        .onClick(this.hide.bind(this)).update(Lightbox.i18n.CloseText).set('title', Lightbox.i18n.CloseTitle);
    }
    
    if (this.options.hideOnOutClick) {
      this.locker.onClick(this.hide.bind(this));
    }
    
    document.on('mousewheel', function(e) {
      if (this.element.visible()) {
        e.stop();
        this[(e.detail || -e.wheelDelta) < 0 ? 'showPrev' : 'showNext']();
      }
    }.bind(this));
    
    return this;
  },
  
  // connects the events handling for the box
  connectEvents: function() {
    if (this.options.hideOnEsc) {
      document.onKeydown(function(event) {
        if (event.keyCode == 27) {
          event.stop();
          this.hide();
        }
      }.bindAsEventListener(this));
    }
    
    window.on('resize', this.boxResize.bind(this));
    
    return this;
  },
  
  // calculates the minimal body height
  minBodyHeight: function() {
    var element = $E('div', {'class': 'lightbox-body', style: 'background: none; position: absolute'}).insertTo(document.body),
      height = element.sizes().y;
    element.remove();
    return height;
  },
  
  // processes the resizing visual effect
  resizeFx: function(body_style, dialog_style) {
    this.resizeLock();
    
    // processing everything in a single visual effect so it looked smooth
    var body_start_width   = this.body.sizes().x;
    var body_end_width     = body_style.width.toInt();
    var body_start_height  = this.body.sizes().y;
    var body_end_height    = body_style.height.toInt();
    var dialog_start_top   = this.dialog.style.top.toInt();
    var dialog_end_top     = dialog_style.top.toInt();
    var dialog_start_width = this.dialog.sizes().x;
    var dialog_end_width   = (dialog_style.width || '0').toInt();
    var body_style         = this.body.style;
    var dialog_style       = this.dialog.style;
    
    $ext(new Fx(this.dialog, {duration: this.options.fxDuration}), {
      render: function(delta) {
        body_style.width  = (body_start_width  + (body_end_width  - body_start_width)  * delta) + 'px';
        body_style.height = (body_start_height + (body_end_height - body_start_height) * delta) + 'px';
        dialog_style.top  = (dialog_start_top  + (dialog_end_top  - dialog_start_top)  * delta) + 'px';
        
        if (Browser.IE6) {
          dialog_style.width  = (dialog_start_width  + (dialog_end_width  - dialog_start_width)  * delta) + 'px';
        }
      }
    }).onFinish(this.resizeUnlock.bind(this)).start();
  },
  
// private
  // elements building shortcut
  E: function(klass, parent) {
    var e = $E('div', {'class': klass});
    if (parent) e.insertTo(parent);
    return e;
  }
  
});