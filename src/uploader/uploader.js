/**
 * The uploading progress feature
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var Uploader = new Widget({
  extend: {
    version: '2.2.0',

    EVENTS: $w('start update finish error'),

    Options: {
      url:         '/progress',
      param:       'X-Progress-ID',

      timeout:     1000,
      round:       0,
      fxDuration:  400,

      cssRule:     '[data-uploader]'
    }
  },

  /**
   * Basic constructor
   *
   * @param mixed a form reference
   * @param Object options
   */
  initialize: function(form, options) {
    this.form = form = $(form);

    // trying to find an existing progress-bar
    var element = form.first('.rui-uploader');

    this
      .$super('uploader', element)
      .setOptions(options, this.form)
      .addClass('rui-progress-bar')
      .insert([
        this.bar = this.first('.bar') || $E('div', {'class': 'bar'}),
        this.num = this.first('.num') || $E('div', {'class': 'num'})
      ]);

    if (!element) {
      this.insertTo(form);
    }
  },

  /**
   * Starts the uploading monitoring
   *
   * @return Uploader this
   */
  start: function() {
    var data = {state: 'starting'};
    return this.paint(data).prepare().request().fire('start', {data: data});
  },

// protected

  // updates uploading bar progress
  update: function(data) {
    this.paint(data).fire('update', {data: data});

    switch (data.state) {
      case 'starting':
      case 'uploading':
        R(this.request).bind(this).delay(this.options.timeout);
        break;
      case 'done':
        this.fire('finish', {data: data});
        break;
      case 'error':
        this.fire('error', {data: data});
        break;
    }

    return this;
  },

  // changes the actual element styles
  paint: function(data) {
    var percent = (this.percent || 0)/100;

    switch (data.state) {
      case 'starting':  percent = 0; break;
      case 'done':      percent = 1; break;
      case 'uploading': percent = data.received / (data.size||1); break;
    }

    this.percent = R(percent * 100).round(this.options.round);

    if (this.percent === 0 || !RightJS.Fx || !this.options.fxDuration) {
      this.bar._.style.width = this.percent + '%';
      this.num._.innerHTML   = this.percent + '%';
    } else {
      this.bar.morph({width: this.percent + '%'}, {duration: this.options.fxDuration});
      R(function() {
        this.num._.innerHTML = this.percent + '%';
      }).bind(this).delay(this.options.fxDuration / 2);
    }

    // marking the failed uploads
    this[data.state === 'error' ? 'addClass' : 'removeClass']('rui-progress-bar-failed');

    return this;
  },

  // sends a request to the server
  request: function() {
    Xhr.load(this.options.url + "?" + this.options.param + "=" + this.uid, {
      evalJSON: false,
      onSuccess: R(function(xhr) {
        this.update(new Function('return '+xhr.text)());
      }).bind(this)
    });

    return this;
  },

  // prepares the form to carry the x-progress-id param
  prepare: function() {
    this.uid = "";
    for (i = 0; i < 32; i++) { this.uid += Math.random(0, 15).toString(16); }

    var param = this.options.param;
    var url = this.form.get('action').replace(new RegExp('(\\?|&)'+RegExp.escape(param) + '=[^&]*', 'i'), '');
    this.form.set('action', url + (R(url).includes('?') ? '&' : '?') + param + '=' + this.uid);

    this.show();

    return this;
  }

});
