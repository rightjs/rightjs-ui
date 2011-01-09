/**
 * The dialog element wrapper
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var Dialog = new Class(Element, {
  /**
   * Constructor
   *
   * @param Object options
   * @return void
   */
  initialize: function(options) {
    var i18n = Lightbox.i18n;

    this.options = options;
    this.$super('div', {'class': 'rui-lightbox-dialog'});

    // building up the
    this.insert([
      this.title = $E('div', {'class': 'rui-lightbox-title'}),

      $E('div', {'class': 'rui-lightbox-body'}).insert(
        $E('div', {'class': 'rui-lightbox-body-inner'}).insert([
          this.locker    = $E('div', {'class': 'rui-lightbox-body-locker'}).insert(new Spinner(4)),
          this.scroller  = $E('div', {'class': 'rui-lightbox-scroller'}).insert(
            this.content = $E('div', {'class': 'rui-lightbox-content'})
          )
        ])
      ),

      $E('div', {'class': 'rui-lightbox-navigation'}).insert([
        this.closeButton = $E('div', {'class': 'close', html: '&times;', title: i18n.Close}).onClick('fire', 'close'),
        this.prevLink    = $E('div', {'class': 'prev',  html: '&larr;',  title: i18n.Prev}).onClick('fire',  'prev'),
        this.nextLink    = $E('div', {'class': 'next',  html: '&rarr;',  title: i18n.Next}).onClick('fire',  'next')
      ])
    ]);

    // presetting the navigation state
    this.prevLink.hide();
    this.nextLink.hide();

    if (!options.showCloseButton) {
      this.closeButton.hide();
    }
  },

  /**
   * Sets the dialogue caption
   *
   * @param String title
   * @return Dialog this
   */
  setTitle: function(title) {
    this.title.update(title||'');
  },

  /**
   * Nicely resize the dialog box
   *
   * @param Object the end size
   * @param Boolean use fx (false by default)
   * @return Dialog this
   */
  resize: function(end_size, with_fx) {
    var win_size = this.parent().size(),
        cur_size = this.scroller.size(),
        cur_top  = (win_size.y - this.size().y)/2,
        dlg_diff = this.size().x - cur_size.x; // <- use for IE6 fixes

    if (end_size) {
      // getting the actual end-size
      end_size = this.scroller.setStyle(end_size).size();

      this.scroller.setStyle({
        width:  cur_size.x + 'px',
        height: cur_size.y + 'px'
      });
    } else {
      // using the content block size
      end_size = this.content.size();
    }

    // checking the constraints
    var threshold = 100; // px
    if ((end_size.x + threshold) > win_size.x) { end_size.x = win_size.x - threshold; }
    if ((end_size.y + threshold) > win_size.y) { end_size.y = win_size.y - threshold; }

    // the actual resize and reposition
    var end_top = (cur_top * 2 + cur_size.y - end_size.y) / 2;
    var dialog  = this._.style, content = this.scroller._.style;

    if (RightJS.Fx && with_fx && (end_size.x != cur_size.x || end_size.y != cur_size.y)) {

      $ext(new RightJS.Fx(this, {duration: this.options.fxDuration}), {
        render: function(delta) {
          content.width  = (cur_size.x + (end_size.x - cur_size.x) * delta) + 'px';
          content.height = (cur_size.y + (end_size.y - cur_size.y) * delta) + 'px';
          dialog.top     = (cur_top    + (end_top    - cur_top)    * delta) + 'px';

          if (Browser.IE6) {
            dialog.width  = (dlg_diff + cur_size.y + (end_size.y - cur_size.y) * delta) + 'px';
          }
        }
      }).onFinish(R(this.unlock).bind(this)).start();

    } else {
      // no-fx direct assignment
      content.width  = end_size.x + 'px';
      content.height = end_size.y + 'px';
      dialog.top     = end_top    + 'px';

      if (Browser.IE6) {
        dialog.width = (dlg_diff + end_size.x) + 'px';
      }

      if (!this.request) { this.unlock(); }
    }

    return this;
  },

  /**
   * Shows the content
   *
   * @param mixed content String/Element/Array and so one
   * @return Dialog this
   */
  show: function(content, no_fx) {
    this.content.update(content || '');
    this.resize(null, !no_fx);
  },

  /**
   * Loads up the data from the link
   *
   * @param mixed String url address or a link element
   * @param Object xhr-options
   * @return void
   */
  load: function(url, options) {
    if (url instanceof Element) {
      this.setTitle(url.get('title'));
      url = url.get('href');
    }

    Pager.show(this, url);
    this.lock().cancel();

    // defined in the loader.js file
    this.request = new Loader(url, options, R(function(content, no_fx) {
      this.request = null;
      this.show(content, no_fx);
    }).bind(this));

    return this.resize(); // the look might be changed for a media-type
  },

  /**
   * Cancels a currently loading request
   *
   * @return Dialog this
   */
  cancel: function() {
    if (this.request) {
      this.request.cancel();
    }

    return this;
  },

  /**
   * Shows the loading lock
   *
   * @return Dialog this
   */
  lock: function() {
    this.locker.setStyle('opacity:1;display:block').insertTo(this.scroller, 'before');
    return this;
  },

  /**
   * Hides the loading lock
   *
   * @return Dialog this
   */
  unlock: function() {
    this.locker.remove(R(this.content.html()).blank() ? null : 'fade', {
      duration: this.options.fxDuration * 2/3
    });

    return this;
  }
});
