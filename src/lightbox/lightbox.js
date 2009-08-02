/**
 * The lightbox widget
 *
 * @copyright (C) 2009 Nikolay V. Nemshilov aka St.
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
      showCloseButton: true,
      blockContent:    false
    },
    
    i18n: {
      Close: 'Close',
      Prev:  'Previous',
      Next:  'Next'
    },
    
    boxes: []
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
  setTitle: function(txt) {
    this.caption.fade('out', {
      duration: this.options.fxDuration/2,
      onFinish: function() {
        this.caption.update(txt).fade('in', {duration: this.options.fxDuration/2});
      }.bind(this)
    });
    
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
        
      var reposition_locker = function() {
        this.element.style.top = document.documentElement.scrollTop + 'px';
      }.bind(this);
        
      window.attachEvent('onscroll', reposition_locker);
      reposition_locker();
    }
    
    return this.resize(false, true);
  },
  
  // performs an action showing the lighbox
  showingSelf: function(callback) {
    Lightbox.boxes.without(this).each('hide');
    
    if (this.element.hidden()) {
      this.locker.setStyle('opacity:0');
      this.dialog.setStyle('opacity:0');
      
      this.element.insertTo(document.body).show();
      
      this.boxResize();
      
      this.locker.morph({opacity: this.options.endOpacity}, {duration: this.options.fxDuration});
      this.dialog.morph({opacity: 1},                       {duration: this.options.fxDuration});
      
      callback.delay(this.options.fxDuration);
    } else {
      callback();
    }
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
        .onClick(this.hide.bind(this)).update('&times;').set('title', Lightbox.i18n.Close);
    }
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
    return $E('div', {'class': 'lightbox-body', style: 'background: none; position: absolute'}).insertTo(document.body).sizes().y;
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
    var body   = this.body;
    var dialog = this.dialog;
    
    $ext(new Fx(this.dialog, {duration: this.options.fxDuration}), {
      render: function(delta) {
        body.style.width  = (body_start_width  + (body_end_width  - body_start_width)  * delta) + 'px';
        body.style.height = (body_start_height + (body_end_height - body_start_height) * delta) + 'px';
        dialog.style.top  = (dialog_start_top  + (dialog_end_top  - dialog_start_top)  * delta) + 'px';
        
        if (Browser.IE6) {
          dialog.style.width  = (dialog_start_width  + (dialog_end_width  - dialog_start_width)  * delta) + 'px';
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