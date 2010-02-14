/**
 * The uploading progress feature
 *
 * Copyright (C) 2010 Nikolay V. Nemshilov
 */
var Uploader = new Class(Observer, {
  extend: {
    EVENTS: $w('start update finish error'),
    
    Options: {
      url:         '/progress',
      param:       'X-Progress-ID',
      
      timeout:     400,
      round:       0,
      
      formCssRule: '.with-progress',
      barCssRule:  '.progress-bar'
    }
  },
  
  /**
   * Basic constructor
   *
   * @param mixed a form reference
   * @param Object options
   */
  initialize: function(form, options) {
    this.form = $(form);
    
    this.$super(options || eval('('+this.form.get('data-uploader-options')+')'));
    
    this.element = this.find_or_build();
    
    this.bar = this.element.first('.bar');
    this.num = this.element.first('.num');
    
    this.form._uploader = this;
  },
  
  /**
   * Starts the uploading monitoring
   *
   * @return Uploader this
   */
  start: function() {
    var data = {state: 'starting'};
    return this.paint(data).prepare().fire('start', data).request();
  },

// protected
  
  // updates uploading bar progress
  update: function(data) {
    this.paint(data).fire('update', data);
    
    switch (data.state) {
      case 'starting':
      case 'uploading':
        this.request();
        break;
      case 'done':
        this.fire('finish', data);
        break;
      case 'error':
        this.fire('error', data);
        break;
    }
    
    return this;
  },

  // changes the actual element styles
  paint: function(data) {
    var percent = this.percent || 0;
    
    switch (data.state) {
      case 'starting':  percent = 0;   break;
      case 'done':      percent = 100; break;
      case 'uploading': percent = data.received / (data.size || 1);
    }

    this.percent = percent.round(this.options.round);
    this.bar.style.width = this.percent + '%';
    this.num.innerHTML   = this.percent + '%';
    
    // marking the failed uploads
    this.element[data.state == 'error' ? 'addClass' : 'removeClass']('upload-failed');
    
    return this;
  },
  
  // sends a request to the server
  request: function() {
    (function() {
      Xhr.load(this.options.url + "?" + this.options.param + "=" + this.uid, {
        onSuccess: function(xhr) {
          this.update(eval('('+xhr.json+')'));
        }.bind(this)
      });
      
    }).bind(this).delay(this.options.timeout);
    
    return this;
  },
  
  // prepares the form to carry the x-progress-id param
  prepare: function() {
    this.uid = Math.random(1, 999999999999).toString(16);
    var param = this.options.param;
    var url = this.form.action.replace(new RegExp('(\\?|&)'+RegExp.escape(param) + '=[^&]*', 'i'), '');
    this.form.action = (url.includes('?') ? '&' : '?') + param + '=' + this.uid;
    
    return this;
  },

  // finds or builds the progress-bar element
  find_or_build: function() {
    var element = this.form.first(this.options.barCssRule) || $E('div').insertTo(this.form);
    
    if (element.innerHTML.blank())
      element.innerHTML = '<div class="bar"></div><div class="num"></div>';
    
    return element.addClass('progress-bar');
  }
  
});