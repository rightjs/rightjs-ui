/**
 * Rte's toolbar unit
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Toolbar = new Class(Element, {

  initialize: function(rte) {
    this.$super('div', {'class': 'rui-rte-toolbar'});

    this.rte    = rte;
    rte.actions = [];
    rte.shortcuts = {};

    var options = rte.options, toolbar = options.toolbar;

    R(Rte.Toolbars[toolbar] || (isArray(toolbar) ? toolbar : [toolbar])).each(function(line_s) {

      var line = $E('div', {'class': 'line'}).insertTo(this);

      R(line_s.split('|')).each(function(bar_s) {

        if (!R(bar_s).blank()) {
          var bar = $E('div', {'class': 'bar'}).insertTo(line);

          R(bar_s.split(' ')).each(function(action) {
            action = R(action).capitalize();

            if (Rte.Action[action]) {
              bar.insert(new Rte.Action[action](rte));
            }
          });
        }
      });
    }, this);

  }

});