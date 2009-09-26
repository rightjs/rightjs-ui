/**
 * RightJS - the right javascript framework
 *
 * The library released under terms of the MIT license
 * Visit http://rightjs.org for more details
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St.
 */

/**
 * The framework description object
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var RightJS = {
  version: "1.4.3",
  modules: ["core", "form", "cookie", "xhr", "fx"]
};

/**
 * this object will contain info about the current browser
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var Browser = (function(agent) {
  return   {
    IE:           !!(window.attachEvent && !window.opera),
    Opera:        !!window.opera,
    WebKit:       agent.indexOf('AppleWebKit/') > -1,
    Gecko:        agent.indexOf('Gecko') > -1 && agent.indexOf('KHTML') < 0,
    MobileSafari: !!agent.match(/Apple.*Mobile.*Safari/),
    Konqueror:    agent.indexOf('Konqueror') > -1,

    // marker for the browsers which don't give access to the HTMLElement unit
    OLD:          agent.indexOf('MSIE 6') > -1 || agent.indexOf('MSIE 7') > -1,
    IE8:          agent.indexOf('MSIE 8') > -1
  }
})(navigator.userAgent);

/**
 * There are some util methods
 *
 * Credits:
 *   Some of the functionality and names are inspired or copied from
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
 
/**
 * extends the first object with the keys and values of the second one
 *
 * NOTE: the third optional argument tells if the existing values
 *       of the first object should _NOT_ get updated by the values of the second object
 *
 * @param Object destintation object
 * @param Object source object
 * @param Boolean flag if the function should not overwrite intersecting values
 * @return Objecte extended destination object
 */
function $ext(dest, src, dont_overwrite) { 
  var src = src || {};

  for (var key in src)
    if (!(dont_overwrite && dest[key] !== undefined))
      dest[key] = src[key];

  return dest;
};

/**
 * tries to execute all the functions passed as arguments
 *
 * NOTE: will hide all the exceptions raised by the functions
 *
 * @param Function to execute
 * ......
 * @return mixed first sucessfully executed function result or undefined by default
 */
function $try() {
  for (var i=0; i < arguments.length; i++) {
    try {
      return arguments[i]();
    } catch(e) {}
  }
};

/**
 * evals the given javascript text in the context of the current window
 *
 * @param String javascript
 * @return void
 */
function $eval(text) {
  if (!isString(text) || text.blank()) return;
  if (window.execScript) {
    window.execScript(text);
  } else {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.text = text;
    document.body.appendChild(script);
  }
}

/**
 * throws an exception to break iterations throw a callback
 *
 * @return void
 * @throws Break
 */
function $break() {
  throw new Break();
};

/**
 * generates aliases for the object properties
 *
 * @param Object object
 * @param Object aliases hash
 * @return Object the extended objects
 */
function $alias(object, names) {
  for (var new_name in names) {
    object[new_name] = object[names[new_name]];
  }
  return object;
};

/**
 * checks if the given value or a reference points
 * to a really defined value
 *
 * NOTE: will return true for variables equal to null, false, 0, and so one.
 *
 * EXAMPLE:
 *
 *   var smth = null;
 *   defined(smth); <- will return true
 *
 *   var obj = {};
 *   defined(obj['smth']); <- will return false
 *
 * @param mixed value
 * @return boolean check result
 */
function defined(value) {
  return value !== undefined;
};

/**
 * checks if the given value is a hash-like object
 *
 * @param mixed value
 * @return boolean check result
 */
function isHash(value) {
  return typeof(value) == 'object' && value !== null && value.constructor === Object;
};

// Konqueror 3 patch
if (navigator.userAgent.indexOf('Konqueror/3') != -1) {
  eval(isHash.toString().replace(';', '&&!(arguments[0] instanceof HTMLElement);'));
}


/**
 * checks if the given value is a function
 *
 * @param mixed value
 * @return boolean check result
 */
function isFunction(value) {
  return typeof(value) == 'function';
};

/**
 * checks if the given value is a string
 *
 * @param mixed value
 * @return boolean check result
 */
function isString(value) {
  return typeof(value) == 'string';
};

/**
 * checks if the given value is an array
 *
 * @param mixed value to check
 * @return boolean check result
 */
function isArray(value) {
  return value instanceof Array;
};

/**
 * checks if the given value is a number
 *
 * @param mixed value to check
 * @return boolean check result
 */
function isNumber(value) {
  return typeof(value) == 'number';
};

/**
 * checks if the given value is an element
 *
 * @param mixed value to check
 * @return boolean check result
 */
function isElement(value) {
  return value && !!value.tagName;
};

/**
 * checks if the given value is a DOM-node
 *
 * @param mixed value to check
 * @return boolean check result
 */
function isNode(value) {
  return value && !!value.nodeType;
};

/**
 * converts any iterables into an array
 *
 * @param Object iterable
 * @return Array list
 */
var $A = (function(slice) {
  return function (it) {
    try {
      var a = slice.call(it);
    } catch(e) {
      for (var a=[], i=0, length = it.length; i < length; i++)
        a[i] = it[i];
    }
    return a;
  };
})(Array.prototype.slice);

/**
 * shortcut to instance new elements
 *
 * @param String tag name
 * @param object options
 * @return Element instance
 */
function $E(tag_name, options) {
  return new Element(tag_name, options);
};

/**
 * searches an element by id and/or extends it with the framework extentions
 *
 * @param String element id or Element to extend
 * @return Element or null
 */
function $(element) {
  var element = typeof(element) == 'string' ? document.getElementById(element) : element;
  return Browser.OLD ? Element.prepare(element) : element;
};

/**
 * searches for elements in the document which matches the given css-rule
 *
 * @param String css-rule
 * @return Array matching elements list
 */
function $$(css_rule) {
  return $A(document.querySelectorAll(css_rule));
};

/**
 * shortcut, generates an array of words from a given string
 *
 * @param String string
 * @return Array of words
 */
function $w(string) {
  return string.trim().split(/\s+/);
}

/**
 * generates an unique id for an object
 *
 * @param Object object
 * @return Integer uniq id
 */
var $uid = (function() {
  var _UID = 1;
  
  return function(item) {
    return item.uid || (item.uid = _UID++);
  };
})();


/**
 * The Object class extentions
 *
 * Credits:
 *   Some functionality is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Object, {
  /**
   * extracts the list of the attribute names of the given object
   *
   * @param Object object
   * @return Array keys list
   */
  keys: function(object) {
    var keys = [];
    for (var key in object)
      keys.push(key);
    return keys;
  },
  
  /**
   * extracts the list of the attribute values of the given object
   *
   * @param Object object
   * @return Array values list
   */
  values: function(object) {
    var values = [];
    for (var key in object)
      values.push(object[key]);
    return values;
  },
  
  /**
   * checks if the object-hash has no keys
   *
   * @param Object object
   * @return check result
   */
  empty: function(object) {
    for (var key in object) break;
    return !key;
  },
  
  /**
   * returns a copy of the object which contains
   * all the same keys/values except the key-names
   * passed the the method arguments
   *
   * @param Object object
   * @param String key-name to exclude
   * .....
   * @return Object filtered copy
   */
  without: function() {
    var filter = $A(arguments), object = filter.shift(), copy = {};
    
    for (var key in object)
      if (!filter.includes(key))
        copy[key] = object[key];
    
    return copy;
  },
  
  /**
   * returns a copy of the object which contains all the
   * key/value pairs from the specified key-names list
   *
   * NOTE: if some key does not exists in the original object, it will be just skipped
   *
   * @param Object object
   * @param String key name to exclude
   * .....
   * @return Object filtered copy
   */
  only: function() {
    var filter = $A(arguments), object = filter.shift(), copy = {};
    
    for (var i=0, length = filter.length; i < length; i++) {
      if (defined(object[filter[i]]))
        copy[filter[i]] = object[filter[i]];
    }
    
    return copy;
  },
    
  /**
   * merges the given objects and returns the result
   *
   * NOTE this method _DO_NOT_ change the objects, it creates a new object
   *      which conatins all the given ones. 
   *      if there is some keys introspections, the last object wins.
   *      all non-object arguments will be omitted
   *
   * @param Object object
   * @param Object mixing
   * ......
   * @return Object merged object
   */
  merge: function() {
    var object = {};
    for (var i=0, length = arguments.length; i < length; i++) {
      if (isHash(arguments[i])) {
        $ext(object, arguments[i]);
      }
    }
    return object;
  },
  
  /**
   * converts a hash-object into an equivalent url query string
   *
   * @param Object object
   * @return String query
   */
  toQueryString: function(object) {
    var tokens = [];
    for (var key in object) {
      tokens.push(key+'='+encodeURIComponent(object[key]))
    }
    return tokens.join('&');
  }
});

/**
 * here are the starndard Math object extends
 *
 * Credits:
 *   The idea of random mehtod is taken from
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Math, {
  /**
   * the standard random method replacement, to make it more useful
   *
   * USE:
   *   Math.random();    // original functionality, returns a float between 0 and 1
   *   Math.random(10);  // returns an integer between 0 and 10
   *   Math.random(1,4); // returns an integer between 1 and 4
   *
   * @param Integer minimum value if there's two arguments and maximum value if there's only one
   * @param Integer maximum value
   * @return Float random between 0 and 1 if there's no arguments or an integer in the given range
   */
  random: function(min, max) {
    var rand = this._random();
    if (arguments.length == 0)
      return rand;
    
    if (arguments.length == 1)
      var max = min, min = 0;
    
    return Math.floor(rand * (max-min+1)+min);
  },
  _random: Math.random
});

/**
 * The Array class extentions
 *
 * Credits:
 *   Some of the functionality is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Array.prototype, (function(A_proto) {
  
  // JavaScript 1.6 methods recatching up or faking
  var for_each = A_proto.forEach || function(callback, scope) {
    for (var i=0, length = this.length; i < length; i++)
      callback.call(scope, this[i], i, this);
  };
  
  var filter = A_proto.filter || function(callback, scope) {
    for (var result=[], i=0, length = this.length; i < length; i++) {
      if (callback.call(scope, this[i], i, this))
        result.push(this[i]);
    }
    return result;
  };
  
  var map = A_proto.map || function(callback, scope) {
    for (var result=[], i=0, length = this.length; i < length; i++) {
      result.push(callback.call(scope, this[i], i, this));
    }
    return result;
  };
  
  var some = A_proto.some || function(callback, scope) {
    for (var i=0, length = this.length; i < length; i++) {
      if (callback.call(scope, this[i], i, this))
        return true;
    }
    return false;
  };
  
  var every = A_proto.every || function(callback, scope) {
    for (var i=0, length = this.length; i < length; i++) {
      if (!callback.call(scope, this[i], i, this))
        return false;
    }
    return true;
  };
  
  var first = function(callback, scope) {
    for (var i=0, length = this.length; i < length; i++) {
      if (callback.call(scope, this[i], i, this))
        return this[i];
    }
    return undefined;
  };
  
  var last = function(callback, scope) {
    for (var i=this.length-1; i > -1; i--) {
      if (callback.call(scope, this[i], i, this))
        return this[i];
    }
    return undefined;
  };
  
  
  //
  // RightJS callbacks magick preprocessing
  //
  
  // prepares a correct callback function
  var guess_callback = function(args, array) {
    var callback = args[0], args = A_proto.slice.call(args, 1), scope = array;
    
    if (isString(callback)) {
      var attr = callback;
      if (array.length && isFunction(array[0][attr])) {
        callback = function(object) { return object[attr].apply(object, args); };
      } else {
        callback = function(object) { return object[attr]; };
      }
    } else {
      scope = args[0];
    }
    
    return [callback, scope];
  };
  
  // calls the given method with preprocessing the arguments
  var call_method = function(func, scope, args) {
    try {
      return func.apply(scope, guess_callback(args, scope));
    } catch(e) { if (!(e instanceof Break)) throw(e); }
  };
  
return {
  /**
   * IE fix
   * returns the index of the value in the array
   *
   * @param mixed value
   * @param Integer optional offset
   * @return Integer index or -1 if not found
   */
  indexOf: A_proto.indexOf || function(value, from) {
    for (var i=(from<0) ? Math.max(0, this.length+from) : from || 0; i < this.length; i++)
      if (this[i] === value)
        return i;
    return -1;
  },
  
  /**
   * IE fix
   * returns the last index of the value in the array
   *
   * @param mixed value
   * @return Integer index or -1 if not found
   */
  lastIndexOf: A_proto.lastIndexOf || function(value) {
    for (var i=this.length-1; i > -1; i--)
      if (this[i] === value)
        return i;
    return -1;
  },
  
  /**
   * returns the first element of the array
   *
   * @return mixed first element of the array
   */
  first: function() {
    return arguments.length ? call_method(first, this, arguments) : this[0];
  },
  
  /**
   * returns the last element of the array
   *
   * @return mixed last element of the array
   */
  last: function() {
    return arguments.length ? call_method(last, this, arguments) : this[this.length-1];
  },
  
  /**
   * returns a random item of the array
   *
   * @return mixed a random item
   */
  random: function() {
    return this.length ? this[Math.random(this.length-1)] : null;
  },
  
  /**
   * returns the array size
   *
   * @return Integer the array size
   */
  size: function() {
    return this.length;
  },
  
  /**
   * cleans the array
   * @return Array this
   */
  clean: function() {
    this.length = 0;
    return this;
  },
  
  /**
   * checks if the array has no elements in it
   *
   * @return boolean check result
   */
  empty: function() {
    return !this.length;
  },
  
  /**
   * creates a copy of the given array
   *
   * @return Array copy of the array
   */
  clone: function() {
    return this.slice(0);
  },
  
  /**
   * calls the given callback function in the given scope for each element of the array
   *
   * @param Function callback
   * @param Object scope
   * @return Array this
   */
  each: function() {
    call_method(for_each, this, arguments);
    return this;
  },
  forEach: for_each,
  
  /**
   * creates a list of the array items converted in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array collected
   */
  map: function() {
    return call_method(map, this, arguments);
  },
  
  /**
   * creates a list of the array items which are matched in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array filtered copy
   */
  filter: function() {
    return call_method(filter, this, arguments);
  },
  
  /**
   * checks if any of the array elements is logically true
   *
   * @param Function optional callback for checks
   * @param Object optional scope for the callback
   * @return boolean check result
   */
  some: function() {
    return call_method(some, this, arguments.length ? arguments : [function(i) { return !!i; }]);
  },
  
  /**
   * checks if all the array elements are logically true
   *
   * @param Function optional callback for checks
   * @param Object optional scope for the callback
   * @return Boolean check result
   */
  every: function() {
    return call_method(every, this, arguments.length ? arguments : [function(i) { return !!i; }]);
  },
  
  /**
   * applies the given lambda to each element in the array
   *
   * NOTE: changes the array by itself
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array this
   */
  walk: function() {
    this.map.apply(this, arguments).forEach(function(value, i) { this[i] = value; }, this);
    return this;
  },
    
  /**
   * similar to the concat function but it adds only the values which are not on the list yet
   *
   * @param Array to merge
   * ....................
   * @return Array new merged
   */
  merge: function() {
    for (var copy = this.clone(), arg, i=0, length = arguments.length; i < length; i++) {
      arg = arguments[i];
      if (isArray(arg)) {
        for (var j=0; j < arg.length; j++) {
          if (copy.indexOf(arg[j]) == -1)
            copy.push(arg[j]);
        }  
      } else if (copy.indexOf(arg) == -1) {
        copy.push(arg);
      }
    }
    return copy;
  },
  
  /**
   * flats out complex array into a single dimension array
   *
   * @return Array flatten copy
   */
  flatten: function() {
    var copy = [];
    this.forEach(function(value) {
      if (isArray(value)) {
        copy = copy.concat(value.flatten());
      } else {
        copy.push(value);
      }
    });
    return copy;
  },
  
  /**
   * returns a copy of the array whithout any null or undefined values
   *
   * @return Array filtered version
   */
  compact: function() {
    return this.without(null, undefined);
  },
  
  /**
   * returns a copy of the array which contains only the unique values
   *
   * @return Array filtered copy
   */
  uniq: function() {
    return [].merge(this);
  },
  
  /**
   * checks if all of the given values
   * exists in the given array
   *
   * @param mixed value
   * ....
   * @return boolean check result
   */
  includes: function() {
    for (var i=0, length = arguments.length; i < length; i++)
      if (this.indexOf(arguments[i]) == -1)
        return false;
    return true;
  },
  
  /**
   * returns a copy of the array without the items passed as the arguments
   *
   * @param mixed value
   * ......
   * @return Array filtered copy
   */
  without: function() {
    var filter = $A(arguments);
    return this.filter(function(value) {
      return !filter.includes(value);
    });
  },
  
  /**
   * Shuffles the array items in a random order
   *
   * @return Array shuffled version
   */
  shuffle: function() {
    var shuff = this.clone();
    
    for (var j, x, i = shuff.length; i;
       j = Math.random(i-1), x = shuff[--i], shuff[i] = shuff[j], shuff[j] = x);
    
    return shuff;
  },
  
  /**
   * sorts the array by running its items though a lambda or calling their attributes
   *
   * @param Function callback or attribute name
   * @param Object scope or attribute argument
   * @return Array sorted copy
   */
  sortBy: function() {
    var pair = guess_callback(arguments, this);
    return this.map(function(item, i) {
      return {
        item: item,
        value: pair[0].call(pair[1], item, i, this)
      }
    }).sort(function(a, b) {
      return a.value > b.value ? 1 : a.value < b.value ? -1 : 0;
    }).map('item');
  }
}})(Array.prototype));

