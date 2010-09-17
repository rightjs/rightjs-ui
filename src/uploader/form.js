/**
 * Overloading the Form#send method so we could
 * catch up the moment when a form was sent and show the bar
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var old_send = Form.prototype.send;

Form.include({
  send: function() {

    if (!this.uploader && (this.match(Uploader.Options.cssRule) || this.first('.rui-uploader'))) {
      this.uploader = new Uploader(this);
    }

    if (this.uploader) {
      this.uploader.start();
    }

    return old_send.apply(this, arguments);
  }
});
