/**
 * Basic dialog class
 *
 * Copyright (C) 2010-2012 Nikolay Nemshilov
 */
var Dialog = new Widget({
  extend: {
    version: '2.2.2',

    EVENTS: $w('ok cancel help expand collapse resize load'),

    Options: {
      lockScreen:  true,  // if you need to lock the scrreen
      fxDuration:  'short', // dialog appearance duration

      draggable:   true,  // sets if the user should be able to drag the dialog around
      closeable:   true,  // allow the user to close the dialog
      expandable:  false, // show the user to expand/collapse the dialog window width

      showHelp:    false, // show the 'Help' button
      showIcon:    null,  // null or some text to be show in the dialog body icon

      title:       null,  // default title to preset
      html:        null,  // html content to set on instance
      url:         null   // url address that should be loaded on instance
    },

    i18n: {
      Ok:       'Ok',
      Close:    'Close',
      Cancel:   'Cancel',
      Help:     'Help',
      Expand:   'Expand',
      Collapse: 'Collapse',

      Alert:    'Warning!',
      Confirm:  'Confirm',
      Prompt:   'Enter'
    },

    current: false,   // the current dialog reference
    dragged: false    // currently dragged dialog reference
  },

  /**
   * Basic constructor
   *
   * @param Object options
   * @return void
   */
  initialize: function(options) {
    this
      .$super('dialog', options)
      .append(
        this.head = new Dialog.Head(this),
        this.body = new Dialog.Body(this),
        this.foot = new Dialog.Foot(this)
      )
      .onCancel(this.hide);

    this.locker = $E('div', {'class': 'rui-screen-locker'});

    if (this.options.title) {
      this.title(this.options.title);
    }

    if (this.options.html) {
      this.html(this.options.html);
    }

    if (this.options.url) {
      this.load(this.options.url);
    }
  },

  /**
   * Shows the dialog
   *
   * @return Dialog this
   */
  show: function() {
    if (this.options.lockScreen) {
      this.locker.insertTo(document.body);
    }

    this
      .setStyle('visibility:hidden')
      .insertTo(document.body)
      .resize()
      .setStyle('visibility:visible;opacity:0');

    if (this.options.fxDuration) {
      this.morph({opacity: 1}, {
        duration: this.options.fxDuration
      });
    } else {
      this.setStyle('opacity:1');
    }

    return (Dialog.current = this);
  },

  /**
   * Hides the dialog
   *
   * @return Dialog this
   */
  hide: function() {
    this.locker.remove();
    this.remove();

    Dialog.current = false;

    return this;
  },

  /**
   * Repositions the dialog to the middle of the screen
   *
   * @param normal arguments
   * @return Dialog this
   */
  resize: function() {
    if (arguments.length) {
      this.$super.apply(this, arguments);
    }

    var size = this.size(), win_size = $(window).size();

    if (this.expanded) {
      size.x = win_size.x - 20;
      size.y = win_size.y - 10;
      this.$super.call(this, size);
    }

    this.setStyle({
      top:  (win_size.y - size.y)/2 + $(window).scrolls().y + 'px',
      left: (win_size.x - size.x - 16)/2 + 'px'
    });

    return this.fire('resize');
  },

  /**
   * Bidirectional method to work with titles
   *
   * @param String title to set
   * @return String title or Dialog this
   */
  title: function(text) {
    if (arguments.length) {
      this.head.title.html(text);
      return this;
    } else {
      return this.head.title.html();
    }
  },

  /**
   * Overloading the standard method, so that
   * all the content updates were going into the body element
   *
   * @param mixed content
   * @return Dialog this
   */
  update: function(content) {
    this.body.update(content);
    return this.resize();
  },

  /**
   * Redirecting the `html` method to work wiht the body html
   *
   * @param mixed content
   * @return Dialog this or html content of the body
   */
  html: function() {
    return arguments.length ?
      this.$super.apply(this, arguments) :
      this.body.html();
  },

  /**
   * Overloading the original method to bypass things into the body object
   *
   * @param String url
   * @param Object options
   * @return Dialog this
   */
  load: function(url, options) {
    this.show();
    this.body.load(url, options);
    return this;
  },

  /**
   * Expands a dialog screen-wide
   *
   * @return Dialog this
   */
  expand: function() {
    if (!this.expanded) {
      this._prevSize = this.size();
      this.resize({
        x: $(window).size().x - 20,
        y: $(window).size().y - 10
      });

      this.expanded = true;
      this.fire('expand');
    }

    return this;
  },

  /**
   * Collapses an expanded dialog to it's previous size
   *
   * @return Dialog this
   */
  collapse: function() {
    if (this.expanded) {
      this.expanded = false;
      this.resize(this._prevSize);
      this.fire('collapse');
    }

    return this;
  }
});