$alias(Array.prototype, {
  include: 'includes',
  all: 'every',
  any: 'some'
});

/**
 * The String class extentions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *   The trim function taken from work of Steven Levithan
 *     - http://blog.stevenlevithan.com/archives/faster-trim-javascript
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(String.prototype, {
  /**
   * checks if the string is an empty string
   *
   * @return boolean check result
   */
  empty: function() {
    return this == '';
  },
  
  /**
   * checks if the string contains only white-spaces
   *
   * @return boolean check result
   */
  blank: function() {
    return /^\s*$/.test(this);
  },
  
  /**
   * removes trailing whitespaces   
   *
   * @return String trimmed version
   */
  trim: String.prototype.trim || function() {
    var str = this.replace(/^\s\s*/, ''), i = str.length;
    while (/\s/.test(str.charAt(--i)));
    return str.slice(0, i + 1);
  },
  
  /**
   * returns a copy of the string with all the tags removed
   * @return String without tags
   */
  stripTags: function() {
    return this.replace(/<\/?[^>]+>/ig, '');
  },
  
  /**
   * removes all the scripts declarations out of the string
   * @param mixed option. If it equals true the scrips will be executed, 
   *                      if a function the scripts will be passed in it
   * @return String without scripts
   */
  stripScripts: function(option) {
    var scripts = '';
    var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/img, function(match, source) {
      scripts += source.trim() + "\n";
      return '';
    });
    
    if (option === true)
      $eval(scripts);
    else if (isFunction(option))
      option(scripts, text);
    else if (isNumber(option))
      $eval.bind(scripts).delay(options);
    
    return text;
  },
  
  /**
   * extracts all the scripts out of the string
   *
   * @return String the extracted stcripts
   */
  extractScripts: function() {
    var scripts = '';
    this.stripScripts(function(s,t) { scripts = s; });
    return scripts;
  },
  
  /**
   * evals all the scripts in the string
   *
   * @return String self (unchanged version with scripts still in their place)
   */
  evalScripts: function() {
    $eval(this.extractScripts());
    return this;
  },
  
  /**
   * converts underscored or dasherized string to a camelized one
   * @returns String camelized version
   */
  camelize: function() {
    var prefix = this.match(/^(\-|_)+?/g) || ''; // <- keeps start dashes alive
    return prefix + this.substr(prefix.length, this.length).replace(
       /(\-|_)+?(\D)/g, function(match) {
         return match.replace(/\-|_/, '').toUpperCase();
      });
  },
  
  /**
   * converts a camelized or dasherized string into an underscored one
   * @return String underscored version
   */
  underscored: function() {
    return this.replace(/([a-z0-9])([A-Z]+)/g, function(match, first, second) {
      return first+"_"+(second.length > 1 ? second : second.toLowerCase());
    }).replace(/\-/g, '_');
  },

  /**
   * returns a capitalised version of the string
   *
   * @return String captialised version
   */
  capitalize: function() {
    return this.replace(/(^|\s|\-|_)[a-z\u00e0-\u00fe\u0430-\u045f]/g, function(match) {
      return match.toUpperCase();
    });
  },
  
  /**
   * checks if the string contains the given substring
   *
   * @param String string
   * @return boolean check result
   */
  includes: function(string) {
    return this.indexOf(string) != -1;
  },
  
  /**
   * checks if the string starts with the given substring
   *
   * @param String string
   * @param boolean ignore the letters case
   * @return boolean check result
   */
  startsWith: function(string, ignorecase) {
    var start_str = this.substr(0, string.length);
    return ignorecase ? start_str.toLowerCase() == string.toLowerCase() : 
      start_str == string;
  },
  
  /**
   * checks if the string ends with the given substring
   *
   * @param String substring
   * @param boolean ignore the letters case
   * @return boolean check result
   */
  endsWith: function(string, ignorecase) {
    var end_str = this.substring(this.length - string.length);
    return ignorecase ? end_str.toLowerCase() == string.toLowerCase() :
      end_str == string;
  },
  
  /**
   * converts the string to an integer value
   * @param Integer base
   * @return Integer or NaN
   */
  toInt: function(base) {
    return parseInt(this, base || 10);
  },
  
  /**
   * converts the string to a float value
   * @param boolean flat if the method should not use a flexible matching
   * @return Float or NaN
   */
  toFloat: function(strict) {
    return parseFloat(strict ? this : this.replace(',', '.').replace(/(\d)-(\d)/g, '$1.$2'));
  }
  
});

$alias(String.prototype, {include: 'includes'});

/**
 * The Function class extentions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Function.prototype, {
  /**
   * binds the function to be executed in the given scope
   *
   * @param Object scope
   * @param mixed optional curry (left) argument
   * ....
   * @return Function binded function
   */
  bind: function() {
    if (arguments.length < 2 && !defined(arguments[0])) return this;
    
    var _method = this, args = $A(arguments), scope = args.shift();
    return function() {
      return _method.apply(scope, args.concat($A(arguments)));
    };
  },
  
  /**
   * binds the function as an event listener to the given scope object
   *
   * @param Object scope
   * @param mixed optional curry (left) argument
   * .......
   * @return Function binded function
   */
  bindAsEventListener: function() {
    var _method = this, args = $A(arguments), scope = args.shift();
    return function(event) {
      return _method.apply(scope, [event || window.event].concat(args).concat($A(arguments)));
    };
  },
  
  /**
   * allows you to put some curry in your cookery
   *
   * @param mixed value to curry
   * ....
   * @return Function carried function
   */
  curry: function() {
    return this.bind.apply(this, [this].concat($A(arguments)));
  },
  
  /**
   * delays the function execution
   *
   * @param Integer delay ms
   * @param mixed value to curry
   * .....
   * @return Integer timeout marker
   */
  delay: function() {
    var args  = $A(arguments), timeout = args.shift();
    var timer = new Number(window.setTimeout(this.bind.apply(this, [this].concat(args)), timeout));
    
    timer['cancel'] = function() { window.clearTimeout(this); };
    
    return timer;
  },
  
  /**
   * creates a periodical execution of the function with the given timeout
   *
   * @param Integer delay ms
   * @param mixed value to curry
   * ...
   * @return Ineger interval marker
   */
  periodical: function() {
    var args  = $A(arguments), timeout = args.shift();
    var timer = new Number(window.setInterval(this.bind.apply(this, [this].concat(args)), timeout));
    
    timer['stop'] = function() { window.clearInterval(this); };
    
    return timer;
  }
});

/**
 * The Number class extentions
 *
 * Credits:
 *   Some methods inspired by
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Number.prototype, {
  /**
   * executes the given callback the given number of times
   *
   * @param Function callback
   * @param Object optional callback execution scope
   * @return void
   */
  times: function(callback, scope) {
    for (var i=0; i < this; i++)
      callback.call(scope, i);
    return this;
  },
  
  upto: function(number, callback, scope) {
    for (var i=this+0; i <= number; i++)
      callback.call(scope, i);
    return this;
  },
  
  downto: function(number, callback, scope) {
    for (var i=this+0; i >= number; i--)
      callback.call(scope, i);
    return this;
  },
  
  abs: function() {
    return Math.abs(this);
  },
  
  round: function() {
    return Math.round(this);
  },
  
  ceil: function() {
    return Math.ceil(this);
  },
  
  floor: function() {
    return Math.floor(this);
  }
});

/**
 * The Regexp class extentions
 *
 * Credits:
 *   Inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(RegExp, {
  /**
   * Escapes the string for safely use as a regular expression
   *
   * @param String raw string
   * @return String escaped string
   */
  escape: function(string) {
    return String(string).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }
});

/**
 * The basic Class unit
 *
 * Credits:
 *   The Class unit is inspired by its implementation in
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Class = function() {
  var args = $A(arguments), properties = args.pop() || {}, parent = args.pop();
  
  // if only the parent class has been specified
  if (arguments.length == 1 && isFunction(properties)) {
    parent = properties; properties = {};
  }
  
  // basic class object definition
  var klass = function() {
    return this.initialize ? this.initialize.apply(this, arguments) : this;
  };
  
  // attaching main class-level methods
  $ext(klass, Class.Methods);
  
  // handling the parent class assign
  Class.Util.catchSuper(klass, parent);
  klass.prototype.constructor = klass; // <- don't put it lower
  
  // handling the inlinde extends and includes
  Class.Util.catchExtends(klass, properties);
  Class.Util.catchIncludes(klass, properties);
  
  klass.include(properties);
  
  return klass;
};

/**
 * This module contains some utils which hepls handling new classes definition
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Class.Util = {
  /**
   * handles the class superclass catching up
   *
   * @param Function class
   * @param Class superclass
   * @return void
   */
  catchSuper: function(klass, parent) {
    if (parent && defined(parent.prototype)) {  
      klass.parent = parent;
      var s_klass = function() {};
      s_klass.prototype = parent.prototype;
      klass.prototype = new s_klass;
    }
    
    klass.ancestors = [];
    while (parent) {
      klass.ancestors.push(parent);
      parent = parent.parent;
    }
  },
  
  /**
   * handles the inline extendings on class definitions
   *
   * @param Function class
   * @param Object user's properties
   * @return void
   */
  catchExtends: function(klass, properties) {
    if (properties['extend']) {
      var exts = properties['extend'];
      
      klass.extend.apply(klass, isArray(exts) ? exts : [exts]);
      delete(properties['extend']);
    }
  },
  
  /**
   * handles the inline includes of the class definitions
   *
   * @param Function class
   * @param Object user's properties
   * @return void
   */
  catchIncludes: function(klass, properties) {
    if (properties['include']) {
      var includes = properties['include'];

      klass.include.apply(klass, isArray(includes) ? includes : [includes]);
      delete(properties['include']);
    }
  }
};

