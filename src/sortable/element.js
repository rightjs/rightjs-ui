/**
 * Element level features for the Sortable unit
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
Element.include({
  /**
   * Tries to make a sortable unit out of the element
   *
   * @param Object options
   * @return Element this
   */
  makeSortable: function(options) {
    new Sortable(this, options);
    return this;
  },
  
  /**
   * Destroy the sortable functionality on the element
   *
   * @return Element this
   */
  undoSortable: function() {
    if (this._sortable) this._sortable.destroy();
    return this;
  }
});