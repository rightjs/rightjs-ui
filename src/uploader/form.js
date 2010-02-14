/**
 * The Form unit `send` method overloading
 * so that we could catch up the moment when it sent
 *
 * Copyright (C) 2010 Nikolay V. Nemshilov
 */
Form.include((function(old_method) {
  return {
    send: function() {
      // initializing the uploading handler if it supposed to be there
      if (this.match(Uploader.Options.formCssRule)) {
        if (!this._uploader)
          new Uploader(this);
          
        this._uploader.start();
      }
      
      return old_method.apply(this, arguments);
    }
  }
})(Form.Methods.send));