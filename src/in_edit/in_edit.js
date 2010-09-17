/**
 * An inline editor feature
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
var InEdit = new Widget('FORM', {
  extend: {
    version: '2.0.0',

    EVENTS: $w('show hide send update'),

    Options: {
      url:    null,    // the url address where to send the stuff
      name:   'text',  // the field name
      method: 'put',   // the method

      type:   'text',  // the input type, 'text', 'file', 'password' or 'textarea'

      toggle:  null,   // a reference to an element that should get hidden when the editor is active

      update:  true,   // a marker if the element should be updated with the response-text

      Xhr: {}          // additional Xhr options
    },

    i18n: {
      Save:   'Save',
      Cancel: 'Cancel'
    },

    current: null      // currently opened editor
  },

  /**
   * Constructor
   *
   * @param mixed an element reference
   * @param Object options
   * @return void
   */
  initialize: function(element, options) {
    this.element = $(element);

    this
      .$super('in-edit', options)
      .set('action', this.options.url)
      .insert([
        this.field   = new Input({type: this.options.type, name: this.options.name, 'class': 'field'}),
        this.spinner = new Spinner(4),
        this.submit  = new Input({type: 'submit', 'class': 'submit', value: InEdit.i18n.Save}),
        this.cancel  = new Element('a', {'class': 'cancel', href: '#', html: InEdit.i18n.Cancel})
      ])
      .onClick(this.clicked)
      .onSubmit(this.send);
  },

  /**
   * Shows the inline-editor form
   *
   * @return InEdit this
   */
  show: function() {
    if (InEdit.current !== this) {
      if (InEdit.current) { InEdit.current.hide(); }

      this.oldContent = this.element.html();

      if (!R(['file', 'password']).include(this.options.type)) {
        this.field.setValue(this.oldContent);
      }

      this.element.update(this);

      this.spinner.hide();
      this.submit.show();

      if (this.options.toggle) {
        $(this.options.toggle).hide();
      }
    }

    if (this.options.type !== 'file') {
      this.field.focus();
    }

    InEdit.current = this;
    return this.fire('show');
  },

  /**
   * Hides the form and brings the content back
   *
   * @param String optional new content
   * @return InEdit this
   */
  hide: function() {
    this.element._.innerHTML = this.oldContent;

    if (this.xhr) {
      this.xhr.cancel();
    }

    return this.finish();
  },

  /**
   * Triggers the form remote submit
   *
   * @return InEdit this
   */
  send: function(event) {
    if (event) { event.stop(); }

    this.spinner.show().resize(this.submit.size());
    this.submit.hide();

    this.xhr = new Xhr(this.options.url, Object.merge(this.options.Xhr, {
      method:     this.options.method,
      spinner:    this.spinner,
      onComplete: R(this.receive).bind(this)
    })).send(this);

    return this.fire('send');
  },

// protected

  // finishes up with the form
  finish: function() {
    if (this.options.toggle) {
      $(this.options.toggle).show();
    }

    InEdit.current = null;
    return this.fire('hide');
  },

  // the xhr callback
  receive: function() {
    if (this.options.update) {
      this.element.update(this.xhr.text);
      this.fire('update');
    }

    this.xhr = null;

    this.finish();
  },

  // catches clicks on the element
  clicked: function(event) {
    if (event.target === this.cancel) {
      event.stop();
      this.hide();
    }
  }

});
