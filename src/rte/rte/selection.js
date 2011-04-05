/**
 * This class handles the selection ranges
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
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
   * gets/sets the current range object
   *
   * @param {Range} to set
   * @return TextRange range
   */
  range: function(range) {
    var selection = window.getSelection && window.getSelection();

    if (range) {
      if (selection) { // w3c
        selection.removeAllRanges();
        selection.addRange(range);
      } else if (range._) { // IE
        range._.select();
      }

    } else {
      try {
        range = selection.getRangeAt(0);
      } catch (e) {
        try {
          range = document.createRange();
        } catch (ee) {
          range = new IERangeEmulator();
        }
      }

      // Webkit needs the range to be preset first
      if (selection && selection.focusNode && range.setStart) {
        range.setStart(selection.anchorNode, selection.anchorOffset);
        range.setEnd(selection.focusNode, selection.focusOffset);
      }

      return range;
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
  store: function() {
    var range = this.range(), editor = this.rte.editor._.parentNode;

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

          for (var i=0, nodes = element.parentNode.childNodes; i < nodes.length; i++) {
            if (nodes[i] === element) {
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
        range  = this.range();

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

        this.range(range);
      } catch(e) {}
    }
  },

  /**
   * Returns the dom-node that's currently in focus
   *
   * @return raw dom-node
   */
  node: function() {
    var range = this.range(), node = range.commonAncestorContainer;

    // if there is a selection, trying those
    if (!range.collapsed) {
      if (
        range.startContainer === range.endContainer &&
        range.startOffset - range.endOffset < 2     &&
        range.startContainer.hasChildNodes()
      ) {
        node = range.startContainer.childNodes[range.startOffset];
      }
    }

    node = node && node.nodeType === 3 ? node.parentNode : node;

    return node;
  },

  /**
   * Puts current selection over the given raw dom-node
   *
   * @param raw dom-node
   * @return void
   */
  wrap: function(node) {
    var range = this.range();
    range.selectNode(node);
    this.range(range);
  },

  /**
   * Returns the selection text
   *
   * @return String selection text
   */
  text: function() {
    return '' + this.range();
  },

  /**
   * Cheks if the selection is empty
   *
   * @return boolean check result
   */
  empty: function() {
    return this.text() === '';
  },

  /**
   * Returns the HTML content of the selection
   *
   * @return String html content
   */
  html: function() {
    var range = this.range(), tmp, fragment;

    if (range._) {
      return range._.htmlText;
    } else {
      tmp = document.createElement('div');
      fragment = range.cloneContents();

      while (fragment.firstChild) {
        tmp.appendChild(fragment.firstChild);
      }

      return tmp.innerHTML;
    }
  },

  /**
   * executes a command on this editing area
   *
   * @param String command name
   * @param mixed command value
   * @return Rte.Editor this
   */
  exec: function(command, value) {
    try {
      // it throws errors in some cases in the non-design mode
      document.execCommand(command, false, value);
    } catch(e) {
      // emulating insert html under IE
      if (command === 'inserthtml') {
        try {
          this.range()._.pasteHTML = value;
        } catch(ee) {}
      }
    }
  }
});


/**
 * W3C ranges emulator for the old IE browsers
 *
 * Copyrgiht (C) 2011 Nikolay Nemshilov
 */
var IERangeEmulator = new Class({
  initialize: function() {
    this._ = document.selection.createRange();
  }
});