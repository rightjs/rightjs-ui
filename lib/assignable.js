/**
 * A shared module that provides for the widgets an ability
 * to be assigned to an input element and work in pair with it
 *
 * NOTE: this module works in pair with the 'RePosition' module!
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Assignable = {
  /**
   * Assigns the widget to serve the given input element
   *
   * Basically it puts the references of the current widget
   * to the input and trigger objects so they could be recognized
   * later, and it also synchronizes the changes between the input
   * element and the widget
   *
   * @param {Element} input field
   * @param {Element} optional trigger
   * @return Widget this
   */
  assignTo: function(input, trigger) {
    input   = RightJS.$(input);
    trigger = RightJS.$(trigger);

    if (trigger) {
      trigger[this.key] = this;
      trigger.assignedInput = input;
    } else {
      input[this.key] = this;
    }

    var on_change = RightJS(function() {
      if (this.visible() && (!this.showAt || this.shownAt === input)) {
        this.setValue(input.value());
      }
    }).bind(this);

    input.on({
      keyup:  on_change,
      change: on_change
    });

    this.onChange(function() {
      if (!this.showAt || this.shownAt === input) {
        input.setValue(this.getValue());
      }
    });

    return this;
  }
};
