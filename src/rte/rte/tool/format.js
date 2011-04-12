/**
 * Text formatting specific abstract tool
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
Rte.Tool.Format = new Class(Rte.Tool, {
  tag:  null, // element's tag name
  atts: {},   // element's attributes

  /**
   * Formatting tools basic constructor
   *
   * @param Rte rte
   * @return Rte.ToolFormat this
   */
  initialize: function(rte) {
    this.$super(rte);
    this.tag = (this.tag || Rte.Tags[this.name] || '').toUpperCase();
    return this;
  },

  /**
   * triggering the formatting
   *
   * @return void
   */
  exec: function() {
    this[this.active() ? 'unformat' : 'format']();
  },

  /**
   * Overloading the activity checks
   *
   * @return boolean check result
   */
  active: function() {
    return this.element() !== null;
  },

// protected

  /**
   * Tries to find a currently active element
   *
   * @return raw dom element or null
   */
  element: function() {
    return this.rte.status.findElement(this.tag, this.attrs);
  },

  /**
   * Removes the formatting
   *
   * @return void
   */
  unformat: function() {
    this._format(false);
  },

  /**
   * Formats the block according to the settings
   *
   * @return void
   */
  format: function() {
    this._format(true);
  },

// private

  /**
   * The actual formatting/unformatting process mumbo-jumbo
   *
   * @param boolean formatting direction true/false
   * @return void
   */
  _format: function(formatting) {
    var open_tag  = '<'+  this.tag,
        close_tag = '</'+ this.tag + '>',
        editor    = this.rte.editor,
        selection = this.rte.selection,
        range     = selection.range(),
        selected  = selection.text(),
        element   = this.element(),
        content   = element && (element.textContent || element.innerText);

    // building the open-tag attributes
    for (var attr in this.attrs) {
      open_tag += ' '+ attr +'="'+ this.attrs[attr]+ '"';
    }
    open_tag += ">";

    selection.store();

    // Old IEs screw with the starting position
    // placing it before the open tag, so here we switch it back
    if (!formatting && range._) {
      editor.html(editor.html().replace(
        new RegExp(RegExp.escape(SELECTION_START_MARKER + open_tag), 'i'),
        open_tag + SELECTION_START_MARKER
      ));
    }


    if (formatting) {
      editor.html(editor.html()
        .replace(SELECTION_START_RE, open_tag + SELECTION_START_MARKER)
        .replace(SELECTION_END_RE,  SELECTION_END_MARKER + close_tag)
      );
    } else if (element && selected === content) {
      // plainly remove the element if it was fully selected
      // in case there are several nested elements so that
      // we didn't get screwed with the regexps manipulations
      editor.removeElement(element);
    } else {
      editor.html(editor.html()
        .replace(SELECTION_START_RE, close_tag + SELECTION_START_MARKER)
        .replace(SELECTION_END_RE, SELECTION_END_MARKER + open_tag)

        // cleaning up empty tags that might left
        .replace(/<([a-z]+)[^>]*?>\s*?<\/\1>/ig, '')
      );
    }

    selection.restore();
  }

});