/**
 * This module contains the methods by which the Class instances
 * will be extended. It provides basic and standard way to work
 * with the classes.
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Class.Methods = {
  /**
   * this method will extend the class-level with the given objects
   *
   * NOTE: this method _WILL_OVERWRITE_ the existing itercecting entries
   *
   * NOTE: this method _WILL_NOT_OVERWRITE_ the class prototype and
   *       the class 'name' and 'parent' attributes. If one of those
   *       exists in one of the received modeuls, the attribute will be
   *       skipped
   *
   * @param Object module to extend
   * ....
   * @return Class the klass
   */
  extend: function() {
    var filter = ['prototype', 'name', 'parent', 'extend', 'include'];
    for (var i=0; i < arguments.length; i++) {
      if (isHash(arguments[i])) {
        for (var key in arguments[i]) {
          if (!filter.includes(key)) {
            this[key] = arguments[i][key];
          }
        }
      }
    }
    
    return this;
  },
  
  /**
   * extends the class prototype with the given objects
   * NOTE: this method _WILL_OVERWRITE_ the existing itercecting entries
   * NOTE: this method _WILL_NOT_OVERWRITE_ the 'klass' attribute of the klass.prototype
   *
   * @param Object module to include
   * ....
   * @return Class the klass
   */
  include: function() {
    for (var i=0; i < arguments.length; i++) {
      if (isHash(arguments[i])) {
        for (var key in arguments[i]) {
          if (key != 'klass' && key != 'constructor') {
            
            // handling the super methods
            var ancestor = this.ancestors.first(function(klass) { return isFunction(klass.prototype[key]); });
            
            if (ancestor) {
              (function(name, method, $super) {
                this.prototype[name] = function() {
                  this.$super = $super;
                  
                  return method.apply(this, arguments);
                };
              }).call(this, key, arguments[i][key], ancestor.prototype[key]);
            } else {
              this.prototype[key] = arguments[i][key];
            }
            
          }
        }
      }
    }
    return this;
  }
};

/**
 * This is a simple mix-in module to be included in other classes
 *
 * Basically it privdes the <tt>setOptions</tt> method which processes
 * an instance options assigment and merging with the default options
 *
 * Credits:
 *   The idea of the module is inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Options = {
  /**
   * assigns the options by merging them with the default ones
   *
   * @param Object options
   * @return Object current instance
   */
  setOptions: function(options) {
    var names = $w('OPTIONS Options options'),
      objects = [this, this.constructor].concat(this.constructor.ancestors),
      OPTIONS = objects.map(function(object) {
        return names.map(function(name) { return object[name]; });
      }).flatten().first(function(i) { return !!i; });
    
    this.options = Object.merge({}, OPTIONS, options);
    
    // hooking up the observer options
    if (isFunction(this.on)) {
      var match;
      for (var key in this.options) {
        if (match = key.match(/on([A-Z][a-z]+)/)) {
          this.on(match[1].toLowerCase(), this.options[key]);
          delete(this.options[key]);
        }
      }
    }
    
    return this;
  }
};

/**
 * standard Observer class. 
 *
 * Might be used as a usual class or as a builder over another objects
 *
 * Credits:
 *   The naming principle is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var Observer = new Class({
  include: Options,
  
  /**
   * general constructor
   *
   * @param Object options
   */
  initialize: function(options) {
    this.setOptions(options);
    
    // catching up the event shortucts
    var ancestor, shorts = this.EVENTS || this.constructor.EVENTS ||
        ((ancestor = this.constructor.ancestors.first('EVENTS')) ?
          ancestor.EVENTS : null);
          
    Observer.createShortcuts(this, shorts);
  },
  
  /**
   * starts observing an event
   *
   * USAGE:
   *  observe(String event, Function callback[, arguments, ...]);
   *  observe(String event, String method_name[, arguments, ...]);
   *  observe(Object events_hash);
   *
   * @return Observer self
   */
  observe: function() {
    var args = $A(arguments), event = args.shift();
    
    if (!event.trim) { // <- not a string
      for (var name in event) {
        this.observe.apply(this, [name].concat(
          isArray(event[name]) ? event[name] : [event[name]]
        ).concat(args));
      }
    }
    
    if (!this.$listeners) this.$listeners = [];
    
    var callback = args.shift();
    switch (typeof callback) {
      case "string":
        callback = this[callback];
        
      case "function":
        var hash = { e: event, f: callback, a: args };
        this.$listeners.push(hash);
        
        if (this.$o && this.$o.add) this.$o.add.call(this, hash);
        
        break;
        
      default:
        if (isArray(callback)) {
          callback.each(function(params) {
            this.observe.apply(this, [event].concat(
              isArray(params) ? params : [params]
            ).concat(args));
          }, this);
        }
    }
    
    return this;
  },
  
  /**
   * checks if the observer observes given event and/or callback
   *
   * USAGE:
   *   observes(String event)
   *   observes(Function callback)
   *   observes(String event, Function callback)
   *
   * @retun Observer self
   */
  observes: function(event, callback) {
    if (this.$listeners) {
      if (!isString(event)) { callback = event; event = null; }
      if (isString(callback)) callback = this[callback];
      
      return this.$listeners.some(function(i) {
        return (event && callback) ? i.e == event && i.f == callback :
          event ? i.e == event : i.f == callback;
      });
    }
    
    return false;
  },
  
  /**
   * stops observing an event or/and function
   *
   * USAGE:
   *   stopObserving(String event)
   *   stopObserving(Function callback)
   *   stopObserving(String event, Function callback)
   *
   * @return Observer self
   */
  stopObserving: function(event, callback) {
    if (this.$listeners) {
      if (!isString(event)) { callback = event; event = null; }
      if (isString(callback)) callback = this[callback];
      
      this.$listeners = this.$listeners.filter(function(i) {
        var result = (event && callback) ? (i.e != event || i.f != callback) :
          (event ? i.e != event : i.f != callback);
        
        if (!result && this.$o && this.$o.remove) this.$o.remove.call(this, i);
        
        return result;
      }, this);
    }
    
    return this;
  },
  
  /**
   * returns the listeners list for the event
   *
   * NOTE: if no event was specified the method will return _all_
   *       event listeners for _all_ the events
   *
   * @param String event name
   * @return Array of listeners
   */
  listeners: function(event) {
    return (this.$listeners || []).filter(function(i) {
      return !event || i.e == event;
    }).map(function(i) { return i.f; }).uniq();
  },
  
  /**
   * initiates the event handling
   *
   * @param String event name
   * @param mixed optional argument
   * ........
   * @return Observer self
   */
  fire: function() {
    var args = $A(arguments), event = args.shift();
    
    (this.$listeners || []).each(function(i) {
      if (i.e == event) {
        (this.$o && this.$o.fire) ? this.$o.fire.call(this, event, args, i)  :
          i.f.apply(this, i.a.concat(args));
      }
    }, this);
    
    return this;
  },
  
  extend: {
    /**
     * adds an observer functionality to any object
     *
     * @param Object object
     * @param Array optional events list to build shortcuts
     * @return Object extended object
     */
    create: function(object, events) {
      $ext(object, Object.without(this.prototype, 'initialize', 'setOptions'), true);
      return this.createShortcuts(object, events || object['EVENTS']);
    },
    
    /**
     * builds shortcut methods to wire/fire events on the object
     *
     * @param Object object to extend
     * @param Array list of event names
     * @return Object extended object
     */
    createShortcuts: function(object, names) {
      (names || []).each(function(name) {
        var shortcuts = {}, method_name = name.replace(/:/g, '_').camelize();
        shortcuts[method_name] = function() {
          return this.fire.apply(this, [name].concat($A(arguments)));
        };
        shortcuts['on'+method_name.capitalize()] = function() {
          return this.on.apply(this, [name].concat($A(arguments)));
        };
        $ext(object, shortcuts, true);
      });
      
      return object;
    }
  }
});

$alias(Observer.prototype, { on: 'observe' });

/**
 * iterators in-callbacks break exception
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var Break = new Class(Error, {
  message: "Manual iterator break"
});

/**
 * represents some additional functionality for the Event class
 *
 * NOTE: there more additional functionality for the Event class in the rightjs-goods project
 *
 * Credits:
 *   The additional method names are inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Event = new Class(Event, {
  extend: {
    /**
     * extends a native object with additional functionality
     *
     * @param Event event
     * @return Event same event but extended
     */
    ext: function(event) {
      if (!event.stop) {
        $ext(event, this.Methods, true);
        
        if (Browser.IE) {
          // faking the which button
          if (event.type == 'click' || event.type == 'dblclick') {
            event.which = 1;
          } else if (event.type == 'contextmenu') {
            event.which = 3;
          } else {
            event.which = event.button == 2 ? 3 : event.button == 4 ? 2 : 1;
          }
          
          // faking the mouse position
          var scrolls = window.scrolls();

          event.pageX = event.clientX + scrolls.x;
          event.pageY = event.clientY + scrolls.y;


          // faking the relatedElement
          event.relatedElement = event.type == 'mouseover' ? event.fromEvent :
            event.type == 'mouseout' ? event.toEvent : null;

          // faking the target property  
          event.target = event.srcElement;
        }
      }
      
      // Safari bug fix
      if (event.target && event.target.nodeType == 3)
        event.target = event.target.parentNode;
      
      return event;
    },
    
    /**
     * cleans up the event name
     *
     * @param String event name
     * @return String fixed event name
     */
    cleanName: function(name) {
      name = name.toLowerCase();
      name = name.startsWith('on') ? name.slice(2) : name;
      name = name == 'rightclick'  ? 'contextmenu' : name;
      return name;
    },
    
    /**
     * returns a real, browser specific event name 
     *
     * @param String clean unified name
     * @return String real name
     */
    realName: function(name) {
      if (Browser.Gecko     && name == 'mousewheel')  name = 'DOMMouseScroll';
      if (Browser.Konqueror && name == 'contextmenu') name = 'rightclick';
      return name;
    },
    
    /**
     * Registers some additional event extendsions
     *
     * @param Object methods
     * @return void
     */
    addMethods: function(methods) {
      $ext(this.Methods, methods);
      
      try { // extending the events prototype
        $ext(Event.parent.prototype, methods, true);
      } catch(e) {};
    },
    
    // the additional methods registry
    Methods: {}
  },
  
  /**
   * just initializes new custom event
   *
   * @param String event name
   * @param Object options
   * @return Event
   */
  initialize: function(name, options) {
    return new Event.Custom(Event.cleanName(name), options);
  }
});

// hooking up the standard extendsions
Event.addMethods({
  stopPropagation: function() {
    this.cancelBubble = true;
  },
  
  preventDefault: function() {
    this.returnValue = false;
  },
  
  stop: function() {
    this.stopPropagation();
    this.preventDefault();
    return this;
  },
  
  position: function() {
    return {x: this.pageX, y: this.pageY};
  }
});




/**
 * custom events unit, used as a mediator for the artificial events handling in the generic observer
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Event.Custom = new Class({
  /**
   * constructor
   *
   * @param String event name
   * @param Object options
   */
  initialize: function(name, options) {
    this.type = name;
    $ext(this, options || {});
  },
  
  stop: function() {}
});

/**
 * The DOM Element unit handling
 *
 * Credits:
 *   The basic principles of the elements extending are originated from
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
window.Element = new Class(window.Element, {
  /**
   * basic constructor
   *
   * @param String tag name
   * @param Object new element options
   * @return Element object
   */
  initialize: function(tag_name, options) {
    if (Browser.IE && tag_name == 'input' && options && options.checked) {
      tag_name = '<input checked="true"/>';
    }
    
    var element = $(document.createElement(tag_name)), options = options || {};
    
    if (options['html'])    { element.innerHTML = options['html'];  delete(options['html']);    }
    if (options['class'])   { element.className = options['class']; delete(options['class']);   }
    if (options['style'])   { element.setStyle(options['style']);   delete(options['style']);   }
    if (options['observe']) { element.observe(options['observe']);  delete(options['observe']); }
    
    return element.set(options);
  },
  
  extend: {
    Methods: {}, // DO NOT Extend this object manually unless you need it, use Element#addMethods
    
    /**
     * IE browsers manual elements extending
     *
     * @param Element
     * @return Element
     */
    prepare: function(element) {
      if (element && element.tagName && !element.set) {
        $ext(element, Element.Methods, true);
        
        if (self['Form']) {
          switch(element.tagName) {
            case 'FORM':
              Form.ext(element);
              break;

            case 'INPUT':
            case 'SELECT':
            case 'BUTTON':
            case 'TEXTAREA':
              Form.Element.ext(element);
              break;
          }
        }
      }
      return element;
    },
    
    /**
     * registeres the methods on the custom element methods list
     * will add them to prototype and will generate a non extensive static mirror
     * 
     * USAGE:
     *  Element.addMethods({
     *    foo: function(bar) {}
     *  });
     *
     *  $(element).foo(bar);
     *  Element.foo(element, bar);
     *
     * @param Object new methods list
     * @param Boolean flag if the method should keep the existing methods alive
     * @return Element the global Element object
     */
    addMethods: function(methods, dont_overwrite) {
      $ext(this.Methods, methods, dont_overwrite);
      
      try { // busting up the basic element prototypes
        $ext(HTMLElement.prototype, methods, dont_overwrite);
      } catch(e) {
        try { // IE8 native element extension
          $ext(this.parent.prototype, methods, dont_overwrite);
        } catch(e) {}
      }
      
      return this;
    }
  }
});

