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
   * Returns the dom-node that's currently in focus
   *
   * @return raw dom-element
   */
  element: function() {
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

    return node || null;
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
    return this.range().toString();
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
   * @return void
   */
  exec: function(command, value) {
    try {
      // it throws errors in some cases in the non-design mode
      document.execCommand(command, false, value);
    } catch(e) {
      // emulating insert html under IE
      if (command === 'inserthtml') {
        this.range()._.pasteHTML = value;
      }
    }
  },

  /**
   * Saves the selection by inserting special SPAN elements
   * in places where the selection starts and ends so that
   * it could be restored later, even if the editor innerHTML
   * property was manipulated directly
   *
   * @return {Rte.Selection} this
   */
  store: function() {
    var range = this.range();

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
  },

  /**
   * Restores the selection by previously placed
   * special SPAN elements and removes them afterwards
   *
   * @return {Rte.Selection} this
   */
  restore: function() {
    var elements = $A(this.rte.editor._.getElementsByTagName('span')),
        i=0, method, parent, offset, range = this.range();

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

    this.range(range);
  }
});


/**
 * W3C ranges API emulator for the old IE browsers
 *
 * Based on the `InternetExplorerRange` implementation
 * from the http://mozile.mozdev.org project
 * by James A. Overton <james@overton.ca>
 *
 * Originally licensed under MPL/GPL2/LGPL2 licenses
 *
 * Copyrgiht (C) 2011 Nikolay Nemshilov
 */
var IERangeEmulator = new Class({

  // standard w3c attributes
  collapsed:               null,
  startContainer:          null,
  startOffset:             null,
  endContainer:            null,
  endOffset:               null,
  commonAncestorContainer: null,

  /**
   * Basic constructor
   *
   * @return void
   */
  initialize: function() {
    this._ = document.selection.createRange();

    //startPoint
    var range = this._.duplicate();
    range.collapse(true);
    range = IER_getPosition(range);

    this.startContainer = range.node;
    this.startOffset    = range.offset;

    //endPoint
    range = this._.duplicate();
    range.collapse(false);
    range = IER_getPosition(range);

    this.endContainer = range.node;
    this.endOffset    = range.offset;

    // the rest of the properties
    IER_commonAncestorContainer(this);
    IER_collapsed(this);
  },

  /**
   * Sets the starting point for the range
   *
   * @param {Node} node
   * @param {Number} offset
   * @return void
   */
  setStart: function(node, offset) {
    var range = this._.duplicate();

    range.moveToElementText(node.nodeType === 1 ? node : node.parentNode);
    range.collapse(true);
    range.move('Character', IER_getOffset(node, offset));

    this._.setEndPoint('StartToStart', range);

    this.startContainer = node;
    this.startOffset    = offset;

    if (this.endContainer === null && this.endOffset === null) {
      this.endContainer = node;
      this.endOffset    = offset;
    }

    IER_commonAncestorContainer(this);
    IER_collapsed(this);
  },

  /**
   * Setting the end point for the range
   *
   * @param {Node} node
   * @param {Number} offset
   * @return void
   */
  setEnd: function (node, offset) {
    var range = this._.duplicate(), container;

    range.collapse(true);
    container = node.nodeType === 1 ? node : node.parentNode;

    range = this._.duplicate();
    range.moveToElementText(container);
    range.collapse(true);
    range.move('Character', IER_getOffset(node, offset));

    this._.setEndPoint('EndToEnd', range);

    this.endContainer = node;
    this.endOffset    = offset;

    if (this.startContainer === null && this.startOffset === null) {
      this.startContainer = node;
      this.startOffset    = offset;
    }

    IER_commonAncestorContainer(this);
    IER_collapsed(this);
  },

  /**
   * Setting the starting point right before the given node
   *
   * @param {Node} node
   * @return void
   */
  setStartBefore: function (node) {
    this.setStart(node.parentNode, IER_getIndex(node));
  },

  /**
   * Setting the starting point right after the given node
   *
   * @param {Node} node
   * @return void
   */
  setStartAfter: function (node) {
    this.setStart(node.parentNode, IER_getIndex(node) + 1);
  },

  /**
   * Setting the ending point right before the given node
   *
   * @param {Node} node
   * @return void
   */
  setEndBefore: function (node) {
    this.setEnd(node.parentNode, IER_getIndex(node));
  },

  /**
   * Setting the ending point right after the given node
   *
   * @param {Node} node
   * @return void
   */
  setEndAfter: function (node) {
    this.setEnd(node.parentNode, IER_getIndex(node) + 1);
  },

  /**
   * Wrapps the range around the given node
   *
   * @param {Node} node
   * @return void
   */
  selectNode: function (node) {
    this.setStartBefore(node);
    this.setEndAfter(node);
  },

  /**
   * Sets the Range to contain the contents of a Node.
   * The parent Node of the start and end of the Range will be the node. The
   * startOffset is 0, and the endOffset is the number of child Nodes or number of characters
   * contained in the reference node.
   * @param {Node} node
   * @type Void
   */
  selectNodeContents: function (node) {
    this.setStart(node, 0);
    this.setEnd(
      node, node.nodeType === 3 ?
      node.data.length : node.childNodes.length
    );
  },

  /**
   * Selection text emulation
   *
   * @return {String} text
   */
  toString: function() {
    return ''+ this._.text;
  }
});


