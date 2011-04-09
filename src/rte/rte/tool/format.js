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

    // reclonning the data so it wasn't lost on changes
    range = {
      startContainer: range.startContainer,
      startOffset:    range.startOffset,
      endContainer:   range.endContainer,
      endOffset:      range.endOffset,
      collapsed:      range.collapsed
    };

    /**
     * Places the selection markers into the editor's structure
     *
     * @param String name 'end' or 'start'
     * @return void
     */
    function place_marker(name) {
      var node   = range[name + 'Container'],
          offset = range[name + 'Offset'],
          marker = document.createElement('span'),
          parent = node.parentNode,
          text   = node.nodeValue,
          ending = document.createTextNode((''+text).substr(offset));

      marker.setAttribute('rrte-'+name, '1');

      function insert_after(content, anchor) {
        if (anchor.nextSibling) {
          anchor.parentNode.insertBefore(content, anchor.nextSibling);
        } else {
          anchor.parentNode.appendChild(content);
        }
      }

      if (node.nodeType === 3) { // text-node
        if (offset === 0) {
          parent.insertBefore(marker,
            // in case both of the markers are at the beginning of
            // the same node, the 'end' marker will be already there
            // and we will need to insert the 'start' one before it.
            name === 'start' && range.collapsed ? node.previousSibling : node
          );
        } else if (offset === text.length) {
          insert_after(marker, node);
        } else {   // splitting the text node in two
          node.nodeValue = text.substr(0, offset);
          insert_after(ending, node);
          parent.insertBefore(marker, ending);
        }

      } else {
        if (offset === 0) {
          if (node.firstChild) {
            node.insertBefore(marker, node.firstChild);
          } else {
            node.appendChild(marker);
          }
        } else if (offset === node.childNodes.length) {
          node.appendChild(marker);
        } else {
          node.insertBefore(marker, node.childNodes[offset]);
        }
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
      editor.html(editor.html()
        .replace(new RegExp(RegExp.escape(start_marker), 'i'), open_tag + start_marker)
        .replace(new RegExp(RegExp.escape(end_marker), 'i'), end_marker + close_tag)
      );
    } else if (element && selected === content) {
      // plainly remove the element if it was fully selected
      // in case there are several nested elements so that
      // we didn't get screwed with the regexps manipulations
      editor.removeElement(element);
    } else {
      editor.html(editor.html()
        .replace(new RegExp(RegExp.escape(start_marker), 'i'), close_tag + start_marker)
        .replace(new RegExp(RegExp.escape(end_marker), 'i'),   end_marker + open_tag)
          // cleaning up empty tags
        .replace(new RegExp(RegExp.escape(open_tag + close_tag), 'ig'), '')
      );
    }

    /////////////////////////////////////////////////////////////////
    // Restoring the selection range
    /////////////////////////////////////////////////////////////////
    var elements = $A(editor._.getElementsByTagName('span')),
        i=0, method, parent, offset;

    range = this.rte.selection.range();

    for (; i < elements.length; i++) {
      method = elements[i].getAttribute('rrte-start') ? 'setStart' :
               elements[i].getAttribute('rrte-end') ? 'setEnd' : false;

      if (method) {
        parent = elements[i].parentNode;
        offset = IER_getIndex(elements[i]);
        parent.removeChild(elements[i]);
        range[method](parent, offset);
      }
    }

    this.rte.selection.range(range);
  }

});