/**
 * The DOM Element unit structures handling module
 *
 * NOTE: all the methods will process and return only the Element nodes
 *       all the textual nodes will be skipped
 *
 * NOTE: if a css-rule was specified then the result of the method
 *       will be filtered/adjusted depends on the rule
 *
 *       the css-rule might be a string or a Selector instance
 *
 * Credits:
 *   The naming principle and most of the names are taken from
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *   The insertions system implementation is inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Element.addMethods({
  parent: function(css_rule) {
    return css_rule ? this.parents(css_rule).first() : $(this.parentNode);
  },
  
  parents: function(css_rule) {
    return this.rCollect('parentNode', css_rule);
  },
  
  subNodes: function(css_rule) {
    return this.firstChild ? (this.firstChild.tagName ? [$(this.firstChild)] : []
      ).concat(this.rCollect.call(this.firstChild, 'nextSibling', css_rule)) : [];
  },
  
  siblings: function(css_rule) {
    return this.prevSiblings(css_rule).reverse().concat(this.nextSiblings(css_rule));
  },
  
  nextSiblings: function(css_rule) {
    return this.rCollect('nextSibling', css_rule);
  },
  
  prevSiblings: function(css_rule) {
    return this.rCollect('previousSibling', css_rule);
  },
  
  next: function(css_rule) {
    return this.nextSiblings(css_rule).first();
  },
  
  prev: function(css_rule) {
    return this.prevSiblings(css_rule).first();
  },
  
// those two are moved to the Selector unit definition
//  first:  Element.Methods.querySelector,
//  select: Element.Methods.querySelectorAll,
  
  match: function(css_rule) {
    return new Selector(css_rule).match(this);
  },
  
  /**
   * removes the elemnt out of this parent node
   *
   * @return Element self
   */
  remove: function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
    return this;
  },
  
  /**
   * handles the elements insertion functionality
   *
   * The content might be one of the following data
   *
   *  o) an element instance
   *  o) a String, which will be converted into content to insert (all the scripts will be parsed out and executed)
   *  o) a list of Elements 
   *  o) a hash like {position: content}
   *
   * @param mixed data to insert
   * @param String position to insert  top/bottom/before/after/instead
   * @return Element self
   */
  insert: function(content, position) {
    if (isHash(content)) {
      for (var position in content) {
        this.insert(content[position], position)
      }
    } else {
      var scripts = '';
      position = isString(position) ? position.toLowerCase() : 'bottom';
      
      if (isString(content)) {
        content = content.stripScripts(function(s, h) { scripts = s; });
      }
      
      Element.insertions[position](this, content.tagName ? content :
        Element.insertions.createFragment.call(
          (position == 'bottom' || position == 'top' || !this.parentNode) ?
            this : this.parentNode, content
        )
      );
      $eval(scripts);
    }
    return this;
  },
  
  insertTo: function(element, position) {
    $(element).insert(this, position);
    return this;
  },
  
  /**
   * replaces the current element by the given content
   *
   * @param mixed content (a String, an Element or a list of elements)
   * @return Element self
   */
  replace: function(content) {
    return this.insert(content, 'instead');
  },
  
  /**
   * updates the content of the element by the given content
   *
   * @param mixed content (a String, an Element or a list of elements)
   * @return Element self
   */
  update: function(content) {
    if (isString(content)) {
      this.innerHTML = content.stripScripts();
      content.evalScripts();
    } else {
      this.clean().insert(content);
    }
    return this;
  },
  
  /**
   * wraps the element with the given element
   *
   * @param Element wrapper
   * @return Element self
   */
  wrap: function(element) {
    if (this.parentNode) {
      this.parentNode.replaceChild(element, this);
      element.appendChild(this);
    }
    return this;
  },
  
  /**
   * removes all the child nodes out of the element
   *
   * @return Element self
   */
  clean: function() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    
    return this;
  },
  
  /**
   * checks if the element has no child nodes
   *
   * @return boolean check result
   */
  empty: function() {
    return this.innerHTML.blank();
  },

  /**
   * recursively collects nodes by pointer attribute name
   *
   * @param String pointer attribute name
   * @param String optional css-atom rule
   * @return Array found elements
   */
  rCollect: function(attr, css_rule) {
    var node = this, nodes = [];

    while ((node = node[attr])) {
      if (node.tagName && (!css_rule || new Selector(css_rule).match(node))) {
        nodes.push(Browser.OLD ? Element.prepare(node) : node);
      }
    }
    
    return nodes;
  }
});

// list of insertions handling functions
// NOTE: each of the methods will be called in the contects of the current element
Element.insertions = {
  bottom: function(target, content) {
    target.appendChild(content);
  },
  
  top: function(target, content) {
    target.firstChild ? target.insertBefore(content, target.firstChild) : target.appendChild(content);
  },
  
  after: function(target, content) {
    if (target.parentNode) {
      target.nextSibling ? target.parentNode.insertBefore(content, target.nextSibling) : target.parentNode.appendChild(content);
    }
  },
  
  before: function(target, content) {
    if (target.parentNode) {
      target.parentNode.insertBefore(content, target);
    }
  },
  
  instead: function(target, content) {
    if (target.parentNode) {
      target.parentNode.replaceChild(content, target);
    }
  },
  
  // converts any data into a html fragment unit
  createFragment: function(content) {
    var fragment;
    
    if (isString(content)) {
      var tmp = document.createElement('div'),
          wrap = Element.insertions.wraps[this.tagName] || ['', '', 0],
          depth = wrap[2];
          
      tmp.innerHTML = wrap[0] + content + wrap[1];
      
      while (depth > 0) {
        tmp = tmp.firstChild;
        depth--;
      }
      
      fragment = arguments.callee.call(this, tmp.childNodes);
      
    } else {
      fragment = document.createDocumentFragment();
      
      if (isNode(content)) {
        fragment.appendChild(content);
      } else if (content && content.length) {
        for (var i=0, length = content.length; i < length; i++) {
          // in case of NodeList unit, the elements will be removed out of the list during the appends
          // therefore if that's an array we use the 'i' variable, and if it's a collection of nodes
          // then we always hit the first element of the stack
          fragment.appendChild(content[content.length == length ? i : 0]);
        }
      }
    }
    
    return fragment;
  },
  
  wraps: {
    TABLE:  ['<table>',                '</table>',                   1],
    TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
    TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
    TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
    SELECT: ['<select>',               '</select>',                  1]
  }
};
$alias(Element.insertions.wraps, {
  THEAD: 'TBODY',
  TFOOT: 'TBODY',
  TH:    'TD'
});

/**
 * this module contains the element unit styles related methods
 *
 * Credits:
 *   Some of the functionality is inspired by 
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - Dojo      (www.dojotoolkit.org)      Copyright (C) The Dojo Foundation
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Element.addMethods({
  /**
   * assigns styles out of the hash to the element
   *
   * NOTE: the style keys might be camelized or dasherized, both cases should work
   *
   * @param Object styles list or String style name
   * @param String style value in case of the first param a string style name
   * @return Element self
   */
  setStyle: function(hash, value) {
    if (value) { var style = {}; style[hash] = value; hash = style; }
    else if(isString(hash)) {
      var style = {};
      hash.split(';').each(function(option) {
        var els = option.split(':').map('trim');
        if (els[0] && els[1]) {
          style[els[0]] = els[1];
        }
      });
      hash = style;
    }
    
    var c_key;
    for (var key in hash) {
      c_key = key.indexOf('-') != -1 ? key.camelize() : key;
      
      if (key == 'opacity') {
        this.setOpacity(hash[key]);
      } else if (key == 'float') {
        c_key = Browser.IE ? 'styleFloat' : 'cssFloat';
      }
      
      this.style[c_key] = hash[key];
    }
    
    return this;
  },
  
  /**
   * handles the opacity setting
   *
   * @param Float opacity value between 0 and 1
   * @return Element self
   */
  setOpacity: function(value) {
    var key = 'opacity';
    if (Browser.IE) {
      key = 'filter';
      value = 'alpha(opacity='+ value * 100 +')';
    }
    this.style[key] = value;
    return this;
  },
  
  /**
   * returns style of the element
   *
   * NOTE: will include the CSS level definitions
   *
   * @param String style key
   * @return String style value or null if not set
   */
  getStyle: function(key) {
    return this._getStyle(this.style, key) || this._getStyle(this.computedStyles(), key);
  },
  
  /**
   * returns the hash of computed styles for the element
   *
   * @return Object/CSSDefinition computed styles
   */
  computedStyles: function() {
    //     old IE,              IE8,                 W3C
    return this.currentStyle || this.runtimeStyle || this.ownerDocument.defaultView.getComputedStyle(this, null) || {};
  },
  
  // cleans up the style value
  _getStyle: function(style, key) {
    var value, key = key.camelize();
    
    switch (key) {
      case 'opacity':
        value = !Browser.IE ? style[key] :
          (((style['filter'] || '').match(/opacity=(\d+)/i) || ['', '100'])[1].toInt() / 100)+'';
        break;
        
      case 'float':
        key   = Browser.IE ? 'styleFloat' : 'cssFloat';
        
      default:
        if (style[key]) {
          value = style[key];
        } else {
          var values = $w('top right bottom left').map(function(name) {
            var tokens = key.underscored().split('_'); tokens.splice(1, 0, name);
            return style[tokens.join('_').camelize()];
          }).uniq();

          if (values.length == 1) {
            value = values[0];
          }
        }
        
        // Opera returns named colors with quotes
        if (value && Browser.Opera && /color/.test(key)) {
          var match = value.match(/"(.+?)"/);
          value = match ? match[1] : value;
        }
    }
    
    return value ? value : null;
  },
  
  /**
   * checks if the element has the given class name
   * 
   * @param String class name
   * @return boolean check result
   */
  hasClass: function(name) {
    return (' '+this.className+' ').indexOf(' '+name+' ') != -1;
  },
  
  /**
   * sets the whole class-name string for the element
   *
   * @param String class-name
   * @return Element self
   */
  setClass: function(class_name) {
    this.className = class_name;
    return this;
  },

  /**
   * adds the given class name to the element
   *
   * @param String class name
   * @return Element self
   */
  addClass: function(name) {
    if ((' '+this.className+' ').indexOf(' '+name+' ') == -1) {
      this.className += (this.className ? ' ' : '') + name;
    }
    return this;
  },
  
  /**
   * removes the given class name
   *
   * @param String class name
   * @return Element self
   */
  removeClass: function(name) {
    this.className = (' '+this.className+' ').replace(' '+name+' ', ' ').trim();
    return this;
  },
  
  /**
   * toggles the given class name on the element
   *
   * @param String class name
   * @return Element self
   */
   toggleClass: function(name) {
     return this[this.hasClass(name) ? 'removeClass' : 'addClass'](name);
   },
   
   /**
    * adds the given class-name to the element
    * and removes it from all the element siblings
    *
    * @param String class name
    * @return Element self
    */
   radioClass: function(name) {
     this.siblings().each('removeClass', name);
     return this.addClass(name);
   }
});

/**
 * Common DOM Element unit methods
 *
 * Credits:
 *   Most of the naming system in the module inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
Element.addMethods({
  /**
   * sets the element attributes
   *
   * @param String attr name or Object attributes hash
   * @param mixed attribute value
   * @return Element self
   */
  set: function(hash, value) {
    if (value) { var val = {}; val[hash] = value; hash = val; }

    for (var key in hash)
      this[key] = hash[key];
      
    return this;
  },
  
  /**
   * returns the attribute value for the name
   *
   * @param String attr name
   * @return mixed value
   */
  get: function(name) {
    var value = this.getAttribute(name) || this[name];
    return value == '' ? null : value;
  },
  
  /**
   * checks if the element has that attribute
   *
   * @param String attr name
   * @return Boolean check result
   */
  has: function(name) {
    return this.get(name) != null;
  },
  
  /**
   * erases the given attribute of the element
   *
   * @param String attr name
   * @return Element self
   */
  erase: function(name) {
    this.removeAttribute(name);
    return this;
  },
  
  /**
   * checks if the elemnt is hidden
   *
   * NOTE: will check css level computed styles too
   *
   * @return boolean check result
   */
  hidden: function() {
    return this.getStyle('display') == 'none';
  },
  
  /**
   * checks if the element is visible
   *
   * @return boolean check result
   */
  visible: function() {
    return !this.hidden();
  },
  
  /**
   * hides the element
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  hide: function(effect, options) {
    this._$pd = this.getStyle('display');
    this.style.display = 'none';
    return this;
  },
  
  /**
   * shows the element
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  show: function(effect, options) {
    // setting 'block' for the divs and 'inline' for the other elements hidden on the css-level
    var value = this.tagName == 'DIV' ? 'block' : 'inline';
    this.style.display = this._$pd == 'none' ? value : this._$pd || value;
    return this;
  },
  
  /**
   * toggles the visibility state of the element
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  toggle: function(effect, options) {
    return this[this.hidden() ? 'show' : 'hide'](effect, options);
  },
  
  /**
   * shows the element and hides all the sibligns
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  radio: function(effect, options) {
    this.siblings().each('hide', effect, options);
    return this.show();
  }
});

/**
 * this module contains the Element's part of functionality 
 * responsible for the dimensions and positions getting/setting
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
Element.addMethods({
  
  sizes: function() {
    return { x: this.offsetWidth, y: this.offsetHeight };
  },
  
  position: function() {
    var dims = this.dimensions();
    return { x: dims.left, y: dims.top };
  },
  
  scrolls: function() {
    return { x: this.scrollLeft, y: this.scrollTop };
  },
  
  /**
   * returns the element dimensions hash
   *
   * @return Object dimensions (top, left, width, height, scrollLeft, scrollTop)
   */
  dimensions: function() {
    var left = 0, top = 0;
    
    if (this.getBoundingClientRect) {
      var rect = this.getBoundingClientRect(), doc = this.ownerDocument.documentElement, scrolls = window.scrolls();
      
      left = rect.left + scrolls.x - doc.clientLeft;
      top  = rect.top  + scrolls.y - doc.clientTop;
    } else {
      // Manual version
      left = this.offsetLeft;
      top  = this.offsetTop;
      
      if (this.getStyle('position') != 'absolute') {
        var body = this.ownerDocument.body, html = body.parentNode;
        
        left += body.offsetLeft + html.offsetLeft;
        top  += body.offsetTop  + html.offsetTop;
      }
    }
    
    return {
      top:        top,
      left:       left,
      width:      this.sizes().x,
      height:     this.sizes().y,
      scrollLeft: this.scrolls().x,
      scrollTop:  this.scrolls().y
    };
  },
  
  /**
   * sets the width of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param Integer width in pixels
   * @return Element self
   */
  setWidth: function(width_px) {
    this.style.width = width_px + 'px';
    if (this.offsetWidth) this.style.width = (2 * width_px - this.offsetWidth) + 'px';
    return this;
  },
  
  /**
   * sets the width of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param Integer height in pixels
   * @return Element self
   */
  setHeight: function(height_px) {
    this.style.height = height_px + 'px';
    if (this.offsetHeight) this.style.height = (2 * height_px - this.offsetHeight) + 'px';
    return this;
  },
  
  /**
   * sets the size of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param Integer width in pixels or {x: 10, y: 20} like object
   * @param Integer height
   * @return Element self
   */
  resize: function(width, height) {
    if (isHash(width)) {
      height = width.y;
      width  = width.x;
    }
    
    this.setWidth(width);
    return this.setHeight(height);
  },
  
  /**
   * sets the element position (against the window corner)
   *
   * @param Number left position in pixels or an object like {x: 10, y: 20}
   * @param Number top position in pixels
   * @return Element self
   */
  moveTo: function(left, top) {
    if (isHash(left)) {
      top  = left.y;
      left = left.x;
    }
    
    return this.setStyle({
      left: left + 'px',
      top:  top  + 'px'
    });
  },
  
  /**
   * sets the scroll position
   *
   * @param Integer left scroll px or an object like {x: 22, y: 33}
   * @param Integer top scroll px
   * @return Element self
   */
  scrollTo: function(left, top) {
    if (isHash(left)) {
      top  = left.y;
      left = left.x;
    }
    
    this.scrollLeft = left;
    this.scrollTop  = top;
    
    return this;
  },
  
  /**
   * makes the window be scrolled to the element
   *
   * @return Element self
   */
  scrollThere: function() {
    window.scrollTo(this);
    return this;
  }
});

