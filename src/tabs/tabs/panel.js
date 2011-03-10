/**
 * The tab panels behavior logic
 *
 * Copyright (C) 2009-2011 Nikolay Nemshilov
 */
var Panel = Tabs.Panel = new Class(Element, {

  /**
   * Basic constructor
   *
   * @param Element panel-element
   * @param Tab the tab object
   * @return void
   */
  initialize: function(element, tab) {
    this.$super(element._);
    this.addClass('rui-tabs-panel');

    this.tab = tab;
    this.id  = this.get('id');
  },

  // shows the panel
  show: function() {
    return this.resizing(function() {
      this.tab.main.tabs.each(function(tab) {
        tab.panel[
          tab.panel === this ? 'addClass' : 'removeClass'
        ]('rui-tabs-current');
      }, this);
    });
  },

  // updates the panel content
  update: function(content) {
    // don't use resize if it's some other hidden tab was loaded asynch
    if (this.tab.current()) {
      this.resizing(function() {
        Element.prototype.update.call(this, content||'');
      });
    } else {
      this.$super(content||'');
    }

    return this;
  },

  // locks the panel with a spinner locker
  lock: function() {
    this.insert(this.locker(), 'top');
  },

// protected

  resizing: function(callback) {
    var controller = this.tab.main;

    if (controller.__working) { return this.resizing.bind(this, callback).delay(100); }

    var options    = controller.options;
    var prev_panel = controller.tabs.map('panel').first('hasClass', 'rui-tabs-current');
    var this_panel = this;
    var swapping   = prev_panel !== this_panel;
    var loading    = this.first('div.rui-tabs-panel-locker');

    // sometimes it looses the parent on remote tabs
    if (this_panel.parent().hasClass('rui-tabs-resizer')) {
      this_panel.insertTo(prev_panel.parent());
    }

    if (options.resizeFx && RightJS.Fx && prev_panel && (swapping || loading)) {
      controller.__working = true;
      var unlock = function() { controller.__working = false; };

      // calculating the visual effects durations
      var fx_name  = (options.resizeFx === 'both' && loading) ? 'slide' : options.resizeFx;
      var duration = options.resizeDuration; duration = Fx.Durations[duration] || duration;
      var resize_duration = fx_name === 'fade' ? 0 : fx_name === 'slide' ? duration : duration / 2;
      var fade_duration   = duration - resize_duration;

      if (fx_name !== 'slide') {
        this_panel.setStyle({opacity: 0});
      }

      // saving the previous sizes
      var prev_panel_height = (controller.isHarmonica && swapping) ? 0 : prev_panel.size().y;

      // applying the changes
      callback.call(this);

      // getting the new size
      var new_panel_height  = this_panel.size().y;
      var fx_wrapper = null;
      var hide_wrapper = null;
      var prev_back = null;

      if (fx_name !== 'fade' && prev_panel_height !== new_panel_height) {
        // preserving the whole element size so it didn't jump when we are tossing the tabs around
        controller._.style.height = controller.size().y + 'px';

        // wrapping the element with an overflowed element to visualize the resize
        fx_wrapper = $E('div', {
          'class': 'rui-tabs-resizer',
          'style': 'height: '+ prev_panel_height + 'px'
        });

        // in case of harmonica nicely hidding the previous panel
        if (controller.isHarmonica && swapping) {
          prev_panel.addClass('rui-tabs-current');
          hide_wrapper = $E('div', {'class': 'rui-tabs-resizer'});
          hide_wrapper._.style.height = prev_panel.size().y + 'px';
          prev_back = function() {
            hide_wrapper.replace(prev_panel.removeClass('rui-tabs-current'));
          };
          prev_panel.wrap(hide_wrapper);

          fx_wrapper._.style.height = '0px';
        }

        this_panel.wrap(fx_wrapper);

        // getting back the auto-size so we could resize it
        controller._.style.height = 'auto';

      } else {
        // removing the resize duration out of the equasion
        rezise_duration = 0;
        duration = fade_duration;
      }

      var counter = 0;
      var set_back = function() {
        if (fx_wrapper) {
          if (fx_name == 'both' && !counter) {
            return counter ++;
          }

          fx_wrapper.replace(this_panel);
        }

        unlock();
      };

      if (hide_wrapper) {
        hide_wrapper.morph({height: '0px'},
          {duration: resize_duration, onFinish: prev_back});
      }

      if (fx_wrapper) {
        fx_wrapper.morph({height: new_panel_height + 'px'},
          {duration: resize_duration, onFinish: set_back});
      }

      if (fx_name !== 'slide') {
        this_panel.morph.bind(this_panel, {opacity: 1},
          {duration: fade_duration, onFinish: set_back}
            ).delay(resize_duration);
      }

      if (!fx_wrapper && fx_name === 'slide') {
        set_back();
      }

    } else {
      callback.call(this);
    }

    return this;
  },

  // builds the locker element
  locker: function() {
    return this._locker || (this._locker =
      $E('div', {'class': 'rui-tabs-panel-locker'}).insert(new Spinner(5))
    );
  }
});
