/**
 * Input level hooks to convert textareas into RTE
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Input.include({
  /**
   * converts an input field into a RTE
   *
   * @param Object options
   * @return Rte editor
   */
  getRich: function(options) {
    if (this._.type === 'textarea' && !this.rte) {
      this.rte = new Rte(this, options);
    }

    return this.rte;
  }
});