/**
 * DOM Element events handling methods
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
Element.addMethods((function() {
  var observer = Observer.create({}, 
    $w('click rightclick contextmenu mousedown mouseup mouseover mouseout mousemove keypress keydown keyup')
  );
  
  observer.$o = {
    add: function(hash) {
      var callback = hash.f, args = hash.a;
      hash.e = Event.cleanName(hash.e);
      hash.n = Event.realName(hash.e);
      
      hash.w = function() {
        Event.ext(arguments[0]);
        return callback.apply(this, $A(arguments).concat(args));
      };
      
      if (this.addEventListener) {
        this.addEventListener(hash.n, hash.w, false);
      } else {
        hash.w = hash.w.bind(this);
        this.attachEvent('on'+ hash.n, hash.w);
      }
    },
    
    remove: function(hash) {
      if (this.removeEventListener) {
        this.removeEventListener(hash.n, hash.w, false);
      } else {
        this.detachEvent('on'+ hash.n, hash.w);
      }
    },
    
    fire: function(name, args, hash) {
      var event = new Event(name, args.shift());
      hash.f.apply(this, [event].concat(hash.a).concat(args));
    }
  };
  
  // a simple events terminator method to be hooked like
  // this.onClick('stopEvent');
  observer.stopEvent = function(e) { e.stop(); };
  
  $ext(window,   observer);
  $ext(document, observer);
  
  return observer;
})());


/**
 * The DOM elements selection handling class
 *
 * Credits:
 *   The naming principles of the unit are inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */

// checking, monkeying and hooking the native css-selectors interface
//          IE8               W3C
[document, (Element.parent || self['HTMLElement'] || {}.constructor).prototype].each(function(object, i) {
  var old_selector     = object.querySelector;
  var old_selector_all = object.querySelectorAll;
  
  // the native selectors checking/monkeying
  var selectors = {};
  if (!old_selector) selectors.querySelector = function(css_rule) {
    return new Selector(css_rule).first(this);
  };
  if (!old_selector_all) selectors.querySelectorAll = function(css_rule) {
    return new Selector(css_rule).select(this);
  };
  
  // RightJS version of the selectors
  selectors.first = old_selector ? i ? function(css_rule) {
    return this.querySelector(this.tagName + ' ' + (css_rule || '*'));
  } : function(css_rule) {
    return this.querySelector(css_rule || '*');
  } : selectors.querySelector;
  
  selectors.select = old_selector_all ? i ? function(css_rule) {
    return $A(this.querySelectorAll(this.tagName + ' ' + (css_rule || '*')));
  } : function(css_rule) {
    return $A(this.querySelectorAll(css_rule || '*'));
  } : selectors.querySelectorAll;
  
  return i ? Element.addMethods(selectors) : $ext(object, selectors);
});


var Selector = new Class({
  extend: {
    cache: {}
  },
    
  /**
   * constructor
   *
   * @param String css rule definition
   * @return void
   */
  initialize: function(css_rule) {
    var cached = isString(css_rule) ? Selector.cache[css_rule] : css_rule;
    if (cached) return cached;
    Selector.cache[css_rule] = this;
    
    this.cssRule = css_rule || '*';
    
    var strategy = 'Manual';
    if (this.cssRule.includes(',')) {
      strategy = 'Multiple';
    }
    
    this.strategy = new Selector[strategy](this.cssRule);
  },
  
  /**
   * selects the first matching element which is a sub node of the given element
   * and matches the selector's css-rule
   *
   * @param Element element
   * @return Element matching element or null if nothing found
   */
  first: Browser.OLD ? function(element) {
    var element = this.strategy.first(element);
    return  element ? $(element) : null;
  } : function(element) {
    return this.strategy.first(element);
  },
  
  /**
   * select all the subnodes of the element which are matching the rule
   *
   * @param Element element
   * @return Array list of found nodes
   */
  select: Browser.OLD ? function(element) {
    return this.strategy.select(element).map(Element.prepare);
  } : function(element) {
    return this.strategy.select(element);
  },
  
  /**
   * checks if the element matches the rule
   *
   * @param Element element
   * @return Boolean check result
   */
  match: function(element) {
    return this.strategy.match(element);
  }
});


/**
 * this class represent a simple css-definition atom unit
 *
 * the main purpose is to organize the simpliest case of css-rule match for the manual matcher.
 *
 * Credits:
 *   Some functionality and principles are inspired by css-selectors in
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Selector.Atom = new Class({
  id: null,
  tag: '*',
  classes: [],
  pseudo: null,
  pseudoValue: null,
  attrs: {},

  rel: ' ', // relations with the previous atom

  ID_RE:     /#([\w\-_]+)/,
  TAG_RE:    /^[\w\*]+/,
  CLASS_RE:  /\.([\w\-\._]+)/,
  PSEUDO_RE: /:([\w\-]+)(\((.+?)\))*$/,
  ATTRS_RE:  /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/,

  /**
   * constructor
   *
   * @param String css-definition
   * @param String relation with the previous atom
   * @return void
   */
  initialize: function(css_rule, rel) {
    css_rule = css_rule.trim();
    this.rel = rel || ' ';
    this.hasNonTagMatcher = !/^[a-z\*]+$/.test(css_rule);
    
    // NOTE! dont change the order of the atom parsing, there might be collisions
    this.attrs = {};
    while((m = css_rule.match(this.ATTRS_RE))) {
      this.attrs[m[1]] = { op: m[2], value: m[5] || m[6] };
      css_rule = css_rule.replace(m[0], '');
    }
    
    if ((m = css_rule.match(this.PSEUDO_RE))) {
      this.pseudo = m[1];
      this.pseudoValue = m[3] == '' ? null : m[3];
      css_rule = css_rule.replace(m[0], '');
    } else {
      this.pseudo = null;
      this.pseudoValue = null;
    }
    
    this.id  = (css_rule.match(this.ID_RE) || [1, null])[1];
    this.tag = (css_rule.match(this.TAG_RE) || '*').toString().toUpperCase();
    this.classes = (css_rule.match(this.CLASS_RE) || [1, ''])[1].split('.').without('');
    
    this.buildMatch();
  },

  /**
   * cecks if the node matches the atom
   *
   * @param Element element
   * @return Boolean check result
   */
  match: null, // this method is dinamically generated depend on the situation

// protected

  // building the match method for the particular case
  buildMatch: function() {
    var matchers = [];
    
    if (this.id)                   matchers.push('matchId');
    if (this.tag != '*')           matchers.push('matchTag');
    if (this.classes.length)       matchers.push('matchClass');
    if (!Object.empty(this.attrs)) matchers.push('matchAttrs');
    if (this.pseudo)               matchers.push('matchPseudo');
    
    if (matchers.length == 1) {
      this.match = this[matchers[0]];
    } else if (matchers.length) {
      var length = matchers.length;
      this.match = function(element) {
        for (var i=0; i < length; i++)
          if (!this[matchers[i]](element))
            return false;
        return true;
      }
    } else {
      this.match = function() { return true; }
    }
  },

  matchId: function(element) {
    return element.id == this.id;
  },

  matchTag: function(element) {
    return element.tagName == this.tag;
  },

  matchClass: function(element) {
    if (element.className) {
      var names = element.className.split(' ');
      if (names.length == 1) {
        return this.classes.indexOf(names[0]) != -1;
      } else {
        for (var i=0, length = this.classes.length; i < length; i++)
          if (names.indexOf(this.classes[i]) == -1)
            return false;
            
        return true;
      }
    }
    return false;
  },

  matchAttrs: function(element) {
    var matches = true;
    for (var key in this.attrs) {
      matches &= this.matchAttr(element, key, this.attrs[key]['op'], this.attrs[key]['value']);
    }
    return matches;
  },
  
  matchAttr: function(element, name, operator, value) {
    var attr = element.getAttribute(name) || '';
    switch(operator) {
      case '=':  return attr == value;
      case '*=': return attr.includes(value);
      case '^=': return attr.startsWith(value);
      case '$=': return attr.endsWith(value);
      case '~=': return attr.split(' ').includes(value);
      case '|=': return attr.split('-').includes(value);
      default:   return attr != '';
    }
    return false;
  },

  matchPseudo: function(element) {
    return this.pseudoMatchers[this.pseudo].call(element, this.pseudoValue, this.pseudoMatchers);
  },

  /**
   * W3C pseudo matchers
   *
   * NOTE: methods of the module will be called in a context of an element
   */
  pseudoMatchers: {
    checked: function() {
      return this.checked;
    },
    
    disabled: function() {
      return this.disabled;
    },

    empty: function() {
      return !(this.innerText || this.innerHTML || this.textContent || '').length;
    },

    'first-child': function(tag_name) {
      var node = this;
      while ((node = node.previousSibling)) {
        if (node.tagName && (!tag_name || node.tagName == tag_name)) {
          return false;
        }
      }
      return true;
    },
    
    'first-of-type': function() {
      return arguments[1]['first-child'].call(this, this.tagName);
    },

    'last-child': function(tag_name) {
      var node = this;
      while ((node = node.nextSibling)) {
        if (node.tagName && (!tag_name || node.tagName == tag_name)) {
          return false;
        }
      }
      return true;
    },
    
    'last-of-type': function() {
      return arguments[1]['last-child'].call(this, this.tagName);
    },

    'only-child': function(tag_name, matchers) {
      return matchers['first-child'].call(this, tag_name) 
        && matchers['last-child'].call(this, tag_name);
    },
    
    'only-of-type': function() {
      return arguments[1]['only-child'].call(this, this.tagName, arguments[1]);
    },

    'nth-child': function(number, matchers, tag_name) {
      if (!matchers.hasParent(this)) return false;
      number = number.toLowerCase();
      
      if (number == 'n') return true;
      
      if (number.includes('n')) {
        // parsing out the matching expression
        var a = b = 0;
        if (m = number.match(/^([+-]?\d*)?n([+-]?\d*)?$/)) {
          a = m[1] == '-' ? -1 : parseInt(m[1], 10) || 1;
          b = parseInt(m[2], 10) || 0;
        }
        
        // getting the element index
        var index = 1, node = this;
        while ((node = node.previousSibling)) {
          if (node.tagName && (!tag_name || node.tagName == tag_name)) index++;
        }
        
        return (index - b) % a == 0 && (index - b) / a >= 0;
        
      } else {
        return matchers['index'].call(this, number.toInt() - 1, matchers, tag_name);
      }
    },
    
    'nth-of-type': function(number) {
      return arguments[1]['nth-child'].call(this, number, arguments[1], this.tagName);
    },
    
// protected
    index: function(number, matchers, tag_name) {
      number = isString(number) ? number.toInt() : number;
      var node = this, count = 0;
      while ((node = node.previousSibling)) {
        if (node.tagName && (!tag_name || node.tagName == tag_name) && ++count > number) return false;
      }
      return count == number;
    },
    
    // checking if the element has a parent node
    // the '-----fake' parent is a temporary context for the element
    // just of the matching process
    hasParent: function(element) {
      return element.parentNode && element.parentNode.id != '-----fake';
    }
  }
});

