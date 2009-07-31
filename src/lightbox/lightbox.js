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
    
    // instantly hides all the boxes
    kill: function() { Lightbox.boxes.each('kill'); },
    boxes: []
  },
  
  /**
   * basic constructor
   *
   * @param Object options override
   */
  initialize: function(options) {
    this.setOptions(options);
    Lightbox.boxes.push(this);
    
    // building the main elements
    this.element  = this.E('lightbox').setStyle('display: none');
    this.locker   = this.E('lightbox-locker',    this.element);
    this.dialog   = this.E('lightbox-dialog',    this.element);
    this.caption  = this.E('lightbox-caption',   this.dialog);
    this.body     = this.E('lightbox-body',      this.dialog);
    this.content  = this.E('lightbox-content',   this.body);
    this.bodyLock = this.E('lightbox-body-lock', this.body).hide();
    
    
    // the close button if asked
    if (this.options.showCloseButton) {
      this.closeButton = this.E('lightbox-close-button', this.dialog)
        .onClick(this.hide.bind(this)).update('&otimes;')
        .set('title', 'Close');
    }
    
    // attaching the escape keypress to close the box
    if (this.options.hideOnEsc) {
      document.onKeydown(function(event) {
        if (event.keyCode == 27) {
          this.hide();
        }
      }.bindAsEventListener(this));
    }
    
    window.on('resize', this.boxResize.bind(this, "resize"));
  },
  
  /**
   * Sets the popup's title
   *
   * @param mixed string or element or somethin'
   * @return Lighbox self
   */
  setTitle: function(txt) {
    this.caption.update(txt);
    return this;
  },
  
  /**
   * Hides the box
   *
   * @return Lightbox self
   */
  hide: function() {
    this.element.hide('fade', {duration: this.options.fxDuration/2, onFinish: this.kill.bind(this)});
    return this;
  },
  
  /**
   * Instantly removes the lightbox out of the user's see
   *
   * @return Lightbox self
   */
  kill: function() {
    this.element.remove();
    return this;
  },
  
  /**
   * Killall lightboxes except this one
   *
   * @return Lightbox self
   */
  killOthers: function() {
    Lightbox.boxes.without(this).each('kill');
    return this;
  },
  
  /**
   * shows the lightbox with the content
   *
   * @param mixed content String, Element, Array, NodeList, ....
   * @return Lightbox self
   */
  show: function(content, size) {
    this.showingSelf(this.update.bind(this, content, size));
    
    return this;
  },
  
  /**
   * Loads the given url address via an xhr request
   *
   * NOTE: will perform a GET request by default
   *
   * NOTE: will just update the body content with
   *       the response text if no onComplete or
   *       onSuccess callbacks were set
   *
   * @param String url address
   * @param Object xhr options
   * @return Lightbox self
   */
  load: function(url, options) {
    var options = options || {};
    
    $w('onCreate onComplete').each(function(name) {
      options[name] = options[name] ? isArray(options[name]) ? options[name] : [options[name]] : [];
    });
    
    // adding the selfupdate callback as default
    if (options.onComplete.empty() && !options.onSuccess) {
      options.onComplete.push(function(request) {
        this.content.update(request.responseText);
      }.bind(this));
    }
    
    options.onCreate.unshift(this.loadLock.bind(this));
    options.onComplete.push(this.resize.bind(this));
    
    options.method = options.method || 'get';
    
    return this.showingSelf(Xhr.load.bind(Xhr, url, options));
  },
  
  /**
   * resizes the dialogue to fit the content
   *
   * @param Object {x:.., y:..} optional end size definition
   * @return Lightbox self
   */
  resize: function(size, no_fx) {
    size = this.contentSize(size);
    
    if (Browser.OLD)
      var top = (this.element.sizes().y - size.height.toInt())/2 + 'px';
    
    if (no_fx === true) {
      this.body.setStyle(size);
    } else {
      this.resizeLock();

      this.body.morph(size, {
        duration: this.options.fxDuration,
        onFinish: this.resizeUnlock.bind(this)
      });
    }
    
    
    if (Browser.OLD)
      this.dialog.morph({top: top}, {duration: this.options.fxDuration, queue:false});
    
    return this;
  },
  
// protected
  
  // shows the content in the body element
  update: function(content, size) {
    this.lock();
    this.content.update(content || '');
    this.resize(size);
  },
  
  // locks the body
  lock: function() {
    this.bodyLock.removeClass('lightbox-body-lock-transparent').removeClass('lightbox-body-lock-loading').show();
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
    this.unlock().content.show('fade', {duration: this.options.fxDuration/2});
  },
  
  // xhr requests loading specific lock
  loadLock: function() {
    this.lock().bodyLock.addClass('lightbox-body-lock-loading');
  },
  
  // performs an action showing the lighbox
  showingSelf: function(callback) {
    this.element.insertTo(document.body);
    this.killOthers().boxResize();
    
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
  
  // returns the content size hash
  contentSize: function(size) {
    var size = size === this.$listeners ? null : size,
      max_width = this.element.offsetWidth * 0.8,
      max_height = this.element.offsetHeight * 0.8;
    
    if (size) {
      this.content.setStyle(size);
    }
    
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
  
// private
  // elements building shortcut
  E: function(klass, parent) {
    var e = $E('div', {'class': klass});
    if (parent) e.insertTo(parent);
    return e;
  }
  
});