//////////////////////////////////////////////////////////////////////////////
// Some private methods for the IERangeEmaulator
//////////////////////////////////////////////////////////////////////////////


/**
 * Finds the standard node/offset pair out of the
 * IE range object
 *
 * @param {TextRange} ie text range object
 * @return {Object} 'node' and 'offset' pairs
 */
function IER_getPosition(original_range) {
  var element = original_range.parentElement(),
      range, range_size, direction, node, node_size;

  range = element.ownerDocument.body.createTextRange();
  range.moveToElementText(element);
  range.setEndPoint("EndToStart", original_range);

  range_size = range.text.length;

  // Choose Direction
  if (range_size < element.innerText.length / 2) {
    direction = 1;
    node = element.firstChild;
  } else {
    direction = -1;
    node = element.lastChild;
    range.moveToElementText(element);
    range.setEndPoint("StartToStart", original_range);
    range_size = range.text.length;
  }

  // Loop through child nodes
  while (node) {
    switch (node.nodeType) {
      case 3: // text-node
        node_size = node.data.length;
        if(node_size < range_size) {
          range_size -= node_size;

          if (direction === 1) {
            range.moveStart("character", range_size);
          } else {
            range.moveEnd("character", -range_size);
          }

        } else {
          return direction === 1 ?
            {node: node, offset: range_size} :
            {node: node, offset: node_size - range_size};
        }
        break;

      case 1: // element-node
        node_size = node.innerText.length;

        if (direction === 1) {
          range.moveStart("character", node_size);
        } else {
          range.moveEnd("character", -node_size);
        }

        range_size = range_size - node_size;
        break;
    }

    node = direction === 1 ? node.nextSibling : node.previousSibling;
  }

  // The TextRange was not found. Return a reasonable value instead.
  return {node: element, offset: 0};
}

/**
 * Find the TextRange offset for a given text node and offset
 *
 * @param {TextNode} start_node The target text node.
 * @param {Number} start_offset
 * @return {Number} offset
 */
function IER_getOffset(start_node, start_offset) {
  var node, offset, node_size;

  if (start_node.nodeType === 3) { // a text-node
    offset = start_offset;
    node   = start_node.previousSibling;
  } else if (start_node.nodeType === 1) { // element node
    offset = 0;

    if(start_offset > 0) {
      node = start_node.childNodes[start_offset - 1];
    } else {
      return 0;
    }
  } else {
    return 0; // fallback
  }

  while (node) {
    node_size = 0;

    if (node.nodeType === 1) { // element node
      node_size = node.hasChildNodes() ? node.innerText.length + 1 : 1;
    } else if (node.nodeType === 3) { // text node
       node_size = node.data.length;
    }

    offset += node_size;
    node    = node.previousSibling;
  }

  return offset;
}


/**
 * Assigns a suitable `commonAncestorContainer` property for the range
 *
 * @param {IERangeEmulator} range
 * @return void
 */
function IER_commonAncestorContainer(range) {
  range.commonAncestorContainer =
    range.startContainer === null || range.endContainer === null ? null : (
      range.startContainer === range.endContainer ?
        range.startContainer : IER_commonParent(
          range.startContainer, range.endContainer
        )
    );
}

/**
 * Sets the `collapsed` property for the range
 *
 * @param {IERangeEmulator} range
 * return void
 */
function IER_collapsed(range) {
  range.collapsed =
    range.startContainer === range.endContainer &&
    range.startOffset    === range.endOffset;
}

/**
 * Finds out the node's index among it's siblings
 *
 * @param {Node} node
 * @return {Number} index
 */
function IER_getIndex(node) {
  var index = 0;

  while ((node = node.previousSibling)) {
    index ++;
  }

  return index;
}

/**
 * Finds a common parent for those two nodes
 *
 * @param {Node} node1
 * @param {Node} node2
 * @return {Node} the first common parent
 */
function IER_commonParent(node1, node2) {
  var parents1 = [], parents2 = [], node;

  node = node1;
  while (node) {
    parents1.push(node);
    node = node.parentNode;
  }

  node = node2;
  while (node) {
    parents2.push(node);
    node = node.parentNode;
  }

  node = parents1.unshift();
  while (node) {
    if (node === parents2[0]) {
      parents2.unshift();
    } else {
      return node;
    }

    node = parents1.unshift();
  }

  return null;
}