/**
 * represents a manual (virtual) selector strategy
 *
 * Credits:
 *   Some principles were inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Selector.Manual = new Class({
  ATOMS_SPLIT_RE: /(\s*([~>+ ])\s*)(?![^\s\)\]]*(\)|\]))/,
  
  /**
   * constructor
   *
   * @param String css-rule
   */
  initialize: function(css_rule) {
    var css_rule = css_rule.trim();
    this.cssRule = css_rule;
    
    this.atoms = [];

    var relation = null, match = null;

    while (match = css_rule.match(this.ATOMS_SPLIT_RE)) {
      separator_pos = css_rule.indexOf(match[0]);
      this.atoms.push(new Selector.Atom(css_rule.substring(0, separator_pos), relation));

      relation = match[2]; // <- puts the current relation to the next atom

      // chopping off the first atom of the rule
      css_rule = css_rule.substr(separator_pos+(match[1].length==1 ? 1 : match[1].length-1)).trim();
    }
    this.atoms.push(new Selector.Atom(css_rule, relation));
  },

  /**
   * searches for the first matching subnode
   *
   * @param Element base node
   * @return Element matching element or null if nothing found
   */
  first: function(node) {
    return this.select(node).first();
  },

  /**
   * selects all the matching subnodes
   *
   * @param Element base node
   * @return Array found nodes
   */
  select: function(node) {
    var founds, atom, index, sub_founds;
    
    for (var i=0, i_length = this.atoms.length; i < i_length; i++) {
      atom = this.atoms[i];
      if (i == 0) {
        founds =  this.find[atom.rel](node, atom);
        
      } else {
        if (i > 1) founds = this.uniq(founds);
        
        for (var j=0; j < founds.length; j++) {
          sub_founds = this.find[atom.rel](founds[j], atom);
          
          sub_founds.unshift(1); // <- nuke the parent node out of the list
          sub_founds.unshift(j); // <- position to insert the subresult

          founds.splice.apply(founds, sub_founds);
          
          j += sub_founds.length - 3;
        }
      }
    }
    
    return this.atoms.length > 1 ? this.uniq(founds) : founds;
  },

  /**
   * checks if the node matches the rule
   *
   * @param Element node to check
   * @return boolean check result
   */
  match: function(element) {
    // if there's more than one atom, we match the element in a context
    if (!this.atoms || this.atoms.length > 1) {
      if (element.parentNode) {
          // searching for the top parent node
          // NOTE: don't use the Element.parents in here to avoid annecessary elements extending
          var p = element, parent;
          while ((p = p.parentNode)) parent = p;
        } else {
          // putting the element in a temporary context so we could test it
          var parent = document.createElement('div'), parent_is_fake = true;
          parent.id = '-----fake'; // <- this id is used in the manual 'match' method,
                                   // to determine if the element originally had no parent node
          parent.appendChild(element);
        }

        var match = this.select(parent).includes(element);
        if (parent_is_fake) parent.removeChild(element);
    } else {
      // if there's just one atom, we simple match against it.
      var match = this.atoms[0].match(element);
    }
    
    return match;
  },
  
// protected
  uniq: function(elements) {
    var uniq = [], uids = [], uid;
    for (var i=0, length = elements.length; i < length; i++) {
      uid = $uid(elements[i]);
      if (!uids[uid]) {
        uniq.push(elements[i]);
        uids[uid] = true;
      }
    }
    
    return uniq;
  },

  find: {
    /**
     * search for any descendant nodes
     */
    ' ': function(element, atom) {
      var founds = $A(element.getElementsByTagName(atom.tag));
      if (atom.hasNonTagMatcher) {
        var matching = [];
        for (var i=0, length = founds.length; i < length; i++) {
          if (atom.match(founds[i]))
            matching.push(founds[i]);
        }
        return matching;
      }
      return founds;
    },

    /**
     * search for immidate descendant nodes
     */
    '>': function(element, atom) {
      var node = element.firstChild, matched = [];
      while (node) {
        if (atom.match(node)) {
          matched.push(node);
        }
        node = node.nextSibling;
      }
      return matched;
    },

    /**
     * search for immiate sibling nodes
     */
    '+': function(element, atom) {
      while ((element = element.nextSibling)) {
        if (element.tagName) {
          return atom.match(element) ? [element] : [];
        }
      }
      return [];
    },

    /**
     * search for late sibling nodes
     */
    '~': function(element, atom) {
      var founds = [];
      while ((element = element.nextSibling)) {
        if (atom.match(element))
          founds.push(element);
      }
      return founds;
    }
  } 

});

/**
 * represents a complex, multi ruled select strategy
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Selector.Multiple  = new Class({
  
  /**
   * constructor
   *
   * @param String css-rule
   */
  initialize: function(css_rule) {
    this.cssRule = css_rule;
    this.selectors = css_rule.split(',').map(function(rule) {
      return rule.blank() ? null : new Selector.Manual(rule);
    }).compact();
  },

  /**
   * searches for the first matching subnode
   *
   * @param Element base node
   * @return Element matching element or null if nothing found
   */
  first: function(node) {
    return this.selectors.map('first', node).first(function(i) { return !!i;});
  },

  /**
   * selects all the matching subnodes
   *
   * @param Element base node
   * @return Array found nodes
   */
  select: function(node) {
    return this.selectors.map('select', node, null).flatten().uniq();
  },

  /**
   * checks if the node matches the rule
   *
   * @param Element node to check
   * @return boolean check result
   */
  match: function(node) {
    return this.selectors.some('match', node) || !this.selectors.length;
  }
});


/**
 * the window object extensions
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(self, (function(win) {
  var old_scroll = win.scrollTo;
  
return {
    /**
     * returns the inner-sizes of the window
     *
     * @return Object x: d+, y: d+
     */
    sizes: function() {
      return this.innerWidth ? {x: this.innerWidth, y: this.innerHeight} :
        {x: document.documentElement.clientWidth, y: document.documentElement.clientHeight};
    },

    /**
     * returns the scrolls for the window
     *
     * @return Object x: d+, y: d+
     */
    scrolls: function() {
      return (this.pageXOffset || this.pageYOffset) ? {x: this.pageXOffset, y: this.pageYOffset} :
        (this.document.body.scrollLeft || this.document.body.scrollTop) ? 
        {x: this.document.body.scrollLeft, y: this.document.body.scrollTop} :
        {x: this.document.documentElement.scrollLeft, y: this.document.documentElement.scrollTop};
    },

    /**
     * overloading the native scrollTo method to support hashes and element references
     *
     * @param mixed number left position, a hash position, element or a string element id
     * @param number top position
     * @return window self
     */
    scrollTo: function(left, top) {
      if(isElement(left) || (isString(left) && $(left))) {
        left = $(left).position();
      }

      if (isHash(left)) {
        top  = left.y;
        left = left.x;
      }
      
      old_scroll(left, top);

      return this;
    }
};

})(window));

/**
 * The dom-ready event handling code
 *
 * Credits:
 *   The basic principles of the module are originated from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
[window, document].each(function(object) {
  Observer.createShortcuts(object, ['ready']);
  var ready = object.ready.bind(object);
  
  if (Browser.IE) {
    var tmp = $E('div');
    (function() {
      var loaded = false;
      try {
        document.body.appendChild(tmp);
        tmp.remove();
        loaded = true;
      } catch(e) { arguments.callee.delay(50);}
      if (loaded) ready();
    })();
  } else if (document['readyState'] !== undefined) {
    (function() {
      $w('loaded complete').includes(document.readyState) ? ready() : arguments.callee.delay(50);
    })();
  } else {
    document.addEventListener('DOMContentLoaded', ready, false);
  }
  
});

/**
 * The form unit class and extensions
 *
 * Credits:
 *   The basic principles of the module are inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Form = new Class(Element, {
  /**
   * generic forms creation constructor
   *
   * @param Object form options
   */
  initialize: function(options) {
    var options = options || {}, remote = options['remote'],
      form = this.$super('form', Object.without(options, 'remote'));
    
    if (remote) form.remotize();
    
    return form;
  },
  
  extend: {
    /**
     * IE browsers manual elements extending
     *
     * @param Element form
     * @return Form element
     */
    ext: function(element) {
      return $ext(element, this.Methods);
    },
    
    Methods: {},
    
    /**
     * Extends the form functionality
     *
     * @param Object methods hash
     * @return void
     */
    addMethods: function(methods, dont_overwrite) {
      $ext(Form.Methods, methods, dont_overwrite);
      
      try { // trying to extend the form element prototype
        $ext(HTMLFormElement.prototype, methods, dont_overwrite);
      } catch(e) {}
    }
  }
});

Form.addMethods({
  /**
   * returns the form elements as an array of extended units
   *
   * @return Array of elements
   */
  getElements: function() {
    return this.select('input,select,textarea,button');
  },
  
  /**
   * returns the list of all the input elements on the form
   *
   * @return Array of elements
   */
  inputs: function() {
    return this.getElements().filter(function(input) {
      return !['submit', 'button', 'reset', 'image', null].includes(input.type);
    });
  },
  
  /**
   * focuses on the first input element on the form
   *
   * @return Form this
   */
  focus: function() {
    var first = this.inputs().first(function(input) { return input.type != 'hidden'; });
    if (first) first.focus();
    return this.fire('focus');
  },
  
  /**
   * removes focus out of all the form elements
   *
   * @return Form this
   */
  blur: function() {
    this.getElements().each('blur');
    return this.fire('blur');
  },
  
  /**
   * disables all the elements on the form
   *
   * @return Form this
   */
  disable: function() {
    this.getElements().each('disable');
    return this.fire('disable');
  },
  
  /**
   * enables all the elements on the form
   *
   * @return Form this
   */
  enable: function() {
    this.getElements().each('enable');
    return this.fire('enable');
  },
  
  /**
   * returns the list of the form values
   *
   * @return Object values
   */
  values: function() {
    var values = {};
    
    this.inputs().each(function(input) {
      if (!input.disabled && input.name && (!['checkbox', 'radio'].includes(input.type) || input.checked))
        values[input.name] = input.getValue();
    });
    
    return values;
  },
  
  /**
   * returns the key/values organized ready to be sent via a get request
   *
   * @return String serialized values
   */
  serialize: function() {
    return Object.toQueryString(this.values());
  }
});

// creating the shortcuts
Form.addMethods(Observer.createShortcuts({}, $w('submit reset focus')), true);



/**
 * there is the form-elements additional methods container
 *
 * Credits:
 *   The basic ideas are taken from
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
(function() {
  // trying to get the input element classes list
  try { var input_classes = [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement, HTMLButtonElement];
  } catch(e) { var input_classes = []; }
  
  Form.Element = {
    /**
     * IE browsers manual elements extending
     *
     * @param Element element
     * @return Element extended element
     */
    ext: function(element) {
      // highjack the native methods to be able to call them froum our wrappers
      element._blur   = element.blur;
      element._focus  = element.focus;
      element._select = element.select;

      return $ext(element, this.Methods);
    },

    // the methods container
    Methods: {},

    /**
     * Extends the Form.Element methods
     *
     * @param Object methods list
     * @return void
     */
    addMethods: function(methods, dont_overwrite) {
      $ext(this.Methods, methods, dont_overwrite);

      // extending the input element prototypes
      input_classes.each(function(klass) {
        $ext(klass.prototype, methods, dont_overwrite);
      });
    }
  };

  // creating the blur, focus and select methods aliases
  input_classes.each(function(klass) {
    $alias(klass.prototype, {
      _blur:   'blur',
      _focus:  'focus',
      _select: 'select'
    });
  });
})();

Form.Element.addMethods({
  /**
   * uniform access to the element values
   *
   * @return String element value
   */
  getValue: function() {
    if (this.type == 'select-multiple') {
      return $A(this.getElementsByTagName('option')).map(function(option) {
        return option.selected ? option.value : null;
      }).compact();
    } else {
      return this.value;
    }
  },

  /**
   * uniform accesss to set the element value
   *
   * @param String value
   * @return Element this
   */
  setValue: function(value) {
    if (this.type == 'select-multiple') {
      value = (isArray(value) ? value : [value]).map(String);
      $A(this.getElementsByTagName('option')).each(function(option) {
        option.selected = value.includes(option.value);
      });
    } else {
      this.value = value;
    }
    return this;
  },

  /**
   * makes the element disabled
   *
   * @return Element this
   */
  disable: function() {
    this.disabled = true;
    this.fire('disable');
    return this;
  },

  /**
   * makes the element enabled
   *
   * @return Element this
   */
  enable: function() {
    this.disabled = false;
    this.fire('enable');
    return this;
  },
  
  /**
   * focuses on the element
   *
   * @return Element this
   */
  focus: function() {
    Browser.OLD ? this._focus() : this._focus.call(this);
    this.focused = true;
    this.fire('focus');
    return this;
  },
  
  /**
   * focuses on the element and selects its content
   *
   * @return Element this
   */
  select: function() {
    this.focus();
    Browser.OLD ? this._select() : this._select.call(this);
    return this;
  },
  
  /**
   * looses the element focus
   *
   * @return Element this
   */
  blur: function() {
    Browser.OLD ? this._blur() : this._blur.call(this);
    this.focused = false;
    this.fire('blur');
    return this;
  }
});

// creating the common event shortcuts
Form.Element.addMethods(Observer.createShortcuts({}, $w('disable enable focus blur change')), true);


/**
 * this module handles the work with cookies
 *
 * Credits:
 *   Most things in the unit are take from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var Cookie = new Class({
  include: Options,
  
  extend: {
    // sets the cookie
    set: function(name, value, options) {
      return new this(name, options).set(value);
    },
    // gets the cookie
    get: function(name) {
      return new this(name).get();
    },
    // deletes the cookie
    remove: function(name) {
      return new this(name).remove();
    },
    
    // checks if the cookies are enabled
    enabled: function() {
      document.cookie = "__t=1";
      return document.cookie.indexOf("__t=1")!=-1;
    },
    
    // some basic options
    Options: {
      secure:   false,
      document: document
    }
  },
  
  /**
   * constructor
   * @param String cookie name
   * @param Object options
   * @return void
   */
  initialize: function(name, options) {
    this.name = name;
    this.setOptions(options);
  },
  
  /**
   * sets the cookie with the name
   *
   * @param mixed value
   * @return Cookie this
   */
  set: function(value) {
    var value = encodeURIComponent(value);
    if (this.options.domain) value += '; domain=' + this.options.domain;
    if (this.options.path) value += '; path=' + this.options.path;
    if (this.options.duration){
      var date = new Date();
      date.setTime(date.getTime() + this.options.duration * 24 * 60 * 60 * 1000);
      value += '; expires=' + date.toGMTString();
    }
    if (this.options.secure) value += '; secure';
    this.options.document.cookie = this.name + '=' + value;
    return this;
  },
  
  /**
   * searches for a cookie with the name
   *
   * @return mixed saved value or null if nothing found
   */
  get: function() {
    var value = this.options.document.cookie.match('(?:^|;)\\s*' + RegExp.escape(this.name) + '=([^;]*)');
    return (value) ? decodeURIComponent(value[1]) : null;
  },
  
  /** 
   * removes the cookie
   *
   * @return Cookie this
   */
  remove: function() {
    this.options.duration = -1;
    return this.set('');
  }
});

