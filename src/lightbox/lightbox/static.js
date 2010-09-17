/**
 * The class level interface
 *
 * @copyright (C) 2009 Nikolay Nemshilov
 */
Lightbox.extend({
  hide: function() {
    if (Lightbox.current) {
      Lightbox.current.hide();
    }
  },

  show: function() {
    return this.inst('show', arguments);
  },

  load: function() {
    return this.inst('load', arguments);
  },

// private

  inst: function(name, args) {
    var inst = new Lightbox();
    return inst[name].apply(inst, args);
  }
});
