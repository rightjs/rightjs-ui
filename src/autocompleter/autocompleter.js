/**
 * The RightJS UI Autocompleter unit base class
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
var Autocompleter = new Class(Observer, {
  extend: {
    EVENTS: $w('show hide update load select done'),
    
    Options: {
      url:        document.location.href,
      param:      'search',
      method:     'get',
      
      minLength:  1,         // the minimal length when it starts work
      threshold:  200,       // the typing pause threshold
      
      cache:      true,      // the use the results cache
      local:      null,      // an optional local search results list
      
      fxName:     'slide',   // list appearance fx name
      fxDuration: 'short',   // list appearance fx duration
      
      spinner:    'native',  // spinner element reference
      
      cssRule:    '[rel^=autocompleter]'
    },
    
    current: null, // reference to the currently active options list
    instances: {}, // the input <-> instance map
    
    // finds/instances an autocompleter for the event
    find: function(event) {
      var input = event.target;
      if (input.match(Autocompleter.Options.cssRule)) {
        var uid = $uid(input);
        if (!Autocompleter.instances[uid])
          new Autocompleter(input);
      }
    },
    
    // DEPRECATED scans the document for autocompletion fields
    rescan: function(scope) { }
  },
  
  /**
   * basic constructor
   *
   * @param mixed the input element reference, a string id or the element instance
   * @param Object options
   */
  initialize: function(input, options) {
    this.input = $(input); // don't low it down!
    this.$super(options);
    
    // storing the callbacks so we could detach them later
    this._watch = this.watch.bind(this);
    this._hide  = this.hide.bind(this);
    
    this.input.onKeyup(this._watch).onBlur(this._hide);
    
    this.holder    = $E('div', {'class': 'right-autocompleter'}).insertTo(this.input, 'after');
    this.container = $E('div', {'class': 'autocompleter'}).insertTo(this.holder);
    
    this.input.autocompleter = Autocompleter.instances[$uid(input)] = this;
  },
  
  // kills the autocompleter
  destroy: function() {
    this.input.stopObserving('keyup', this._watch).stopObserving('blur', this._hide);
    delete(this.input.autocompleter);
    return this;
  },
  
  // catching up with some additonal options
  setOptions: function(options) {
    this.$super(this.grabOptions(options));
    
    // building the correct url template with a placeholder
    if (!this.options.url.includes('%{search}')) {
      this.options.url += (this.options.url.includes('?') ? '&' : '?') + this.options.param + '=%{search}';
    }
  },
  
  // handles the list appearance
  show: function() {
    if (this.container.hidden()) {
      var dims = this.input.dimensions(), pos = this.holder.position();
      
      this.container.setStyle({
        top: (dims.top + dims.height - pos.y) + 'px',
        left: (dims.left - pos.x) + 'px',
        width: dims.width + 'px'
      }).show(this.options.fxName, {
        duration: this.options.fxDuration,
        onFinish: this.fire.bind(this, 'show')
      });
    }
    
    return Autocompleter.current = this;
  },
  
  // handles the list hidding
  hide: function() {
    if (this.container.visible()) {
      this.container.hide();
      this.fire.bind(this, 'hide');
    }
    
    Autocompleter.current = null;
    
    return this;
  },
  
  // selects the next item on the list
  prev: function() {
    return this.select('prev', this.container.select('li').last());
  },
  
  // selects the next item on the list
  next: function() {
    return this.select('next', this.container.first('li'));
  },
  
  // marks it done
  done: function(current) {
    var current = current || this.container.first('li.current');
    if (current) {
      this.input.value = current.innerHTML.stripTags();
    }
    
    return this.fire('done').hide();
  },
  