/**
 * XMLHttpRequest wrapper
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - jQuery    (http://jquery.com)        Copyright (C) John Resig
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var Xhr = new Class(Observer, {
  extend: {
    // supported events list
    EVENTS: $w('success failure complete request cancel create'),
    
    // default options
    Options: {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
      },
      method:       'post',
      encoding:     'utf-8',
      async:        true,
      evalScripts:  false,
      evalResponse: false,
      evalJSON:     true,
      secureJSON:   true,
      urlEncoded:   true,
      spinner:      null,
      spinnerFx:    'fade',
      params:       null
    },
    
    /**
     * Shortcut to initiate and send an XHR in a single call
     *
     * @param String url
     * @param Object options
     * @return Xhr request
     */
    load: function(url, options) {
      return new this(url, Object.merge({method: 'get'}, options)).send();
    }
  },
  
  /**
   * basic constructor
   *
   * @param String url
   * @param Object options
   */
  initialize: function(url, options) {
    this.initCallbacks(); // system level callbacks should be initialized before the user callbacks
    
    this.url = url;
    this.$super(options);
    
    // copying some options to the instance level attributes
    for (var key in Xhr.Options)
      this[key] = this.options[key];
      
    this.initSpinner();
  },
  
  /**
   * sets a header 
   *
   * @param String header name
   * @param String header value
   * @return Xhr self
   */
  setHeader: function(name, value) {
    this.headers[name] = value;
    return this;
  },
  
  /**
   * tries to get a response header
   *
   * @return mixed String header value or undefined
   */
  getHeader: function(name) {
    try {
      return this.xhr.getResponseHeader(name);
    } catch(e) {}
  },
  
  /**
   * checks if the request was successful
   *
   * @return boolean check result
   */
  successful: function() {
    return (this.status >= 200) && (this.status < 300);
  },
  
  /**
   * performs the actual request sending
   *
   * @param Object options
   * @return Xhr self
   */
  send: function(params) {
    var add_params = {}, url = this.url;
    
    var method = this.method.toUpperCase();
    if (['PUT', 'DELETE'].includes(method)) {
      add_params['_method'] = method.toLowerCase();
      method = 'POST';
    }
    
    var data = this.prepareData(this.params, this.prepareParams(params), add_params);
    
    if (this.urlEncoded && method == 'POST' && !this.headers['Content-type']) {
      this.setHeader('Content-type', 'application/x-www-form-urlencoded; charset='+this.encoding);
    }
    
    if (method == 'GET') {
      url += (url.includes('?') ? '&' : '?') + data;
      data = null;
    }
    
    this.xhr = this.createXhr();
    this.fire('create');
    
    this.xhr.open(method, url, this.async);
    
    this.xhr.onreadystatechange = this.stateChanged.bind(this);
    
    for (var key in this.headers) {
      this.xhr.setRequestHeader(key, this.headers[key]);
    }
    
    this.xhr.send(data);
    this.fire('request');
    
    if (!this.async) this.stateChanged();
    
    return this;
  },
  
  /**
   * elements automaticall update method, creates an Xhr request 
   * and updates the element innerHTML value onSuccess.
   * 
   * @param Element element
   * @param Object optional request params
   * @return Xhr self
   */
  update: function(element, params) {
    return this.onSuccess(function(r) { element.update(r.text); }).send(params);
  },
  
  /**
   * stops the request processing
   *
   * @return Xhr self
   */
  cancel: function() {
    if (!this.xhr || this.xhr.canceled) return this;
    
    this.xhr.abort();
    this.xhr.onreadystatechange = function() {};
    this.xhr.canceled = true;
    
    return this.fire('cancel');
  },
  
// protected
  // wrapping the original method to send references to the xhr objects
  fire: function(name) {
    return this.$super(name, this, this.xhr);
  },
  
  // creates new request instance
  createXhr: function() {
    if (this.form && this.form.getElements().map('type').includes('file')) {
      return new Xhr.IFramed(this.form);
    } else try {
      return new XMLHttpRequest();
    } catch(e) {
      return new ActiveXObject('MSXML2.XMLHTTP');
    }
  },
  
  // prepares user sending params
  prepareParams: function(params) {
    if (params && params.tagName == 'FORM') {
      this.form = params;
      params = params.values();
    }
    return params;
  },
  
  // converts all the params into a url params string
  prepareData: function() {
    return $A(arguments).map(function(param) {
      if (!isString(param)) {
        param = Object.toQueryString(param);
      }
      return param.blank() ? null : param;
    }).compact().join('&');
  },

  // handles the state change
  stateChanged: function() {
    if (this.xhr.readyState != 4 || this.xhr.canceled) return;
    
    try { this.status = this.xhr.status;
    } catch(e) { this.status = 0; }
    
    this.text = this.responseText = this.xhr.responseText;
    this.xml  = this.responseXML  = this.xhr.responseXML;
    
    this.fire('complete').fire(this.successful() ? 'success' : 'failure');
  },
  
  // called on success
  tryScripts: function(response) {
    if (this.evalResponse || (/(ecma|java)script/).test(this.getHeader('Content-type'))) {
      $eval(this.text);
    } else if ((/json/).test(this.getHeader('Content-type')) && this.evalJSON) {
      this.json = this.responseJSON = this.sanitizedJSON();
    } else if (this.evalScripts) {
      this.text.evalScripts();
    }
  },
  
  // sanitizes the json-response texts
  sanitizedJSON: function() {
    // checking the JSON response formatting
    if (!(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(this.text.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) {
      if (this.secureJSON) {
        throw "JSON parse error: "+this.text;
      } else {
        return null;
      }
    }
    
    return eval("("+this.text+")");
  },
  
  // initializes the request callbacks
  initCallbacks: function() {
    // creating an automatical spinner handling
    this.on('create', 'showSpinner').on('complete', 'hideSpinner').on('cancel', 'hideSpinner');
    
    // response scripts evaluation, should be before the global xhr callbacks
    this.on('success', 'tryScripts');
    
    // wiring the global xhr callbacks
    Xhr.EVENTS.each(function(name) {
      this.on(name, function() { Xhr.fire(name, this, this.xhr); });
    }, this);
  },
  
  // inits the spinner
  initSpinner: function() {
    if (this.spinner)
      this.spinner = $(this.spinner);
      
      if (Xhr.Options.spinner && this.spinner === $(Xhr.Options.spinner))
        this.spinner = null;
  },
  
  showSpinner: function() { if (this.spinner) this.spinner.show(this.spinnerFx, {duration: 100}); },
  hideSpinner: function() { if (this.spinner) this.spinner.hide(this.spinnerFx, {duration: 100}); }
});

// creating the class level observer
Observer.create(Xhr);

// attaching the common spinner handling
$ext(Xhr, {
  counter: 0,
  showSpinner: function() {
    if (this.Options.spinner) $(this.Options.spinner).show(this.Options.spinnerFx, {duration: 100});
  },
  hideSpinner: function() {
    if (this.Options.spinner) $(this.Options.spinner).hide(this.Options.spinnerFx, {duration: 100});
  }
});

Xhr.on('create', function() {
  this.counter++;
  this.showSpinner();
}).on('complete', function() {
  this.counter--;
  if (this.counter < 1) this.hideSpinner();
}).on('cancel', function() {
  this.counter--;
  if (this.counter < 1) this.hideSpinner();
});


/**
 * Here are the Form unit Xhr extensions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - jQuery    (http://jquery.com)        Copyright (C) John Resig
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Form.addMethods({
  /**
   * sends the form via xhr request
   *
   * @params Options xhr request options
   * @return Form this
   */
  send: function(options) {
    options = options || {};
    options['method'] = options['method'] || this.method || 'post';
    
    new Xhr(this.get('action') || document.location.href, options
      ).onRequest(this.disable.bind(this)
      ).onComplete(this.enable.bind(this)).send(this);
    
    return this;
  },
  
  /**
   * makes the form be remote by default
   *
   * @params Object default options
   * @return Form this
   */
  remotize: function(options) {
    this.onsubmit = function() {
      this.send.bind(this, Object.merge({spinner: this.first('.spinner')}, options)).delay(20);
      return false;
    };
      
    this.remote   = true;
    return this;
  },
  
  /**
   * removes the remote call hook
   *
   * NOTE: will nuke onsubmit attribute
   *
   * @return Form this
   */
  unremotize: function() {
    this.onsubmit = function() {};
    this.remote   = false;
    return this;
  }
});

/**
 * this module contains the Element unit XHR related extensions
 *
 * Credits:
 *   - jQuery    (http://jquery.com)        Copyright (C) John Resig
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
Element.addMethods({
  /**
   * performs an Xhr request to the given url
   * and updates the element internals with the responseText
   *
   * @param String url address
   * @param Object xhr options
   * @return Element this
   */
  load: function(url, options) {
    new Xhr(url, Object.merge({method: 'get'}, options)).update(this);
    return this;
  }
});

/**
 * This unit presents a fake drop in replacement for the XmlHTTPRequest unit
 * but works with an iframe targeting in the background
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
Xhr.IFramed = new Class({
  /**
   * constructor
   *
   * @param Form form which will be submitted via the frame
   * @return void
   */
  initialize: function(form) {
    this.form = form;
    
    var id = 'xhr_frame_'+Math.random().toString().split('.').last();
    $E('div').insertTo(document.body).update('<iframe name="'+id+'" id="'+id+'" width="0" height="0" frameborder="0" src="about:blank"></iframe>');
    
    this.iframe = $(id);
    this.iframe.on('load', this.onLoad.bind(this));
  },
  
  send: function() {
    // stubbing the onsubmit method so it allowed us to submit the form
    var old_onsubmit = this.form.onsubmit,
        old_target   = this.form.target;
    
    this.form.onsubmit = function() {};
    this.form.target   = this.iframe.id;
    
    this.form.submit();
    
    this.form.onsubmit = old_onsubmit;
    this.form.target   = old_target;
  },
  
  onLoad: function() {
    this.status       = 200;
    this.readyState   = 4;
    
    var doc = window[this.iframe.id].document.documentElement;
    this.responseText = doc ? doc.innerHTML : null;
    
    this.onreadystatechange();
  },
  
  // dummy API methods
  open:               function() {},
  abort:              function() {},
  setRequestHeader:   function() {},
  onreadystatechange: function() {}
});

/**
 * Basic visual effects class
 *
 * Credits:
 *   The basic principles, structures and naming system are inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Fx = new Class(Observer, {
  extend: {
    EVENTS: $w('start finish cancel'),
    
    // named durations
    Durations: {
      'short':  200,
      'normal': 400,
      'long':   800
    },
    
    // default options
    Options: {
      fps:        Browser.IE ? 40 : 60,
      duration:   'normal',
      transition: 'Sin',
      queue:      true
    },

    // list of basic transitions
    Transitions: {
      Sin: function(i)  {
        return -(Math.cos(Math.PI * i) - 1) / 2;
      },
      
      Cos: function(i) {
        return Math.asin((i-0.5) * 2)/Math.PI + 0.5;
      },
      
      Exp: function(i) {
        return Math.pow(2, 8 * (i - 1));
      },
      
      Log: function(i) {
        return 1 - Math.pow(2, - 8 * i);
      },
      
      Lin: function(i) {
        return i;
      }
    }
  },
  
  /**
   * Basic constructor
   *
   * @param Object options
   */
  initialize: function(element, options) {
    this.$super(options);
    this.element = $(element);
  },
  
  /**
   * starts the transition
   *
   * @return Fx this
   */
  start: function() {
    if (this.queue(arguments)) return this;
    this.prepare.apply(this, arguments);
    
    this.transition = Fx.Transitions[this.options.transition] || this.options.transition;
    var duration    = Fx.Durations[this.options.duration]     || this.options.duration;
    
    this.steps  = (duration / 1000 * this.options.fps).ceil();
    this.number = 1;
    
    return this.fire('start', this).startTimer();
  },
  
  /**
   * finishes the transition
   *
   * @return Fx this
   */
  finish: function() {
    return this.stopTimer().fire('finish').next();
  },
  
  /**
   * interrupts the transition
   *
   * @return Fx this
   */
  cancel: function() {
    return this.stopTimer().fire('cancel').next();
  },
  
  /**
   * pauses the transition
   *
   * @return Fx this
   */
  pause: function() {
    return this.stopTimer();
  },
  
  /**
   * resumes a paused transition
   *
   * @return Fx this
   */
  resume: function() {
    return this.startTimer();
  },
  
// protected
  // dummy method, should be implemented in a subclass
  prepare: function() {},

  // dummy method, should implement the actual things happenning
  render: function(value) {},
  
  // the periodically called method
  // NOTE: called outside of the instance scope!
  step: function($this) {
    if ($this.steps >= $this.number) {
      $this.render($this.transition($this.number / $this.steps));
      
      $this.number ++;
    } else {
      $this.finish();
    }
  },
  
  // calculates the current value
  calc: function(start, end, delata) {
    return start + (end - start) * delta;
  },
  
  startTimer: function() {
    this.timer = this.step.periodical((1000 / this.options.fps).round(), this);
    return this;
  },
  
  stopTimer: function() {
    if (this.timer) {
      this.timer.stop();
    }
    return this;
  },

  // handles effects queing
  // should return false if there's no queue and true if there is a queue
  queue: function(args) {
    if (!this.element) return false;
    if (this.$chained) {
      delete(this['$chained']);
      return false;
    }

    var uid = $uid(this.element), chain;
    if (!Fx.$chains)      Fx.$chains = {};
    if (!Fx.$chains[uid]) Fx.$chains[uid] = [];
    chain = Fx.$chains[uid];

    if (this.options.queue)
      chain.push([args, this]);
    
    this.next = function() {
      var next = chain.shift(); next = chain[0];
      if (next) {
        next[1].$chained = true;
        next[1].start.apply(next[1], next[0]);
      }
      return this;
    };

    return chain[0][1] !== this && this.options.queue;
  },
  
  next: function() {
    return this;
  }
  
  
});

