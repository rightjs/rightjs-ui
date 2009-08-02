/**
 * The lightbox widget
 *
 * @copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Browser.IE6 = navigator.userAgent.indexOf("MSIE 6") != -1;
var Lightbox = new Class({
  include: Options,
  
  extend: {
    Options: {
      fxDuration:      200,
      hideOnEsc:       true,
      showCloseButton: true,
      blockContent:    false
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
    size = this.contentSize(size);

    if (Browser.OLD) {
      var dialog_style = {
        top: (this.element.sizes().y - (this.content.offsetHeight < 170 ? 170 : size.height.toInt()) - 57)/2 + 'px'
      };
      
      // IE6 screws with the dialog width
      if (Browser.IE6) {
        var padding = this.bodyWrap.getStyle('padding').toInt() > 0 ? 15 : 0;
        this.bodyWrap.setStyle('padding: '+padding+'px');
        
        dialog_style.width = (size.width.toInt() + padding * 2) + 'px';
      }
    }
    
    if (no_fx === true) {
      this.body.setStyle(size);
    } else {
      this.resizeLock();

      this.body.morph(size, {
        duration: this.options.fxDuration,
        onFinish: this.resizeUnlock.bind(this)
      });
    }
    
    if (Browser.OLD) no_fx === true ? this.dialog.setStyle(dialog_style) : this.dialog.morph(dialog_style, {duration: this.options.fxDuration});
    
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
    var height = window.sizes().y + 'px';
    
    this.element.setStyle({height: height, lineHeight: height});
    
    if (Browser.OLD) {
      // IE6 nd 7 doesn't get the vertical align properly
      this.dialog.style.top = (height.toInt() - this.dialog.offsetHeight) / 2 + 'px';
      
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
    }
    
    return resize ? this.resize(false, true) : this;
  },
  
  // performs an action showing the lighbox
  showingSelf: function(callback) {
    Lightbox.boxes.without(this).each('hide');
    this.element.insertTo(document.body);
    this.boxResize();
    
    if (this.element.hidden()) {
      this.locker.setStyle('opacity:0').morph({opacity: 0.8}, {duration: this.options.fxDuration});
      this.dialog.setStyle('opacity:0').morph({opacity: 1},   {duration: this.options.fxDuration});
      
      this.element.show();
      
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
        .onClick(this.hide.bind(this)).update('&times;').set('title', 'Close');
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
  
// private
  // elements building shortcut
  E: function(klass, parent) {
    var e = $E('div', {'class': klass});
    if (parent) e.insertTo(parent);
    return e;
  }
  
});