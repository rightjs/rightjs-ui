/**
 * Rte's toolbar unit
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Toolbar = new Class(Element, {

  initialize: function(rte) {
    this.$super('div', {'class': 'rui-rte-toolbar'});

    this.rte  = rte;
    rte.tools = {};

    var options = rte.options, toolbar = options.toolbar;

    R(Rte.Toolbars[toolbar] || (isArray(toolbar) ? toolbar : [toolbar])).each(function(line_s) {
      var line = $E('div', {'class': 'line'}).insertTo(this);

      R(line_s.split('|')).each(function(bar_s) {
        if (!R(bar_s).blank()) {
          var bar = $E('div', {'class': 'bar'}).insertTo(line);

          R(bar_s.split(' ')).each(function(tool) {
            tool = R(tool).capitalize();
            bar.insert(new Rte.Tools[tool](rte));
          });
        }
      });
    }, this);

    // adding hidden undo/redo tools if they are not on the toolbar
    // so that the undoer kicked in on the keybindings
    rte.tools.Undo || new Rte.Tools.Undo(rte);
    rte.tools.Redo || new Rte.Tools.Redo(rte);
  },

  /**
   * Finds a tool for the keyboard event
   *
   * @param {Event} event
   * @return {Rte.Tool} wired tool or false
   */
  shortcut: function(event) {
    var raw  = event._, key, tool;

    for (key in this.rte.tools) {
      tool = this.rte.tools[key];

      if (tool.shortcut === raw.keyCode && tool.shiftKey === raw.shiftKey) {
        return tool;
      }
    }

    return null;
  }

});