/**
 * Here are the Array class extensions depend on the fx library
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Array.prototype, {
  /**
   * converts the array into a string rgb(R,G,B) definition
   *
   * @return String rgb(DDD, DDD, DDD) value
   */
  toRgb: function() {
    return 'rgb('+this.map(Math.round)+')';
  }
});

/**
 * There are the String unit extensions for the effects library
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
String.COLORS = {
  maroon:  '#800000',
  red:     '#ff0000',
  orange:  '#ffA500',
  yellow:  '#ffff00',
  olive:   '#808000',
  purple:  '#800080',
  fuchsia: '#ff00ff',
  white:   '#ffffff',
  lime:    '#00ff00',
  green:   '#008000',
  navy:    '#000080',
  blue:    '#0000ff',
  aqua:    '#00ffff',
  teal:    '#008080',
  black:   '#000000',
  silver:  '#c0c0c0',
  gray:    '#808080',
  brown:   '#a52a2a'
};

$ext(String.prototype, {
  /**
   * converts a #XXX or rgb(X, X, X) sring into standard #XXXXXX color string
   *
   * @return String hex color
   */
  toHex: function() {
    var match = this.match(/^#(\w)(\w)(\w)$/);
    
    if (match) {
      match = "#"+ match[1]+match[1]+match[2]+match[2]+match[3]+match[3];
    } else if (match = this.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)) {
      match = "#"+ match.slice(1).map(function(bit) {
        bit = (bit-0).toString(16);
        return bit.length == 1 ? '0'+bit : bit;
      }).join('');
    } else {
      match = String.COLORS[this] || this;
    }
    
    return match;
  },
  
  /**
   * converts a hex string into an rgb array
   *
   * @param boolean flag if need an array
   * @return String rgb(R,G,B) or Array [R,G,B]
   */
  toRgb: function(array) {
    var match = (this.toHex()||'').match(/#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i);
    
    if (match) {
      match = match.slice(1).map('toInt', 16);
      match = array ? match : match.toRgb();
    }
    
    return match;
  }
});

/**
 * This class provides the basic effect for styles manipulation
 *
 * Credits:
 *   The idea is inspired by the Morph effect from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Morph = new Class(Fx, {

// protected
  
  /**
   * starts the effect
   *
   * @param mixed an Object with an end style or a string with the end class-name(s)
   * @return Fx this
   */
  prepare: function(style) {
    this.endStyle   = this._findStyle(style);
    this.startStyle = this._getStyle(this.element, Object.keys(this.endStyle));
    
    this._cleanStyles();
    
    return this.$super();
  },
  
  render: function(delta) {
    var value, start, end;
    
    for (var key in this.endStyle) {
      start = this.startStyle[key];
      end   = this.endStyle[key];

      if (typeof(start) == 'number') {
        // handling floats like opacity
        value = start + (end - start) * delta;
        
      } else if(start.length == 2) {
        // handling usual sizes with dimensions
        value = (start[0] + (end[0] - start[0]) * delta) + end[1];

      } else if(start.length == 3) {
        // calculating colors
        value = end.map(function(value, i) {
          return start[i] + (value - start[i]) * delta;
        }).toRgb();
      }
      
      if (key == 'opacity') {
        this.element.setOpacity(value);
      } else {
        this.element.style[key] = value;
      }
    }
  },
  
// private

  // finds the style definition by a css-selector string
  _findStyle: function(style) {
    // a dummy node to calculate the end styles
    var element = this._dummy().setStyle(style);
    
    // grabbing the computed styles
    var element_styles      = element.computedStyles();
    var this_element_styles = this.element.computedStyles();
    
    // grabbing the element style
    var end_style = this._getStyle(element, Object.keys(style), element_styles);
    
    // assigning the border style if the end style has a border
    var border_style = element_styles.borderTopStyle, element_border_style = this_element_styles.borderTopStyle;
    if (border_style != element_border_style) {
      if (element_border_style  == 'none') {
        this.element.style.borderWidth =  '0px';
      }
      this.element.style.borderStyle = border_style;
      if (this._transp(this_element_styles.borderTopColor)) {
        this.element.style.borderColor = this_element_styles.color;
      }
    }
    
    element.remove();
    
    return end_style;
  },
  
  // creates a dummy element to work with
  _dummy: function() {
    // a container for the styles extraction element
    var container = Fx.Morph.$c = (Fx.Morph.$c || $E('div', {style: "visibility:hidden;float:left;height:0;width:0"}));
    if (this.element.parentNode) this.element.parentNode.insertBefore(container, this.element);
    
    return $(this.element.cloneNode(false)).insertTo(container);
  },
  
  // grabs computed styles with the given keys out of the element
  _getStyle: function(element, keys, styles) {
    var style = {}, styles = styles || element.computedStyles(), name;
    if (isString(keys)) { name = keys, keys = [keys]; }
    
    for (var i=0; i < keys.length; i++) {
      var key = keys[i].camelize();
      
      // keys preprocessing
      if (key == 'background') key = 'backgroundColor';
      else if (key == 'border') {
        key = 'borderWidth';
        keys.splice(i+1, 0, 'borderColor'); // inserting the border color as the next unit
      }
      
      // getting the actual style
      style[key] = element._getStyle(styles, key);
      
      // Opera returns named colors as quoted strings
      if (Browser.Opera && /color/i.test(key)) style[key] = style[key].replace(/'|"/g, '');
      
      // getting the real color if it's a transparent
      if (this._transp(style[key])) style[key] = this._getBGColor(element);
      
      // getting the real width and height if they not set or set as 'auto'
      if (!style[key] || style[key] == 'auto') {
        style[key] = key == 'width'  ? element.offsetWidth  + 'px' :
                     key == 'height' ? element.offsetHeight + 'px' : '';
      }
    }
    
    return name ? style[name] : style;
  },
  
  // looking for the visible background color of the element
  _getBGColor: function(element) {
    return [element].concat(element.parents()).map(function(node) {
      var bg = node.getStyle('backgroundColor');
      return (bg && !this._transp(bg)) ? bg : null; 
    }, this).compact().first() || 'rgb(255,255,255)';
  },
  
  // prepares the style values to be processed correctly
  _cleanStyles: function() {
    var end = this.endStyle, start = this.startStyle;
    
    // filling up missing styles
    for (var key in end) {
      if (start[key] === '' && /^[\d\.\-]+[a-z]+$/.test(end[key])) {
        start[key] = '0px';
      }
    }
    
    [end, start].each(this._cleanStyle, this);
    
    // removing duplications between start and end styles
    for (var key in end) {
      if (!defined(start[key]) || (end[key] instanceof Array ? end[key].join() === start[key].join() : end[key] === start[key])) {
        delete(end[key]);
        delete(start[key]);
      }
    }
  },
  
  // cleans up a style object
  _cleanStyle: function(style) {
    var match;
    for (var key in style) {
      style[key] = String(style[key]);
        
      if (/color/i.test(key)) {
        // preparing the colors
        style[key] = style[key].toRgb(true);
        if (!style[key]) delete(style[key]);
      } else if (/^[\d\.]+$/.test(style[key])) {
        // preparing numberic values
        style[key] = style[key].toFloat();
      } else if (match = style[key].match(/^([\d\.\-]+)([a-z]+)$/i)) {
        // preparing values with dimensions
        style[key] = [match[1].toFloat(), match[2]];
        
      } else {
        delete(style[key]);
      }
    }
  },
  
  // checks if the color is transparent
  _transp: function(color) {
    return color == 'transparent' || color == 'rgba(0, 0, 0, 0)';
  }
});

/**
 * the elements hightlighting effect
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Highlight = new Class(Fx.Morph, {
  extend: {
    Options: Object.merge(Fx.Options, {
      color:      '#FF8',
      transition: 'Exp'
    })
  },
  
// protected
  
  /**
   * starts the transition
   *
   * @param String the hightlight color
   * @param String optional fallback color
   * @return self
   */
  prepare: function(start, end) {
    var end_color = end || this.element.getStyle('backgroundColor');
    
    if (this._transp(end_color)) {
      this.onFinish(function() { this.element.style.backgroundColor = 'transparent'; });
      end_color = this._getBGColor(this.element);
    }
    
    this.element.style.backgroundColor = (start || this.options.color);
    
    return this.$super({backgroundColor: end_color});
  }
});

/**
 * this is a superclass for the bidirectional effects
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Twin = new Class(Fx.Morph, {
  
  /**
   * hides the element if it meant to be switched off
   *
   * @return Fx self
   */
  finish: function() {
    if (this.how == 'out')
      this.element.hide();
      
    return this.$super();
  },

// protected
  
  /**
   * assigns the direction of the effect in or out
   *
   * @param String 'in', 'out' or 'toggle', 'toggle' by default
   */
  setHow: function(how) {
    this.how = how || 'toggle';
    
    if (this.how == 'toggle')
      this.how = this.element.visible() ? 'out' : 'in';
  }

});

/**
 * the slide effects wrapper
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Slide = new Class(Fx.Twin, {
  extend: {
    Options: Object.merge(Fx.Options, {
      direction: 'top'
    })
  },
  
// protected  
  prepare: function(how) {
    this.setHow(how);

    this.element.show();
    this.sizes = this.element.sizes();
    
    this.styles = {};
    $w('overflow height width marginTop marginLeft').each(function(key) {
      this.styles[key] = this.element.style[key];
    }, this);

    this.element.style.overflow = 'hidden';
    this.onFinish('_getBack').onCancel('_getBack');

    return this.$super(this._endStyle(this.options.direction));
  },

  _getBack: function() {
    this.element.setStyle(this.styles);
  },

  // calculates the final style
  _endStyle: function(direction) {
    var style = {}, sizes = this.sizes,
      margin_left = (this.styles.marginLeft || '0').toFloat(),
      margin_top  = (this.styles.marginTop  || '0').toFloat();

    if (this.how == 'out') {
      style[['top', 'bottom'].includes(direction) ? 'height' : 'width'] = '0px';

      if (direction == 'right') {
        style.marginLeft = margin_left + sizes.x+'px';
      } else if (direction == 'bottom') {
        style.marginTop = margin_top + sizes.y +'px';
      }

    } else if (this.how == 'in') {
      var element_style = this.element.style;
      
      if (['top', 'bottom'].includes(direction)) {
        style.height = sizes.y + 'px';
        element_style.height = '0px';
      } else {
        style.width = sizes.x + 'px';
        element_style.width = '0px';
      }

      if (direction == 'right') {
        style.marginLeft = margin_left + 'px';
        element_style.marginLeft = margin_left + sizes.x + 'px';
      } else if (direction == 'bottom') {
        style.marginTop = margin_top + 'px';
        element_style.marginTop = margin_top + sizes.y + 'px';
      }
    }

    return style;
  }

});

/**
 * The opacity effects wrapper
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Fade = new Class(Fx.Twin, {
  prepare: function(how) {
    this.setHow(how);
    
    if (this.how == 'in')
      this.element.setOpacity(0).show();
    
    return this.$super({opacity: typeof(how) == 'number' ? how : this.how == 'in' ? 1 : 0});
  }
});

/**
 * This block contains additional Element shortcuts for effects easy handling
 *
 * Credits:
 *   Some ideas are inspired by 
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Element.addMethods((function(methods) {
  var old_hide   = methods.hide,
      old_show   = methods.show,
      old_resize = methods.resize;

return {

  /**
   * hides the element with given visual effect
   *
   * @param String fx name
   * @param Object fx options
   */
  hide: function(fx, options) {
    return fx ? this.fx(fx, ['out', options], old_hide) : old_hide.call(this);
  },
  
  /**
   * shows the element with the given visual effect
   *
   * @param String fx name
   * @param Object fx options
   */
  show: function(fx, options) {
    return fx ? this.fx(fx, ['in', options], old_show) : old_show.call(this);
  },
  
  /**
   * resizes the element using the Morph visual effect
   *
   * @param Integer width
   * @param Integer height
   * @param Object options
   */
  resize: function(width, height, options) {
    if (isHash(width)) {
      height = width.y;
      width  = width.x;
    }
    if (options) {
      var style = {};
      if (isNumber(height)) style.height = height+'px';
      if (isNumber(width))  style.width  = width +'px';
      
      if (!isHash(options)) options = {duration: options};
      
      return this.fx('morph', [style, options]);
    } else {
      return old_resize.call(this, width, height);
    }
  },
  
  /**
   * runs the Fx.Morth effect to the given style
   *
   * @param Object style or a String class names
   * @param Object optional effect options
   * @return Element self
   */
  morph: function(style, options) {
    return this.fx('morph', [style, options || {}]); // <- don't replace with arguments
  },
  
  /**
   * highlights the element
   *
   * @param String start color
   * @param String optional end color
   * @param Object effect options
   * @return Element self
   */
  highlight: function() {
    return this.fx('highlight', arguments);
  },
  
  /**
   * runs the Fx.Fade effect on the element
   *
   * @param mixed fade direction 'in' 'out' or a float number
   * @return Element self
   */
  fade: function() {
    return this.fx('fade', arguments);
  },
  
  /**
   * runs the Fx.Slide effect on the element
   *
   * @param String 'in' or 'out'
   * @param Object effect options
   * @return Element self
   */
  slide: function() {
    return this.fx('slide', arguments);
  },
  
// protected

  // runs an Fx on the element
  fx: function(name, args, on_finish) {
    var args = $A(args).compact(), options = {};
    if (isHash(args.last())) { options = args.pop(); }
    
    var fx = new Fx[name.capitalize()](this, options);
    if (on_finish) fx.onFinish(on_finish.bind(this));
    fx.start.apply(fx, args);
    
    return this;
  }
  
}})(Element.Methods));

