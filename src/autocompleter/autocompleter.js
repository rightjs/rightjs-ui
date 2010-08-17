/**
 * The RightJS UI Autocompleter unit base class
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
var Autocompleter = new Widget({
  extend: {
    EVENTS: $w('show hide update load select done'),
    
    Options: {
      url:        document.location.href,
      param:      'search',
      method:     'get',
      
      minLength:  1,         // the minimal length when it starts work
      threshold:  200,       // the typing pause threshold
      
      cache:      true,      // use the results cache
      local:      null,      // an optional local search results list
      
      fxName:     'slide',   // list appearance fx name
      fxDuration: 'short',   // list appearance fx duration
      
      spinner:    'native',  // spinner element reference
      
      cssRule:    'input[data-autocompleter]' // the auto-initialization css-rule
    }
  },
  
  /**
   * basic constructor
   *
   * @param mixed the input element reference, a string id or the element instance
   * @param Object options
   */
  initialize: function(input, options) {
    this.input = $(input); // KEEP IT before the super call
    
    this
      .$super('autocompleter', options)
      .insert(this.list = $E('ul', {'class': 'rui-dd-menu'}))
      .insertTo(this.input, 'after')
      .onMousedown(this.clicked);
    
    this.input.autocompleter = this;
  },
  
  /**
   * Destructor
   *
   * @return Autocompleter this
   */
  destroy: function() {
    delete(this.input.autocompleter);
    return this;
  },
  
  /**
   * displays the list
   *
   * @param String fx-name
   * @param Object fx-options
   * @return Autocompleter this
   */
  show: function(fx_name, fx_options) {
    if (this.hidden()) {
      var dims = this.input.dimensions(), pos = this.position(),
          border_size = R(this.input.getStyle('borderBottomWidth')).toInt();

      this.list.setStyle({
        top:   (dims.top  - pos.y  + dims.height - border_size - 1) + 'px',
        left:  (dims.left - pos.x + border_size) + 'px',
        visibility: 'hidden'
      }).show().setWidth(dims.width - border_size*2).hide().setStyle('visibility:visible');
    }
    
    return toggler.call(this, this.list, 'show', fx_name, fx_options);
  },
  
  /**
   * displays the list
   *
   * @param String fx-name
   * @param Object fx-options
   * @return Autocompleter this
   */
  hide: function(fx_name, fx_options) {
    return toggler.call(this, this.list, 'hide', fx_name || null, fx_options);
  },
  
  /**
   * picks the next item on the list
   *
   * @return Autocompleter this
   */
  prev: function() {
    return this.pick('prev');
  },
  
  /**
   * picks the next item on the list
   *
   * @return Autocompleter this
   */
  next: function() {
    return this.pick('next');
  },
  
  /**
   * triggers the done event, sets up the value and closes the list
   *
   * @return Autocompleter this
   */
  done: function(current) {
    current = current || this.list.first('li.current');
    
    if (current) {
      this.input.setValue(R(current.html()).stripTags());
      this.fire('done');
    }
    
    return this.hide();
  },
  
  // delegating the 'visible' and 'hidden' methods to the internal list
  visible: function() { return this.list.visible(); },
  hidden:  function() { return this.list.hidden();  },
  
// protected

  // preprocessing the urls a bit
  setOptions: function(options) {
    this.$super(options, this.input);
    
    options = this.options;
    
    // building the correct url template with a placeholder
    if (!R(options.url).includes('%{search}')) {
      options.url += (R(options.url).includes('?') ? '&' : '?') + options.param + '=%{search}';
    }
  },

  // works with the 'prev' and 'next' methods
  pick: function(which_one) {
    var items   = this.list.subNodes(),
        current = items.first('hasClass', 'current'),
        index   = items.indexOf(current);
    
    if (which_one == 'prev') {
      current = index < 1 ? items.last() : items[index < 0 ? 0 : (index-1)];
    } else if (which_one == 'next') {
      current = index < 0 || index == (items.length - 1) ?
        items.first() : items[index + 1];
    }
    
    return this.fire('select', current.radioClass('current'));
  },
  
  // handles mouse clicks on the list element
  clicked: function(event) {
    this.done(event.find('ul.rui-dd-menu > li'));
  },
  
  // handles the key-press events
  keypressed: function(event) {
    if (this.input.value().length >= this.options.minLength) {
      if (this.timeout) {
        this.timeout.cancel();
      }
      this.timeout = R(this.trigger).bind(this).delay(this.options.threshold);
    } else {
      return this.hide();
    }
  },
  
  // triggers the actual action
  trigger: function() {
    this.timeout = null;
    
    this.cache = this.cache || {};
    var search = this.input.value(), options = this.options;
    
    if (search.length < options.minLength) { return this.hide(); }
    
    if (this.cache[search]) {
      this.suggest(this.cache[search], search);
    } else if (isArray(options.local)) {
      this.suggest(this.findLocal(search), search);
    } else {
      this.request = Xhr.load(options.url.replace('%{search}', encodeURIComponent(search)), {
        method:  options.method,
        spinner: this.getSpinner(),
        onComplete: R(function(response) {
          this.fire('load').suggest(response.text, search);
        }).bind(this)
      });
    }
  },
  
  // updates the suggestions list
  suggest: function(result_text, search) {
    // saving the result in cache
    if (this.options.cache) {
      this.cache[search] = result_text;
    }
    
    if (!(result_text).blank()) {
      this.list.update(result_text.replace(/<ul[^>]*>|<\/ul>/im, ''));
      this.fire('update').show();
    } else {
      this.list.hide();
    }
    
    return this;
  },
  
  // performs the locals search
  findLocal: function(search) {
    var regexp  = new RegExp("("+RegExp.escape(search)+")", 'ig');
    
    return R(this.options.local).map(function(option) {
      if (option.match(regexp)) {
        return '<li>'+ option.replace(regexp, '<strong>$1</strong>') +'</li>';
      }
    }).compact().join('');
  },
  
  // builds a native textual spinner if necessary
  getSpinner: function() {
    var options = this.options, spinner = options.spinner;
    
    if (spinner == 'native') {
      spinner = options.spinner = new Spinner(3).insertTo(this);
    }
    
    // positioning the native spinner
    if (spinner instanceof Spinner) {
      var dims = this.input.dimensions(), pos = this.position(),
          border_size = R(this.input.getStyle('borderRightWidth')).toInt();
      
      spinner
        .setStyle('visibility:hidden').show()
        .setStyle({
          visibility: 'visible',
          top:  (dims.top  - pos.y + border_size) + 'px',
          left: (dims.left + dims.width - spinner.sizes().x - pos.x - border_size) + 'px',
          lineHeight: (dims.height - border_size * 2) + 'px',
          height: (dims.height - border_size * 2) + 'px'
        }).hide();
    }
    
    return spinner;
  }
});