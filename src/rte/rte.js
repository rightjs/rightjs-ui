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

      autoresize:   true,     // automatically resize the editor's height to fit the text

      showToolbar:  true,     // show the toolbar
      showStatus:   true,     // show the status bar

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
        'undo redo|header code quote|link image video|dotlist numlist|indent outdent|forecolor backcolor|source'
      ],
      extra: [
        'save clear|cut copy paste|bold italic underline strike ttext|left center right justify',
        'undo redo|header code quote|link image video|subscript superscript symbol|dotlist numlist|indent outdent',
        'style|fontname fontsize|forecolor backcolor|source'
      ]
    },

    // the formatting options, you can use simply tag names
    // or you can also specify tag + class like 'div.blue'
    Formats: {
      'h1':  'Header 1',
      'h2':  'Header 2',
      'h3':  'Header 3',
      'h4':  'Header 4',
      'h5':  'Header 5',
      'h6':  'Header 6',
      'p':   'Paragraph',
      'pre': 'Preformatted',
      'blockquote': 'Blockquote',
      'tt':         'Typetext',
      'address':    'Address'
    },

    // the font-name options
    FontNames: {
      'Andale Mono':     'andale mono,times',
      'Arial':           'arial,helvetica,sans-serif',
      'Arial Black':     'arial black,avant garde',
      'Book Antiqua':    'book antiqua,palatino',
      'Comic Sans MS':   'comic sans ms,sans-serif',
      'Courier New':     'courier new,courier',
      'Georgia':         'georgia,palatino',
      'Helvetica':       'helvetica',
      'Impact':          'impact,chicago',
      'Symbol':          'symbol',
      'Tahoma':          'tahoma,arial,helvetica,sans-serif',
      'Terminal':        'terminal,monaco',
      'Times New Roman': 'times new roman,times',
      'Trebuchet MS':    'trebuchet ms,geneva',
      'Verdana':         'verdana,geneva',
      'Webdings':        'webdings',
      'Wingdings':       'wingdings,zapf dingbats'
    },

    // the font-size options
    FontSizes: '7pt 8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 36pt',

    i18n: {
      Clear:      'Clear',
      Save:       'Save',
      Source:     'Source',
      Bold:       'Bold',
      Italic:     'Italic',
      Underline:  'Underline',
      Strike:     'Strike through',
      Ttext:      'Typetext',
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
      Indent:     'Indent',
      Outdent:    'Outdent',
      Forecolor:  'Text color',
      Backcolor:  'Background color',
      Select:     'Select',
      None:       'None',
      Style:      'Style',
      Fontname:   'Font name',
      Fontsize:   'Font size',
      Subscript:  'Subscript',
      Superscript: 'Superscript',
      Symbol:     'Special character'
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
        this.editor  = new Rte.Editor(this),
        this.status  = new Rte.Status(this)
      )
      .setValue(this.textarea.value())
      .onFocus(R(this.status.update).bind(this.status));

    if (!this.options.showToolbar) {
      this.toolbar.hide();
    }

    if (!this.options.showStatus) {
      this.status.hide();
    }

    var size = this.textarea.size();

    this.insertTo(this.textarea.setStyle(
      'visibility:hidden;position:absolute;z-index:-1'
    ),'before');

    // should be created after the editor on the page
    // because some tools check if they are supported
    this.toolbar = new Rte.Toolbar(this).insertTo(this, 'top');

    // enforcing the css-mode so that things like 'hilitecolor' worked properly
    try { document.execCommand("styleWithCSS", 0,     true);  } catch (e) {
    try { document.execCommand("useCSS",       0,     false); } catch (e) {
    try { document.execCommand('styleWithCSS', false, true);  } catch (e) {}}}

    this.editor.resize(size);
    this.setWidth(size.x);

    if (this.options.autoresize) {
      this.editor.setStyle({
        minHeight: size.y + 'px',
        height:  'auto'
      });
    }
  },

  /**
   * Sets the value
   *
   * @param String value
   * @return Rte this
   */
  setValue: function(value) {
    this.textarea.value = value;
    this.editor.update(value);
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