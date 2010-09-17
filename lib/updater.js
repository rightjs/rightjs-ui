/**
 * Same as the assignable, only it doesn't work with popups
 * instead it simply updates the assigned unit value/content
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Updater = {

  /**
   * Assigns the unit to work with an input element
   *
   * @param mixed element reference
   * @return Rater this
   */
  assignTo: function(element) {
    var assign  = R(function(element, event) {
      if ((element = $(element))) {
        element[element.setValue ? 'setValue' : 'update'](event.target.getValue());
      }
    }).curry(element);

    var connect = R(function(element, object) {
      element = $(element);
      if (element && element.onChange) {
        element.onChange(R(function() {
          this.setValue(element.value());
        }).bind(object));
      }
    }).curry(element);

    if ($(element)) {
      assign({target: this});
      connect(this);
    } else {
      $(document).onReady(R(function() {
        assign({target: this});
        connect(this);
      }.bind(this)));
    }

    return this.onChange(assign);
  }
};
