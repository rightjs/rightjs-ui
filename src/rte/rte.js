/**
 * The Right Text Editor
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Rte = new Widget({

  extend: {
    EVENTS: $w('change focus blur'),

    Options: {
      toolbar:      'small',  // toolbar, the name or an array of your own

      showToolbar:  true,     // show the toolbar
      showStatus:   true,     // show the status bar

      styleWithCSS: false,    // either use CSS or tags to format the code

      quoteTag:     'blockquote',   // the quote block tag name
      codeTag:      'pre',    // the code block tag name
      ttextTag:     'tt',     // the mono-width text tag name
      headerTag:    'h2',     // the header block tag name

      cssRule: 'textarea[data-rte]'
    },

    // predefined toolbars set
    Toolbars: {
      small: ['bold italic underline strike ttext|cut copy paste|header code quote|link image video|source'],
      basic: [
        'save clear|cut copy paste|bold italic underline strike ttext|left center right justify',
        'undo redo|header code quote|link image video|dotlist numlist|listin listout|color background|source'
      ]
    },

    i18n: {
      Clear:      'Clear',
      Save:       'Save',
      Source:     'Source',
      Bold:       'Bold',
      Italic:     'Italic',
      Underline:  'Underline',
      Strike:     'Strike through',
      Ttext:      'Mono width',
      Header:     'Header',
      Cut:        'Cut',
      Copy:       'Copy',
      Paste:      'Paste',
      Left:       'Left',
      Center:     'Center',
      Right:      'Right',
      Justify:    'Justify',
      Undo:       'Undo',
      Redo:       'Redo',
      Code:       'Code block',
      Quote:      'Block quote',
      Link:       'Add link',
      Image:      'Insert image',
      Video:      'Insert video',
      Dotlist:    'List with dots',
      Numlist:    'List with numbers',
      Listin:     'Add list level',
      Listout:    'Remove list level',
      Color:      'Text color',
      Background: 'Background color'
    },

    current: null
  },

  /**
   * Basic constructor
   *
   * @param Input textarea reference
   * @param Object additional options
   * @return void
   */
  initialize: function(textarea, options) {
    this.textarea = $(textarea);

    this
      .$super('rte', {})
      .setOptions(options, this.textarea)
      .append(
        this.toolbar = new Rte.Toolbar(this),
        this.editor  = new Rte.Editor(this),
        this.status  = new Rte.Status(this)
      )
      .setValue(this.textarea.value())
      .onFocus(R(this.status.update).bind(this.status));

    if (this.options.showToolbar) {
      this.toolbar.show();
    }

    if (this.options.showStatus) {
      this.status.show();
    }

    var size = this.textarea.size();

    this.insertTo(
      this.textarea.setStyle(
        'visibility:hidden;position:absolute;z-index:-1'
      ),'before'
    );

    this.editor.resize(size);
  },

  /**
   * Sets the value
   *
   * @param String value
   * @return Rte this
   */
  setValue: function(value) {
    this.textarea.value     = value;
    this.editor._.innerHTML = value;
    return this;
  },

  /**
   * Returns the current value
   *
   * @return String current value
   */
  getValue: function() {
    return this.textarea.value;
  },

  /**
   * Bidirectional method to set/get the value
   *
   * @param String value
   * @return Rte this or String value
   */
  value: function(value) {
    return this[value === undefined ? 'getValue' : 'setValue'](value);
  },

  /**
   * Disables the editor
   *
   * @return Rte this
   */
  disable: function() {
    this.disabled = true;
    return this.addClass('rui-rte-disabled');
  },

  /**
   * Enables the editor
   *
   * @return Rte this
   */
  enable: function() {
    this.disabled = false;
    return this.removeClass('rui-rte-disabled');
  },

  /**
   * Puts the focus into the editor
   *
   * @return Rte this
   */
  focus: function() {
    if (Rte.current !== this) {
      Rte.current = this;
      this.editor.focus();
    }

    return this;
  },

  /**
   * Looses focus from the editor
   *
   * @return Rte this
   */
  blur: function() {
    Rte.current = null;

    this.editor.blur();

    return this;
  }
});