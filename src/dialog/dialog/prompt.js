/**
 * The prompt dialog class
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Dialog.Prompt = new Class(Dialog, {
  /**
   * prompts constructor, you can use additional options with this one
   *
   *   * `label` - the text for the input field label
   *   * `input` - the input field options (standard for Input unit)
   *
   * @param Object options
   * @return void
   */
  initialize: function(options) {
    options = Object.merge({
      showIcon: '&#x27A5;',
      title:    Dialog.i18n.Prompt,
      label:    Dialog.i18n.Prompt
    }, options);

    this.$super(options);
    this.addClass('rui-dialog-prompt');

    this.html([
      $E('label', {html: this.options.label}),
      this.input = new RightJS.Input(this.options.input || {})
    ]);

    if (this.input.get('type') !== 'textarea') {
      this.input.onKeydown(R(function(event) {
        if (event.keyCode === 13) {
          this.fire('ok');
        }
      }).bind(this));
    }
  },

  show: function() {
    this.$super.apply(this, arguments);
    this.input.select();
    return this;
  }

});