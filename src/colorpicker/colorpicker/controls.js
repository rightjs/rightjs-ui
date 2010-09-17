/**
 * The controls block unit
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Controls = new Wrapper(Element, {
  initialize: function() {
    this.$super('div', {'class': 'controls'});
    this.insert([
        this.preview = $E('div', {'class': 'preview', 'html': '&nbsp;'}),
        this.display = $E('input', {'type': 'text', 'class': 'display', maxlength: 7}),
        $E('div', {'class': 'rgb-display'}).insert([
          $E('div').insert([$E('label', {html: 'R:'}), this.rDisplay = $E('input', {maxlength: 3, cIndex: 0})]),
          $E('div').insert([$E('label', {html: 'G:'}), this.gDisplay = $E('input', {maxlength: 3, cIndex: 1})]),
          $E('div').insert([$E('label', {html: 'B:'}), this.bDisplay = $E('input', {maxlength: 3, cIndex: 2})])
        ]),
        this.button  = new Button(Colorpicker.i18n.Done).onClick('fire', 'done')
      ]);
  }
});
