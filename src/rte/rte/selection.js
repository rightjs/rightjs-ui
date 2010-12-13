/**
 * This class handles the selection ranges
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Selection = new Class({

  /**
   * Basic constructor
   *
   * @param Rte rte
   * @return void
   */
  initialize: function(rte) {
    this.rte = rte;
  },

  /**
   * Returns current selected text range
   *
   * @return TextRange range
   */
  get: function() {
    try { // W3C
      return window.getSelection().getRangeAt(0);
    } catch(e) {
      try { // IE
        return document.selection.createRange();
      } catch (e) { // Safari
        var selection = window.getSelection(), range = document.createRange();
        if (selection.focusNode) {
          range.setStart(selection.anchorNode, selection.anchorOffset);
          range.setEnd(selection.focusNode, selection.focusOffset);
        }
        return range;
      }
    }
  },

  /**
   * Sets the selection by range
   *
   * @param TextRange range
   * @return void
   */
  set: function(range) {
    if (range.select) {  // IE
      range.select();
    } else { // w3c
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  },

  /**
   * Saves the current selection range
   *
   * Basically we create a pair of sequences of offsets
   * from the selection's start and the end containers, from
   * top to the editor's element, so that later on, we could
   * try to restore the selection position even if the real
   * data was lost or changed manually via the `innerHTML`
   * assignment
   *
   * @return Array bookmark
   */
  save: function() {
    var range = this.get(), editor = this.rte.editor._.parentNode;

    function find_position(type) {
      var marker  = [],
          found   = false,
          element = range[type + 'Container'],
          offset  = range[type + 'Offset'];

      while (element.parentNode) {
        if (element === editor) {
          found = true;
          break;
        } else {
          marker.push(offset);

          for (var i=0; i < element.parentNode.childNodes.length; i++) {
            if (element.parentNode.childNodes[i] === element) {
              offset = i;
              break;
            }
          }

          element = element.parentNode;
        }
      }

      return found ? marker : [];
    }

    return (this.mark = [find_position('start'), find_position('end')]);
  },

  /**
   * Restores previously stored selection range
   *
   * SEE: the #save method for more details
   *
   * @param Array bookmark
   * @return void
   */
  restore: function(bookmark) {
    var marker = bookmark || this.mark,
        editor = this.rte.editor._,
        range  = document.selection ? document.selection.createRange() : document.createRange();

    function set_position(what, markers) {
      var element = editor,
          offset  = markers.shift(),
          i = markers.length - 1;

      for (; i > -1; i--) {
        if (!(element.tagName && (element = element.childNodes[markers[i]]))) {
          break;
        }
      }

      if (element && element !== editor) {
        range[what](element, offset);
      }
    }

    if (marker) {
      try { // sometimes the offsets might not exist anymore
        set_position('setStart', marker[0]);
        set_position('setEnd',   marker[1]);

        this.set(range);
      } catch(e) {}
    }
  },

  /**
   * Returns the dom-node that's currently in focus
   *
   * @return raw dom-node
   */
  node: function() {
    var range = this.get(), node;

    if (range.startContainer) {
      // getting the basic common container
      node = range.commonAncestorContainer;

      // if there is a selection trying those
      if (!range.collapsed) {
        if (
          range.startContainer == range.endContainer &&
          range.startOffset - range.endOffset < 2    &&
          range.startContainer.hasChildNodes()
        ) {
          node = range.startContainer.childNodes[range.startOffset];
        }
      }

      node = node && node.nodeType === 3 ? node.parentNode : node;
    } else {
      node = range.item ? range.item(0) : range.parentElement();
    }

    return node;
  },

  /**
   * Puts current selection over the given raw dom-node
   *
   * @param raw dom-node
   * @return void
   */
  wrap: function(element) {
    var range = this.get();

    if (range.setStart) {
      range.selectNode(element);
      this.set(range);
    } else {
      // TODO IE version
    }
  },

  /**
   * Returns the selection text
   *
   * @return String selection text
   */
  text: function() {
    var range = this.get();
    return '' + (range.text ? range.text : range);
  },

  /**
   * Cheks if the selection is empty
   *
   * @return boolean check result
   */
  empty: function() {
    return this.text() == '';
  },

  /**
   * Returns the HTML content of the selection
   *
   * @return String html content
   */
  html: function() {
    var range = this.get(), tmp, fragment;

    if (range.htmlText) {
      return range.htmlText;
    } else {
      tmp = document.createElement('div');
      fragment = range.cloneContents();

      while (fragment.firstChild) {
        tmp.appendChild(fragment.firstChild);
      }

      return tmp.innerHTML;
    }
  }
});