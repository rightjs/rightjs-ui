/**
 * Dialog header line element
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Dialog.Head = new Class(Element, {

  initialize: function(dialog) {
    this.dialog  = dialog;
    this.options = dialog.options;

    this.$super('div', {'class': 'rui-dialog-head'});

    this.append(
      this.icon  = $E('div', {'class': 'icon'}),
      this.title = $E('div', {'class': 'title', 'html': '&nbsp;'}),
      this.tools = $E('div', {'class': 'tools'})
    );

    this.fsButton    = $E('div', {
      'class': 'expand', 'html': '&equiv;', 'title': Dialog.i18n.Expand
    }).onClick(function() {
      if (dialog.expanded) {
        dialog.collapse();
        this.html('&equiv;').set('title', Dialog.i18n.Expand);
      } else {
        dialog.expand();
        this.html('_').set('title', Dialog.i18n.Collapse);
      }
    });

    this.closeButton = $E('div', {
      'class': 'close',  'html': '&times;', 'title': Dialog.i18n.Close
    }).onClick(function() { dialog.fire('cancel'); });

    if (this.options.expandable) {
      this.tools.insert(this.fsButton);
    }

    if (this.options.closeable) {
      this.tools.insert(this.closeButton);
    }

    this.on({
      selectstart: function(e) { e.stop(); },
      mousedown:   this.dragStart
    });

    if (!this.options.draggable) {
      this.dialog.addClass('rui-dialog-nodrag');
    }
  },

// protected

  dragStart: function(event) {
    if (this.options.draggable && !event.find('div.tools div')) {
      var dim = this.dialog.dimensions(),
          ev_pos = event.position();

      this.xDiff = dim.left - ev_pos.x;
      this.yDiff = dim.top  - ev_pos.y;
      this.maxX  = $(window).size().x - dim.width - 20;
      this.dlgStyle = this.dialog.get('style');

      Dialog.dragged = this.dialog;

      event.stop();
    }
  },

  dragMove: function(event) {
    var event_pos = event.position(),
        pos_x = event_pos.x + this.xDiff,
        pos_y = event_pos.y + this.yDiff;

    if (pos_x < 0) { pos_x = 0; }
    else if (pos_x > this.maxX) { pos_x = this.maxX; }
    if (pos_y < 0) { pos_y = 0; }

    this.dlgStyle.top  = pos_y + 'px';
    this.dlgStyle.left = pos_x + 'px';
  },

  dragStop: function(event) {
    Dialog.dragged = false;
  }
});