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
      showHideDuration: 'short',
      hideOnEsc:        true,
      showCloseButton:  true,
      blockContent:     false
    },
    
    boxes: [],
    hide: function() { this.boxes.each('hide'); }
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
    this.element = this.E('lightbox'});
    this.dialog  = this.E('lightbox-dialog',  this.element);
    this.header  = this.E('lightbox-header',  this.dialog);
    this.caption = this.E('lightbox-caption', this.header);
    this.body    = this.E('lightbox-body',    this.dialog);
    this.content = this.E('lightbox-content', this.body);
    this.locker  = this.E('lightbox-locker',  this.body);
    
    // the close button if asked
    if (this.options.showCloseButton) {
      this.closeButton = this.E('lightbox-close-button', this.header)
        .onClick(this.hide.bind(this));
    }
    
    // attaching the escape keypress to close the box
    if (this.options.hideOnEsc) {
      document.onKeypress(function(event) {
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
    this.element.hide('fade', {duration: this.options.showHideDuration});
    return this.fire('hide');
  },
  
  /**
   * shows the lightbox with the content
   *
   * @param mixed content String, Element, Array, NodeList, ....
   * @return Lightbox self
   */
  show: function() {
    this.element.show('fade', {duration: this.options.showHideDuration});
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
    options.onComplete.push(this.unlockBody.bind(this));
    
    options.method = options.method || 'get';
    
    Xhr.load(url, options);
    
    return this;
  },
  
// protected
  
  // shows the content in the body element
  updateContent: function(content) {
    this.lockBody();
    this.content.update(content);
    this.resize();
    this.unlockBody();
  },
  
  // locks the body
  lockBody: function() {
    this.locker.removeClass('lightbox-locker-transparent').show();
  },
  
  // unlocks the body
  unlockBody: function() {
    if (this.options.blockContent) {
      this.locker.addClass('lightbox-locker-transparent');
    } else {
      this.locker.hide();
    }
  }
  
  // adjusts the dialogute to fit the content
  resize: function() {
    
  },
  
// private
  // elements building shortcut
  E: function(klass, parent) {
    var e = $E('div', {'class': klass});
    if (parent) e.insertTo(parent);
    return e;
  }
  
});