// protected

  // trying to extract the input element options
  grabOptions: function(options) {
    var input = this.input;
    var options = options || eval('('+input.get('data-autocompleter-options')+')') || {};
    var keys = Autocompleter.Options.cssRule.split('[').last().split(']')[0].split('^='),
        key = keys[1], value = input.get(keys[0]), match;
        
    // trying to extract options
    if (value && (match = value.match(new RegExp('^'+ key +'+\\[(.*?)\\]$')))) {
      match = match[1];
      
      // deciding whether it's a list of local options or an url
      if (match.match(/^['"].*?['"]$/)) {
        options.local = eval('['+ match +']');
      } else if (!match.blank()) {
        options.url = match;
      }
    }
    
    return options;
  },

  // works with the 'prev' and 'next' methods
  select: function(what, fallback) {
    var current = this.container.first('li.current');
    if (current) {
      current = current[what]('li') || current;
    }
    
    return this.fire('select', (current || fallback).radioClass('current'));
  },

  // receives the keyboard events out of the input element
  watch: function(event) {
    // skip the overlaping key codes that are already watched in the document.js
    if ([27,37,38,39,40,13].include(event.keyCode)) return;
    
    if (this.input.value.length >= this.options.minLength) {
      if (this.timeout) {
        this.timeout.cancel();
      }
      this.timeout = this.trigger.bind(this).delay(this.options.threshold);
    } else {
      return this.hide();
    }
  },
  
  // triggers the actual action
  trigger: function() {
    this.timeout = null;
    
    this.cache = this.cache || {};
    var search = this.input.value;
    
    if (search.length < this.options.minLength) return this.hide();
    
    if (this.cache[search]) {
      this.suggest(this.cache[search], search);
    } else if (this.options.local) {
      this.suggest(this.findLocal(search), search);
    } else {
      this.request = Xhr.load(this.options.url.replace('%{search}', encodeURIComponent(search)), {
        method:  this.options.method,
        spinner: this.getSpinner(),
        onComplete: function(response) {
          this.fire('load').suggest(response.responseText, search);
        }.bind(this)
      });
    }
  },
  
  // updates the suggestions list
  suggest: function(result, search) {
    this.container.update(result).select('li').each(function(li) {
      // we reassiging the events each time so the were no doublecalls
      li.onmouseover = function() { li.radioClass('current'); };
      li.onmousedown = function() { this.done(li); }.bind(this);
    }, this);
    
    // saving the result in cache
    if (this.options.cache) {
      this.cache[search] = result;
    }
    
    return this.fire('update').show();
  },
  
  // performs the locals search
  findLocal: function(search) {
    var regexp = new RegExp("("+RegExp.escape(search)+")", 'ig');
    return $E('ul').insert(
      this.options.local.map(function(option) {
        if (regexp.test(option)) {
          return $E('li', {html:
            option.replace(regexp, '<strong>$1</strong>')
          });
        }
      }).compact()
    );
  },
  
  // builds a native textual spinner if necessary
  getSpinner: function() {
    this._spinner = this._spinner || this.options.spinner;
    
    // building the native spinner
    if (this._spinner == 'native') {
      this._spinner = $E('div', {
        'class': 'autocompleter-spinner'
      }).insertTo(this.holder);
      
      var dots = '123'.split('').map(function(i) {
        return $E('div', {'class': 'dot-'+i, html: '&raquo;'});
      });
      
      (function() {
        var dot = dots.shift();
        dots.push(dot);
        this._spinner.update(dot);
      }.bind(this)).periodical(400);
    }
    
    // repositioning the native spinner
    if (this.options.spinner == 'native') {
      var dims = this.input.dimensions(), pos = this.holder.position();
      
      this._spinner.setStyle('visiblity: hidden').show();
      
      this._spinner.setStyle({
        visibility: 'visible',
        top: (dims.top + 1 - pos.y) + 'px',
        height: (dims.height - 2) + 'px',
        lineHeight: (dims.height - 2) + 'px',
        left: (dims.left + dims.width - this._spinner.offsetWidth - 1 - pos.x) + 'px'
      }).hide();
    }
    
    return this._spinner;
  }
});