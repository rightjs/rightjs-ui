/**
 * Text formatting specific abstract tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
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
        range     = this.rte.selection.get(),
        editor    = this.rte.editor._;

    // building the open-tag attributes
    for (var attr in this.attrs) {
      open_tag += ' '+ attr +'="'+ this.attrs[attr]+ '"';
    }
    open_tag += ">";

    // reclonning the data so it wasn't lost on changes
    range = {
      startContainer: range.startContainer,
      startOffset:    range.startOffset,
      endContainer:   range.endContainer,
      endOffset:      range.endOffset
    };

    /**
     * Places the selection markers into the editor's structure
     *
     * @param String name 'end' or 'start'
     * @return void
     */
    function place_marker(name) {
      var container = range[name + 'Container'],
          offset    = range[name + 'Offset'],
          parent    = container.parentNode,
          marker    = document.createElement('span');

      marker.setAttribute('rrte-'+name, '1');

      function insert_after(content, anchor) {
        if (anchor.nextSibling) {
          anchor.parentNode.insertBefore(content, anchor.nextSibling);
        } else {
          anchor.parentNode.appendChild(content);
        }
      }

      if (offset === 0) {
        parent.insertBefore(marker,
          // in case both of the markers are at the beginning of
          // the same node, the 'end' marker will be already there
          // and we will need to insert the 'start' one before it.
          name === 'start' && offset === range.endOffset &&
          container === range.endContainer ?
            container.previousSibling : container
        );
      } else if (text ? offset === text.length : offset === container.childNodes.length) {
        insert_after(marker, container);
      } else if (container.nodeType === 3) { // splitting up a textual node
        var text   = container.nodeValue,
            ending = document.createTextNode(text.substr(offset));

        container.nodeValue = text.substr(0, offset);
        insert_after(ending, container);
        parent.insertBefore(marker, ending);
      } else { // inserting the marker in a middle of a dom-element
        container.insertBefore(marker, container.childNodes[offset]);
      }
    }

    // NOTE: the 'end' should be before the 'start' in case both of them
    //       are in the same node, so that the offest didn't shift after
    //       we insert the marker nodes
    place_marker('end');
    place_marker('start');

    /////////////////////////////////////////////////////////////////
    // Performing the actual formatting
    /////////////////////////////////////////////////////////////////
    var start_marker = '<span rrte-start="1"></span>',
        end_marker   = '<span rrte-end="1"></span>';

    if (formatting) {
      editor.innerHTML = editor.innerHTML
        .replace(start_marker, open_tag + start_marker)
        .replace(end_marker, end_marker + close_tag);
    } else {
      editor.innerHTML = editor.innerHTML
        .replace(start_marker, close_tag + start_marker)
        .replace(end_marker,   end_marker + open_tag)
        // cleaning up empty tags
        .replace(new RegExp(RegExp.escape(open_tag + close_tag), 'ig'), '');
    }

    /////////////////////////////////////////////////////////////////
    // Restoring the selection range
    /////////////////////////////////////////////////////////////////
    var elements = $A(editor.getElementsByTagName('span')),
        range    = this.rte.selection.get(),
        i=0, method, parent, offset;

    for (; i < elements.length; i++) {
      method = elements[i].getAttribute('rrte-start') ? 'setStart' :
               elements[i].getAttribute('rrte-end') ? 'setEnd' : false;

      if (method) {
        parent = elements[i].parentNode;
        offset = $A(parent.childNodes).indexOf(elements[i]);
        parent.removeChild(elements[i]);
        range[method](parent, offset);
      }
    }

    this.rte.selection.set(range);
  }

});