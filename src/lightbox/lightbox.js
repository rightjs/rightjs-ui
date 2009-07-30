/**
 * The lightbox widget
 *
 * @copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
var Lightbox = new Class(Observer, {
  include: Options,
  
  extend: {
    EVENTS: $w("show hide"),

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
    this.$super(options);
    Lightbox.boxes.push(this);
    
    // building the main elements
    this.element  = this.E('lightbox').setStyle('display: none');
    this.locker   = this.E('lightbox-locker',    this.element);
    this.dialog   = this.E('lightbox-dialog',    this.element);
    this.header   = this.E('lightbox-header',    this.dialog);
    this.caption  = this.E('lightbox-caption',   this.header);
    this.body     = this.E('lightbox-body',      this.dialog);
    this.content  = this.E('lightbox-content',   this.body);
    this.bodyLock = this.E('lightbox-body-lock', this.body);
    
    
    // the close button if asked
    if (this.options.showCloseButton) {
      this.closeButton = this.E('lightbox-close-button', this.header)
        .onClick(this.hide.bind(this));
    }
    
    // attaching the escape keypress to close the box
    if (this.options.hideOnEsc) {
      document.onKeydown(function(event) {
        if (event.keyCode == 27) {
          this.hide();
        }
      }.bindAsEventListener(this));
    }
  },
  
  /**
   * Hides the box
   *
   * @return Lightbox self
   */
  hide: function() {
    this.element.hide('fade', {duration: this.options.fxDuration/2});
    return this.fire('hide');
  },
  
  /**
   * shows the lightbox with the content
   *
   * @param mixed content String, Element, Array, NodeList, ....
   * @return Lightbox self
   */
  show: function() {
    this.element.insertTo(document.body).setStyle({
      width:  window.sizes().x + 'px',
      height: window.sizes().y + 'px',
      marginTop:  '-'+document.body.getStyle('marginTop')+'px',
      marginLeft: '-'+document.body.getStyle('marginLeft')+'px'
    });
    
    if (this.element.hidden()) {
      this.element.show();
      
      if (self.Fx) {
        this.locker.setStyle('opacity:0');
        this.dialog.setStyle('opacity:0');
        
        this.locker.morph({opacity: 0.7}, {duration: this.options.fxDuration});
        this.dialog.morph({opacity: 1},   {duration: this.options.fxDuration});
      }
    }
      
    this.updateContent.apply(this, arguments);
    return this.fire('show');
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
    
    $w('onStart onComplete').each(function(name) {
      options[name] = options[name] ? isArray(options[name]) ? options[name] : [options[name]] : [];
    });
    
    // adding the selfupdate callback as default
    if (options.onComplete.empty() && !options.onSuccess) {
      options.onComplete.push(function(request) {
        this.show(request.responseText);
      }.bind(this));
    }
    
    options.onStart.unshift(this.lockBody.bind(this));
    options.onComplete.push(this.resize.bind(this));
    
    options.method = options.method || 'get';
    
    this.show();
    
    Xhr.load(url, options);
    
    return this;
  },
  
  /**
   * resizes the dialogue to fit the content
   *
   * @param Object {x:.., y:..} optional end size definition
   * @return Lightbox self
   */
  resize: function(size) {
    this.resizeLock();
    
    if (size) {
      if (Fx) {
        this.body.morph(size, {
          duration: this.options.fxDuration,
          onFinish: this.resizeUnlock.bind(this)
        });
      } else {
        this.body.setStyle(size);
        this.resizeUnlock();
      }
    }
    
    return this;
  },
  
// protected
  
  // shows the content in the body element
  updateContent: function(content) {
    this.lockBody();
    this.content.update(content || '');
    this.resize();
  },
  
  // locks the body
  lockBody: function() {
    this.bodyLock.removeClass('lightbox-body-lock-transparent').show();
  },
  
  // unlocks the body
  unlockBody: function() {
    if (this.options.blockContent) {
      this.bodyLock.addClass('lightbox-body-lock-transparent');
    } else {
      this.bodyLock.hide();
    }
  },
  
  // resize specific lock
  resizeLock: function() {
    this.lockBody();
    this.bodyLock.addClass('lightbox-body-lock-resizing');
    this.content.hide();
  },
  
  // resize specific unlock
  resizeUnlock: function() {
    this.bodyLock.removeClass('lightbox-body-lock-resizing');
    this.unlockBody();
    this.content.show('fade', {duration: this.options.fxDuration});
  },
  
// private
  // elements building shortcut
  E: function(klass, parent) {
    var e = $E('div', {'class': klass});
    if (parent) e.insertTo(parent);
    return e;
  }
  
});