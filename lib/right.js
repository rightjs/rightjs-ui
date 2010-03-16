/**
 * RightJS, http://rightjs.org
 * Released under the MIT license
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
/**
 * The framework description object
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
RightJS = {
  version: "1.5.6",
  modules: ["core", "dom", "form", "cookie", "xhr", "fx", "olds"]
};

/**
 * There are some util methods
 *
 * Credits:
 *   Some of the functionality and names are inspired or copied from
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
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
  var src = src || {}, key;

  for (key in src)
    if (dont_overwrite !== true || typeof(dest[key]) === 'undefined')
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

/** !#server
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
    $E('script', {type: 'text/javascript', text: text}).insertTo(document.body);
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
  return typeof(value) !== 'undefined';
};


/**
 * checks if the given value is a function
 *
 * @param mixed value
 * @return boolean check result
 */
function isFunction(value) {
  return typeof(value) === 'function';
};

/**
 * checks if the given value is a string
 *
 * @param mixed value
 * @return boolean check result
 */
function isString(value) {
  return typeof(value) === 'string';
};


/**
 * checks if the given value is a number
 *
 * @param mixed value to check
 * @return boolean check result
 */
function isNumber(value) {
  return typeof(value) === 'number';
};

/** !#server
 * checks if the given value is an element
 *
 * @param mixed value to check
 * @return boolean check result
 */
function isElement(value) {
  return value && value.tagName;
};

/** !#server
 * checks if the given value is a DOM-node
 *
 * @param mixed value to check
 * @return boolean check result
 */
function isNode(value) {
  return value && value.nodeType;
};

/** !#server
 * shortcut to instance new elements
 *
 * @param String tag name
 * @param object options
 * @return Element instance
 */
function $E(tag_name, options) {
  return new Element(tag_name, options);
};

/** !#server
 * searches an element by id and/or extends it with the framework extentions
 *
 * @param String element id or Element to extend
 * @return Element or null
 */
function $(element) {
  return typeof(element) === 'string' ? document.getElementById(element) : element;
};

/** !#server
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
};

// we need to generate those functions in an anonymous scope
(function() {
  var to_s = Object.prototype.toString, slice = Array.prototype.slice, UID = 1;
  
  /**
   * checks if the given value is a hash-like object
   *
   * @param mixed value
   * @return boolean check result
   */
  isHash = function(value) {
    return to_s.call(value) === '[object Object]';
  };
  
  /** !#server
   * Internet Explorer needs some additional mumbo-jumbo in here
   */
  if (isHash(document.documentElement)) {
    isHash = function(value) {
      return to_s.call(value) === '[object Object]' &&
        value !== null && typeof(value) !== 'undefined' &&
        typeof(value.hasOwnProperty) !== 'undefined';
    };
  }

  /**
   * checks if the given value is an array
   *
   * @param mixed value to check
   * @return boolean check result
   */
  isArray = function(value) {
    return to_s.call(value) === '[object Array]';
  };
  
  /**
   * converts any iterables into an array
   *
   * @param Object iterable
   * @return Array list
   */
  $A = function (it) {
    try {
      return slice.call(it);
    } catch(e) {
      for (var a=[], i=0, length = it.length; i < length; i++)
        a[i] = it[i];
      return a;
    }
  };

  /**
   * generates an unique id for an object
   *
   * @param Object object
   * @return Integer uniq id
   */
  $uid = function(item) {
    return item.uid || (item.uid = UID++);
  };
  
  /**
   * Generating methods for native units extending
   */
  for (var i=0, natives = [Array, Function, Number, String, Date, RegExp]; i < natives.length; i++) {
    natives[i].include = function(module, dont_overwrite) {
      $ext(this.prototype, module, dont_overwrite);
      return this;
    };
  }
})();




/**
 * The Object class extentions
 *
 * Credits:
 *   Some functionality is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
$ext(Object, {
  /**
   * extracts the list of the attribute names of the given object
   *
   * @param Object object
   * @return Array keys list
   */
  keys: function(object) {
    var keys = [], key;
    for (key in object)
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
    var values = [], key;
    for (key in object)
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
    var filter = $A(arguments), object = filter.shift(), copy = {}, key;
    
    for (key in object)
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
    var filter = $A(arguments), object = filter.shift(), copy = {},
        i=0, length = filter.length;
    
    for (; i < length; i++) {
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
    var object = {}, i=0, length = arguments.length;
    for (; i < length; i++) {
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
    var tokens = [], key;
    for (key in object) {
      tokens.push(key+'='+encodeURIComponent(object[key]))
    }
    return tokens.join('&');
  }
}, true);

/**
 * here are the starndard Math object extends
 *
 * Credits:
 *   The idea of random mehtod is taken from
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov
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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
(function(A_proto) {
  
  // JavaScript 1.6 methods recatching up or faking
  var for_each = A_proto.forEach || function(callback, scope) {
    for (var i=0, length = this.length; i < length; i++)
      callback.call(scope, this[i], i, this);
  };
  
  var filter = A_proto.filter || function(callback, scope) {
    for (var result=[], i=0, j=0, length = this.length; i < length; i++) {
      if (callback.call(scope, this[i], i, this))
        result[j++] = this[i];
    }
    return result;
  };
  
  var map = A_proto.map || function(callback, scope) {
    for (var result=[], i=0, length = this.length; i < length; i++) {
      result[i] = callback.call(scope, this[i], i, this);
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
  
  function first(callback, scope) {
    for (var i=0, length = this.length; i < length; i++) {
      if (callback.call(scope, this[i], i, this))
        return this[i];
    }
    return this._$u; // <- undefined, see #191
  };
  
  function last(callback, scope) {
    for (var i=this.length-1; i > -1; i--) {
      if (callback.call(scope, this[i], i, this))
        return this[i];
    }
    return this._$u; // <- undefined, see #191
  };
  
  
  //
  // RightJS callbacks magick preprocessing
  //
  
  // prepares a correct callback function
  function guess_callback(args, array) {
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
  function call_method(func, scope, args) {
    try {
      return func.apply(scope, guess_callback(args, scope));
    } catch(e) { if (!(e instanceof Break)) throw(e); }
  };
  
  // checks the value as a boolean
  function boolean_check(i) {
    return !!i;
  };
  
Array.include({
  /**
   * IE fix
   * returns the index of the value in the array
   *
   * @param mixed value
   * @param Integer optional offset
   * @return Integer index or -1 if not found
   */
  indexOf: A_proto.indexOf || function(value, from) {
    for (var i=(from<0) ? Math.max(0, this.length+from) : from || 0, l = this.length; i < l; i++)
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
  some: function(value) {
    return call_method(some, this, value ? arguments : [boolean_check]);
  },
  
  /**
   * checks if all the array elements are logically true
   *
   * @param Function optional callback for checks
   * @param Object optional scope for the callback
   * @return Boolean check result
   */
  every: function(value) {
    return call_method(every, this, value ? arguments : [boolean_check]);
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
    for (var copy = this.clone(), arg, i=0, j, length = arguments.length; i < length; i++) {
      arg = arguments[i];
      if (isArray(arg)) {
        for (j=0; j < arg.length; j++) {
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
    return this.without(null, this._$u); // <- this._u === undefined, see #191
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
    var shuff = this.clone(), j, x, i = shuff.length;
    
    for (; i; j = Math.random(i-1), x = shuff[--i], shuff[i] = shuff[j], shuff[j] = x);
    
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
});

$alias(A_proto, {
  include: 'includes',
  all: 'every',
  any: 'some'
});

})(Array.prototype);



/**
 * The String class extentions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *   The trim function taken from work of Steven Levithan
 *     - http://blog.stevenlevithan.com/archives/faster-trim-javascript
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
String.include({
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
    var scripts = '', text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/img, function(match, source) {
      scripts += source + "\n";
      return '';
    });
    
    if (option === true)
      $eval(scripts);
    else if (isFunction(option))
      option(scripts, text);
    
    return text;
  },
  
  /**
   * extracts all the scripts out of the string
   *
   * @return String the extracted stcripts
   */
  extractScripts: function() {
    var scripts = '';
    this.stripScripts(function(s) { scripts = s; });
    return scripts;
  },
  
  /**
   * evals all the scripts in the string
   *
   * @return String self (unchanged version with scripts still in their place)
   */
  evalScripts: function() {
    this.stripScripts(true);
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
    return ignorecase ? start_str.toLowerCase() === string.toLowerCase() : 
      start_str === string;
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
    return ignorecase ? end_str.toLowerCase() === string.toLowerCase() :
      end_str === string;
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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Function.include({
  /**
   * binds the function to be executed in the given scope
   *
   * @param Object scope
   * @param mixed optional curry (left) argument
   * ....
   * @return Function binded function
   */
  bind: function() {
    var args = $A(arguments), scope = args.shift(), func = this;
    return function() {
      return func.apply(scope, (args.length || arguments.length) ? args.concat($A(arguments)) : args);
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
    var args = $A(arguments), scope = args.shift(), func = this;
    return function(event) {
      return func.apply(scope, [event || window.event].concat(args).concat($A(arguments)));
    };
  },

  /**
   * allows you to put some curry in your cookery
   *
   * @param mixed value to curry
   * ....
   * @return Function curried function
   */
  curry: function() {
    return this.bind.apply(this, [this].concat($A(arguments)));
  },
  
  /**
   * The right side curry feature
   *
   * @param mixed value to curry
   * ....
   * @return Function curried function
   */
  rcurry: function() {
    var curry = $A(arguments), func = this;
    return function() {
      return func.apply(func, $A(arguments).concat(curry));
    }
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
    var args  = $A(arguments), timeout = args.shift(),
        timer = new Number(window.setTimeout(this.bind.apply(this, [this].concat(args)), timeout));

    timer.cancel = function() { window.clearTimeout(this); };

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
    var args  = $A(arguments), timeout = args.shift(),
        timer = new Number(window.setInterval(this.bind.apply(this, [this].concat(args)), timeout));

    timer.stop = function() { window.clearInterval(this); };

    return timer;
  },
  
  /**
   * Chains the given function after the current one
   *
   * @param Function the next function
   * @param mixed optional value to curry
   * ......
   * @return Function chained function
   */
  chain: function() {
    var args = $A(arguments), func = args.shift(), current = this;
    return function() {
      var result = current.apply(current, arguments);
      func.apply(func, args);
      return result;
    };
  }
});

/**
 * The Number class extentions
 *
 * Credits:
 *   Some methods inspired by
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Number.include({
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
  
  round: function(base) {
    if (base) {
      var base = Math.pow(10, base);
      return Math.round(this * base) / base;
    } else {
      return Math.round(this);
    }
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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */


 /**
  * Escapes the string for safely use as a regular expression
  *
  * @param String raw string
  * @return String escaped string
  */
RegExp.escape = function(string) {
  return (''+string).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};

/**
 * The basic Class unit
 *
 * Credits:
 *   The Class unit is inspired by its implementation in
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Class = function() {
  var args = $A(arguments), properties = args.pop() || {}, parent = args.pop();
  
  // basic class object definition
  function klass() {
    return this.initialize ? this.initialize.apply(this, arguments) : this;
  };

  // if only the parent class has been specified
  if (!args.length && !isHash(properties)) {
    parent = properties; properties = {};
  }
  
  // attaching main class-level methods
  $ext(klass, Class.Methods).inherit(parent);
  
  // catching the injections
  $w('extend include').each(function(name) {
    if (properties[name]) {
      var modules = properties[name];
      klass[name].apply(klass, isArray(modules) ? modules : [modules]);
      delete(properties[name]);
    }
  });
  
  return klass.include(properties);
};

/**
 * This method gets through a list of the object its class and all the ancestors
 * and finds a hash named after property, used for configuration purposes with
 * the Observer and Options modules
 *
 * NOTE: this method will look for capitalized and uppercased versions of the
 *       property name
 *
 * @param Object a class instance
 * @param String property name
 * @return Object hash or null if nothing found
 */
Class.findSet = function(object, property) {
  var upcased = property.toUpperCase(), capcased = property.capitalize(),
    candidates = [object, object.constructor].concat(object.constructor.ancestors),
    holder = candidates.first(function(o) { return o && (o[upcased] || o[capcased]) });
    
  return holder ? holder[upcased] || holder[capcased] : null;
};

/**
 * This module contains the methods by which the Class instances
 * will be extended. It provides basic and standard way to work
 * with the classes.
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Class.Methods = (function() {
  var commons = $w('selfExtended self_extended selfIncluded self_included'),
      extend  = commons.concat($w('prototype parent extend include')),
      include = commons.concat(['constructor']);
  
  function clean_module(module, what) {
    return Object.without.apply(Object, [module].concat(what == 'e' ? extend : include));
  };
  
return {
  /**
   * Makes the class get inherited from another one
   *
   * @param Object another class
   * @return Class this
   */
  inherit: function(parent) {
    // handling the parent class assign
    if (parent && parent.prototype) {
      var s_klass = function() {};
      s_klass.prototype = parent.prototype;
      this.prototype = new s_klass;
      this.parent = parent;
    }

    // collecting the list of ancestors
    this.ancestors = [];
    while (parent) {
      this.ancestors.push(parent);
      parent = parent.parent;
    }

    return this.prototype.constructor = this;
  },

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
    $A(arguments).filter(isHash).each(function(module) {
      var callback = module.selfExtended || module.self_extended;
      
      $ext(this, clean_module(module, 'e'));
      
      if (callback) callback.call(module, this);
    }, this);

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
    var ancestors = this.ancestors.map('prototype'), ancestor;

    $A(arguments).filter(isHash).each(function(module) {
      var callback = module.selfIncluded || module.self_included;
      module = clean_module(module, 'i');

      for (var key in module) {
        ancestor = ancestors.first(function(proto) { return isFunction(proto[key]); });

        this.prototype[key] = !ancestor ? module[key] :
          (function(name, method, super_method) {
            return function() {
              this.$super = super_method;

              return method.apply(this, arguments);
            };
          })(key, module[key], ancestor[key]);
      }

      if (callback) callback.call(module, this);
    }, this);

    return this;
  }
}})();

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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Options = {
  /**
   * assigns the options by merging them with the default ones
   *
   * @param Object options
   * @return Object current instance
   */
  setOptions: function(options) {
    var options = this.options = Object.merge(Class.findSet(this, 'options'), options), match, key;
    
    // hooking up the observer options
    if (isFunction(this.on)) {
      for (key in options) {
        if (match = key.match(/on([A-Z][A-Za-z]+)/)) {
          this.on(match[1].toLowerCase(), options[key]);
          delete(options[key]);
        }
      }
    }
    
    return this;
  },
  
  /**
   * Cuts of an options hash from the end of the arguments list
   * assigns them using the #setOptions method and then
   * returns the list of other arguments as an Array instance
   *
   * @param mixed iterable
   * @return Array of the arguments
   */
  cutOptions: function(args) {
    var args = $A(args);
    this.setOptions(isHash(args.last()) ? args.pop() : {});
    return args;
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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Observer = new Class({
  include: Options,
  
  /**
   * general constructor
   *
   * @param Object options
   */
  initialize: function(options) {
    this.setOptions(options);    
    Observer.createShortcuts(this, Class.findSet(this, 'events'));
  },
  
  /**
   * binds an event listener
   *
   * USAGE:
   *  on(String event, Function callback[, arguments, ...]);
   *  on(String event, String method_name[, arguments, ...]);
   *  on(Object events_hash);
   *
   * @return Observer self
   */
  on: function() {
    var args = $A(arguments), event = args.shift();
    
    if (isString(event)) {
      if (!defined(this.$listeners)) this.$listeners = [];

      var callback = args.shift(), name;
      switch (typeof callback) {
        case "string":
          name     = callback;
          callback = this[callback];

        case "function":
          var hash = {};
          
          // DON'T move it in the one-line hash variable definition,
          // it causes problems with the Konqueror 3 later on
          hash.e = event;
          hash.f = callback;
          hash.a = args;
          hash.r = name;
          
          this.$listeners.push(hash);
          break;

        default:
          if (isArray(callback)) {
            for (var i=0; i < callback.length; i++) {
              this.on.apply(this, [event].concat(
                isArray(callback[i]) ? callback[i] : [callback[i]]
              ).concat(args));
            }
          }
      }
      
    } else {
      // assuming it's a hash of key-value pairs
      for (var name in event) {
        this.on.apply(this, [name].concat(
          isArray(event[name]) ? event[name] : [event[name]]
        ).concat(args));
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
   * @retun boolean check result
   */
  observes: function(event, callback) {
    if (!isString(event)) { callback = event; event = null; }
    if (isString(callback)) callback = this[callback];
    
    return (this.$listeners || []).some(function(i) {
      return (event && callback) ? i.e === event && i.f === callback :
        event ? i.e === event : i.f === callback;
    });
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
    if (isHash(event)) {
      for (var key in event) {
        this.stopObserving(key, event[key]);
      }
    } else {
      if (!isString(event)) { callback = event; event = null; }
      if (isString(callback)) callback = this[callback];
      
      this.$listeners = (this.$listeners || []).filter(function(i) {
        return (event && callback) ? (i.e !== event || i.f !== callback) :
          (event ? i.e !== event : i.f !== callback);
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
      return !event || i.e === event;
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
      if (i.e === event) i.f.apply(this, i.a.concat(args));
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
      return this.createShortcuts(object, events || Class.findSet(object, 'events'));
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
        var method_name = 'on'+name.replace(/:/g, '_').camelize().capitalize();
        if (!defined(object[method_name])) {
          object[method_name] = function() {
            return this.on.apply(this, [name].concat($A(arguments)));
          };
        }
      });
      
      return object;
    }
  }
});

$alias(Observer.prototype, { observe: 'on' });

/**
 * iterators in-callbacks break exception
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
Break = new Class(Error, {
  message: "Manual iterator break"
});

/**
 * this object will contain info about the current browser
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Browser = (function(agent) {
  return   {
    IE:           !!(window.attachEvent && !window.opera),
    Opera:        !!window.opera,
    WebKit:       agent.indexOf('AppleWebKit/') > -1,
    Gecko:        agent.indexOf('Gecko') > -1 && agent.indexOf('KHTML') < 0,
    MobileSafari: !!agent.match(/Apple.*Mobile.*Safari/),
    Konqueror:    agent.indexOf('Konqueror') > -1,

    // marker for the browsers which don't give access to the HTMLElement unit
    OLD:          !!(window.attachEvent && !window.opera) && !document.querySelector
  }
})(navigator.userAgent);

/**
 * represents some additional functionality for the Event class
 *
 * NOTE: there more additional functionality for the Event class in the rightjs-goods project
 *
 * Credits:
 *   The additional method names are inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Event = new Class(window.Event, {
  extend: {
    /**
     * extends a native object with additional functionality
     *
     * @param Event event
     * @param Element bounding element
     * @return Event same event but extended
     */
    ext: function(event, bound_element) {
      if (!event.stop) {
        $ext(event, this.Methods, true);
      }
      
      if (!event.target && event.srcElement) {
        // faking the which button
        event.which = event.button == 2 ? 3 : event.button == 4 ? 2 : 1;
        
        // faking the mouse position
        var scrolls = window.scrolls();

        event.pageX = event.clientX + scrolls.x;
        event.pageY = event.clientY + scrolls.y;
        
        // faking the target property  
        event.target = $(event.srcElement) || bound_element;
        
        // faking the relatedTarget, currentTarget and other targets
        event.relatedTarget = event.target === event.fromElement ? $(event.toElement) : event.target;
        event.currentTarget = bound_element;
        event.eventPhase    = 3; // bubbling phase
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
      name = name.substr(0,2) === 'on' ? name.slice(2) : name;
      name = name === 'rightclick'  ? 'contextmenu' : name;
      return name;
    },
    
    /**
     * returns a real, browser specific event name 
     *
     * @param String clean unified name
     * @return String real name
     */
    realName: function(name) {
      if (Browser.Gecko     && name === 'mousewheel')  name = 'DOMMouseScroll';
      if (Browser.Konqueror && name === 'contextmenu') name = 'rightclick';
      return name;
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


/**
 * Registers some additional event extendsions
 *
 * @param Object methods
 * @return void
 */
Event.include = function(methods) {
  $ext(this.Methods, methods);
  
  try { // extending the events prototype
    $ext(Event.parent.prototype, methods, true);
  } catch(e) {};
};

// hooking up the standard extendsions
Event.include({
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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Event.Custom = function(name, options) {
  this.type = name;
  this.stop = function() {};
  $ext(this, options || {});
};

/**
 * This module contains the basic events-delegation feature support
 *
 * Copyright (C) 2010 Nikolay V. Nemshilov
 */
Event.extend({
  /**
   * Creates an event delegation handler
   *
   * USAGE:
   *
   *   var delegation = Event.delegate({
   *     "css_rule_1": function() { do_something_usual(); },
   *     "css_rule_2": function() { do_something_another(); },
   *     
   *     // us also can use references by name with or without options
   *     "css_rule_3": ['addClass', 'that-class'],
   *     "css_rule_4": 'hide'
   *   });
   *
   *   $(element).on('click', delegation);
   *
   * NOTE:
   *   your delegation handler will be called in contexts of matching _targets_
   *   not in the context of the element where it was attached
   *
   * @param Object delegation rules
   * @return Function delegation handler
   */
  delegate: function(options) {
    return function(event) {
      var target = event.target, css_rule, args, callback;

      for (css_rule in options) {
        if ($(this).select(css_rule).include(target)) {
          args = options[css_rule];
          args = isArray(args) ? args : [args];
          callback = args[0];
          args = args.slice(1);

          if (isString(callback))
            target[callback].apply(target, args);
          else
            callback.apply(target, [event].concat(args));
        }
      }
    };
  },
  
  /**
   * Creates a document-level events delegations catcher
   *
   * USAGE:
   *   Event.behave("ul#main-menu li", "click", function() { alert('clicked'); });
   *   Event.behave("ul#main-menu li", "mouseover", "addClass", "hovered");
   *   Event.behave("ul#main-menu li", {
   *     click:     function() { alert('clicked'); },
   *     mouseover: ['addClass',    'hovered'],
   *     mouseout:  ['removeClass', 'hovered'],
   *     dblclick:  'hide'
   *   });
   *
   * @param String css-rule
   * @param mixed String event name or a Hash of events
   * @param mixed Function callback or String method name
   * @param mixed optional curried arguments
   * @return Object with event handlers description the document.on() function will receive
   */
  behave: function(css_rule, options) {
    var events = {}, hash = {}, args = $A(arguments).slice(1),
      focus = 'focus', blur = 'blur', focus_blur = [focus, blur];
    
    if (isString(options)) {
      hash[args.shift()] = args;
      options = hash;
    }
    
    for (var event in options) {
      var hash = {}; hash[css_rule] = options[event];
      
      if (Browser.IE) {
        // fancy IE browsers have different names for bubbling versions of those events
        if (event == focus) event = focus + 'in';
        if (event == blur)  event = focus + 'out';
      }
      
      events[event] = Event.delegate(hash);
      
      if (focus_blur.include(event) && !Browser.IE) {
        // HACK! HACK! HACK!
        // by default, method #on uses a non-captive events attachment
        // but for focus and blur effects we need the opposite
        // so we calling the method directly and pushing the listeners manually
        
        document.addEventListener(event, events[event], true);
        
        (document.$listeners = document.$listeners || []).push({
          e: event, f: events[event], a: []
        });
        
      } else {
        document.on(event, events[event]);
      }
    }
    
    return events;
  }
});


String.include({
  /**
   * A shortcut for document-level events delegation handler attaching
   *
   * USAGE:
   *
   *   "ul#main-menu li".on("click", function() { alert('clicked'); });
   *   "ul#main-menu li".on("mouseover", "addClass", "hovered");
   *   "ul#main-menu li".on("mouseout", "removeClass", "hovered");
   *
   *   // or like that in a shash
   *   "ul#main-menu li".on({
   *     click:     function() { alert('clicked'); },
   *     mouseover: ['addClass',    'hovered'],
   *     mouseout:  ['removeClass', 'hovered'],
   *     dblclick:  'hide'
   *   });
   *
   * ...
   * @return String this
   */
  on: function() {
    Event.behave.apply(Event, [''+this].concat($A(arguments)));
    return this;
  }
});

$alias(String.prototype, {behave: 'on'});


/**
 * The DOM Element unit handling
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Element = (function(old_Element) {
  
  // Element constructor options mapper
  var options_map = {
    id:      ['id',        0],
    html:    ['innerHTML', 0],
    'class': ['className', 0],
    style:   ['setStyle',  1],
    observe: ['on',        1],
    on:      ['on',        1]
  };
  
  function new_Element(tag, options) {
    var element = document.createElement(tag);
    
    if (options) {
      for (var key in options) {
        if (options_map[key]) {
          if (options_map[key][1]) element[options_map[key][0]](options[key]);
          else element[options_map[key][0]] = options[key];
        } else {
          element.set(key, options[key]);
        }
      }
    }
    
    return element;
  };
  
  
  if (Browser.IE) {
    //
    // IE browsers have a bug with checked input elements
    // and we kinda hacking the Element constructor so that
    // it affected IE browsers only
    //
    new_Element = eval('['+new_Element.toString().replace(/(\((\w+),\s*(\w+)\)\s*\{)/,
      '$1if($2==="input"&&$3)$2="<input name="+$3.name+" type="+$3.type+($3.checked?" checked":"")+"/>";'
    )+']')[0];
  }
  
  // connecting the old Element instance to the new one for IE browsers
  if (old_Element) {
    $ext(new_Element, old_Element);
    new_Element.parent = old_Element;
  }
  
  return new_Element;
})(window.Element);


$ext(Element, {
  /**
   * registeres the methods on the custom element methods list
   * will add them to prototype and register at the Element.Methods hash
   * 
   * USAGE:
   *  Element.include({
   *    foo: function(bar) {}
   *  });
   *
   *  $(element).foo(bar);
   *
   * @param Object new methods list
   * @param Boolean flag if the method should keep the existing methods alive
   * @return Element the global Element object
   */
  include: function(methods, dont_overwrite) {
    $ext(this.Methods, methods, dont_overwrite);
    
    try { // busting up the basic element prototypes
      $ext((window.HTMLElement || this.parent).prototype, methods, dont_overwrite);
    } catch(e) {}
    
    return this;
  },
  
  Methods: {} // DO NOT Extend this object manually unless you really need it, use Element#include
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
 * Credits:
 *   The naming principle and most of the names are taken from
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *   The insertions system implementation is inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Element.include({
  parent: function(css_rule) {
    return css_rule ? this.parents(css_rule)[0] : $(this.parentNode);
  },
  
  parents: function(css_rule) {
    return this.rCollect('parentNode', css_rule);
  },
  
  subNodes: function(css_rule) {
    return this.select(css_rule).filter(function(element) {
      return element.parentNode === this;
    }, this);
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
    return this.nextSiblings(css_rule)[0];
  },
  
  prev: function(css_rule) {
    return this.prevSiblings(css_rule)[0];
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
      var scripts, insertions = Element.insertions;
      position = isString(position) ? position.toLowerCase() : 'bottom';
      
      if (isString(content) || isNumber(content)) {
        content = (''+content).stripScripts(function(s) { scripts = s; });
      }
      
      insertions[position](this, content.tagName ? content :
        insertions.createFragment.call(
          (position === 'bottom' || position === 'top' || !this.parentNode) ?
            this : this.parentNode, content
        )
      );
      if (scripts) $eval(scripts);
    }
    return this;
  },
  
  /**
   * Inserts the element inside the given one at the given position
   *
   * @param mixed destination element reference
   * @param String optional position
   * @return Element this
   */
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
    if ((isString(content) || isNumber(content)) && !Element.insertions.wraps[this.tagName]) {
      var scripts;
      this.innerHTML = (''+content).stripScripts(function(s) { scripts = s; });
      if (scripts) $eval(scripts);
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
    var node = this, result = [];

    while ((node = node[attr])) {
      if (node.tagName && (!css_rule || $(node).match(css_rule))) {
        result.push(node);
      }
    }
    
    return result;
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
    var parent = target.parentNode, sibling = target.nextSibling;
    if (parent) {
      sibling ? parent.insertBefore(content, sibling) : parent.appendChild(content);
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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Element.include({
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
    var key, c_key, style = {};
    
    if (value) { style[hash] = value; hash = style; }
    else if(isString(hash)) {
      hash.split(';').each(function(option) {
        var els = option.split(':').map('trim');
        if (els[0] && els[1]) {
          style[els[0]] = els[1];
        }
      });
      hash = style;
    }
    
    
    for (key in hash) {
      c_key = key.indexOf('-') != -1 ? key.camelize() : key;
      
      if (key === 'opacity') {
        if (Browser.IE) {
          this.style.filter = 'alpha(opacity='+ hash[key] * 100 +')';
        } else {
          this.style.opacity = hash[key];
        }
      } else if (key === 'float') {
        c_key = Browser.IE ? 'styleFloat' : 'cssFloat';
      }
      
      this.style[c_key] = hash[key];
    }
    
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
          ((/opacity=(\d+)/i.exec(style.filter || '') || ['', '100'])[1].toInt() / 100)+'';
        break;
        
      case 'float':
        key = Browser.IE ? 'styleFloat' : 'cssFloat';
        
      default:
        value = style[key];
        
        // Opera returns named colors with quotes
        if (Browser.Opera && /color/i.test(key) && value) {
          value = value.replace(/"/g, '');
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
    var testee = ' '+this.className+' ';
    if (testee.indexOf(' '+name+' ') == -1) {
      this.className += (testee === '  ' ? '' : ' ') + name;
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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Element.include({
  /**
   * sets the element attributes
   *
   * @param String attr name or Object attributes hash
   * @param mixed attribute value
   * @return Element self
   */
  set: function(hash, value) {
    if (typeof(hash) === 'string') { var val = {}; val[hash] = value; hash = val; }
    
    for (var key in hash) {
      // some attributes are not available as properties
      if (typeof(this[key]) === 'undefined') {
        this.setAttribute(key, ''+hash[key]);
      }
      this[key] = hash[key];
    }
      
    return this;
  },
  
  /**
   * returns the attribute value for the name
   *
   * @param String attr name
   * @return mixed value
   */
  get: function(name) {
    var value = this[name] || this.getAttribute(name);
    return value === '' ? null : value;
  },
  
  /**
   * checks if the element has that attribute
   *
   * @param String attr name
   * @return Boolean check result
   */
  has: function(name) {
    return this.get(name) !== null;
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
    if (this.getStyle('display') == 'none') {
      // setting 'block' for the divs and 'inline' for the other elements hidden on the css-level
      var value = this.tagName == 'DIV' ? 'block' : 'inline';
      this.style.display = this._$pd == 'none' ? value : this._$pd || value;
    }
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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Element.include({
  /**
   * Returns the element sizes as a hash
   *
   * @return Object {x: NNN, y: NNN}
   */
  sizes: function() {
    return { x: this.offsetWidth, y: this.offsetHeight };
  },
  
  /**
   * Returns the element absolute position
   *
   * NOTE: see the konq.js file for the manual version of the method
   *
   * @return Object {x: NNN, y: NNN}
   */
  position: function() {
    var rect = this.getBoundingClientRect(), doc = this.ownerDocument.documentElement, scrolls = window.scrolls();
    
    return {
      x: rect.left + scrolls.x - doc.clientLeft,
      y: rect.top  + scrolls.y - doc.clientTop
    };
  },
  
  /**
   * Returns the element scrolls
   *
   * @return Object {x: NNN, y: NNN}
   */
  scrolls: function() {
    return { x: this.scrollLeft, y: this.scrollTop };
  },
  
  /**
   * returns the element dimensions hash
   *
   * @return Object dimensions (top, left, width, height, scrollLeft, scrollTop)
   */
  dimensions: function() {
    var sizes    = this.sizes();
    var scrolls  = this.scrolls();
    var position = this.position();
    
    return {
      top:        position.y,
      left:       position.x,
      width:      sizes.x,
      height:     sizes.y,
      scrollLeft: scrolls.x,
      scrollTop:  scrolls.y
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
    var style = this.style, property = 'offsetWidth';
    style.width = width_px + 'px';
    style.width = (2 * width_px - this[property]) + 'px';
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
    var style = this.style, property = 'offsetHeight';
    style.height = height_px + 'px';
    style.height = (2 * height_px - this[property]) + 'px';
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
    return this.setWidth(width).setHeight(height);
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
   * @param Object fx options
   * @return Element self
   */
  scrollThere: function(options) {
    window.scrollTo(this, options);
    return this;
  }
});

/**
 * DOM Element events handling methods
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Element.include((function() {
  var observer = Observer.create({}, 
    $w('click rightclick contextmenu mousedown mouseup mouseover mouseout mousemove keypress keydown keyup')
  );
  
  //
  // HACK HACK HACK
  //
  // I'm kinda patching the observer methods manually in here
  // the reason is in building flat and fast functions
  //
  function hack(name, re, text) {
    observer[name] = eval('['+ observer[name].toString().replace(re, text) +']')[0];
  };
  
  hack('on', 
    /(\$listeners\.push\((\w+?)\);)/,
    
    '$1$2.e=Event.cleanName($2.e);$2.n=Event.realName($2.e);$2.w=function(){var a=$A(arguments),e=($2.r&&$2.r!=="stopEvent")?a.shift():Event.ext(a[0],this);return $2.f.apply(this,a.concat($2.a))};' + (
        window.attachEvent ?
          '$2.w=$2.w.bind(this);this.attachEvent("on"+$2.n,$2.w);' :
          'this.addEventListener($2.n,$2.w,false);'
        )
  );
  observer.observe = observer.on;
  
  hack('stopObserving',
    /(function\s*\((\w+)\)\s*\{\s*)(return\s*)([^}]+)/m, 
    '$1var r=$4;if(!r)' + (window.attachEvent ? 
      'this.detachEvent("on"+$2.n,$2.w);' :
      'this.removeEventListener($2.n,$2.w,false);'
    )+'$3 r'
  );
  
  hack('fire',
    /(\w+)\.f\.apply.*?\.concat\((\w+)\)\)/,
    '$1.f.apply(this,(($1.r&&$1.r!=="stopEvent")?[]:[new Event($1.e,$2.shift())]).concat($1.a).concat($2))'
  );
  
  // a simple events terminator method to be hooked like this.onClick('stopEvent');
  observer.stopEvent = function(e) { e.stop(); };
  
  $ext(window,   observer);
  $ext(document, observer);
  
  Observer.createShortcuts(window, $w('blur focus scroll'));
  
  return observer;
})());


/**
 * The DOM elements selection handling
 *
 * NOTE: this module is just a wrap over the native CSS-selectors feature
 *       see the olds/css.js file for the manual selector code
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Element.include((function() {
  /**
   * Native css-selectors include the current element into the search context
   * and as we actually search only inside of the element we add it's tag
   * as a scope for the search
   */
  function stub_rule(css_rule, tag) {
    return css_rule ? css_rule.replace(/(^|,)/g, '$1'+ tag + ' ') : '*';
  };
  
return {
  /**
   * Extracts the first element matching the css-rule,
   * or just any first element if no css-rule was specified
   *
   * @param String css-rule
   * @return Element matching node or null
   */
  first: function(css_rule) {
    return this.querySelector(stub_rule(css_rule, this.tagName));
  },
  
  /**
   * Selects a list of matching nodes, or all the descendant nodes if no css-rule provided
   *
   * @param String css-rule
   * @return Array of elements
   */
  select: function(css_rule) {
    return $A(this.querySelectorAll(stub_rule(css_rule, this.tagName)));
  },
  
  /**
   * checks if the element matches this css-rule
   *
   * NOTE: the element should be attached to the page
   *
   * @param String css-rule
   * @return Boolean check result
   */
  match: function(css_rule) {
    var result, parent = this.tagName === 'HTML' ? this.ownerDocument : this.parents().last();
    
    // if it's a single node putting it into the context
    result = $(parent || $E('p').insert(this)).select(css_rule).include(this);
    
    if (!parent) this.remove();
    
    return result;
  }
}})());

// document-level hooks
$ext(document, {
  first: function(css_rule) {
    return this.querySelector(css_rule);
  },
  
  select: function(css_rule) {
    return $A(this.querySelectorAll(css_rule));
  }
});


/**
 * the window object extensions
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
$ext(window, (function() {
  var native_scroll = window.scrollTo;
  
return {
    /**
     * returns the inner-sizes of the window
     *
     * @return Object x: d+, y: d+
     */
    sizes: function() {
      var doc_e = document.documentElement;
      return this.innerWidth ? {x: this.innerWidth, y: this.innerHeight} :
        {x: doc_e.clientWidth, y: doc_e.clientHeight};
    },

    /**
     * returns the scrolls for the window
     *
     * @return Object x: d+, y: d+
     */
    scrolls: function() {
      var body = this.document.body, doc_e = this.document.documentElement,
        off_x = 'pageXOffset', off_y = 'pageYOffset',
        scr_x = 'scrollLeft',  scr_y = 'scrollTop';
      
      return (this[off_x] || this[off_y]) ? {x: this[off_x], y: this[off_y]} :
        (body[scr_x] || body[scr_y]) ? {x: body[scr_x], y: body[scr_y]} :
        {x: doc_e[scr_x], y: doc_e[scr_y]};
    },

    /**
     * overloading the native scrollTo method to support hashes and element references
     *
     * @param mixed number left position, a hash position, element or a string element id
     * @param number top position
     * @param Object fx options
     * @return window self
     */
    scrollTo: function(left, top, fx_options) {
      var left_pos = left, top_pos = top; // moving the values into new vars so they didn't get screwed later on
      
      if(isElement(left) || (isString(left) && $(left))) {
        left = $(left).position();
      }

      if (isHash(left)) {
        top_pos  = left.y;
        left_pos = left.x;
      }
      
      // checking if a smooth scroll was requested
      if (isHash(fx_options = fx_options || top) && window.Fx) {
        new Fx.Scroll(this, fx_options).start({x: left_pos, y: top_pos});
      } else {
        native_scroll(left_pos, top_pos);
      }

      return this;
    }
};

})());

/**
 * The dom-ready event handling code
 *
 * Credits:
 *   The basic principles of the module are originated from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
[window, document].each(function(object) {
  Observer.createShortcuts(object, ['ready']);
  var ready = object.fire.bind(object, 'ready');
  
  // IE and Konqueror browsers
  if (typeof(document.readyState) !== 'undefined') {
    (function() {
      ['loaded','complete'].includes(document.readyState) ? ready() : arguments.callee.delay(50);
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
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
function Form(options) {
  var options = options || {}, remote = options.remote,
    form = new Element('form', Object.without(options, 'remote'));
  
  if (remote) form.remotize();
  
  return form;
};

$ext(Form, {
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
  include: function(methods, dont_overwrite) {
    $ext(Form.Methods, methods, dont_overwrite);
    
    try { // trying to extend the form element prototype
      $ext(HTMLFormElement.prototype, methods, dont_overwrite);
    } catch(e) {}
  }
});

Form.include({
  /**
   * returns the form elements as an array of extended units
   *
   * @return Array of elements
   */
  getElements: function() {
    return $A(this.elements).map($);
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
Form.include(Observer.createShortcuts({}, $w('submit reset focus')), true);



/**
 * there is the form-elements additional methods container
 *
 * Credits:
 *   The basic ideas are taken from
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
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
    include: function(methods, dont_overwrite) {
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

Form.Element.include({
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
      value = $A(isArray(value) ? value : [value]).map(String);
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
Form.Element.include(Observer.createShortcuts({}, $w('disable enable focus blur change')), true);


/**
 * this module handles the work with cookies
 *
 * Credits:
 *   Most things in the unit are take from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Cookie = new Class({
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
    var value = encodeURIComponent(value), options = this.options;
    if (options.domain) value += '; domain=' + options.domain;
    if (options.path) value += '; path=' + options.path;
    if (options.duration){
      var date = new Date();
      date.setTime(date.getTime() + options.duration * 24 * 60 * 60 * 1000);
      value += '; expires=' + date.toGMTString();
    }
    if (options.secure) value += '; secure';
    options.document.cookie = this.name + '=' + value;
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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Xhr = new Class(Observer, {
  extend: {
    // supported events list
    EVENTS: $w('success failure complete request cancel create'),
    
    // default options
    Options: {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'text/javascript,text/html,application/xml,text/xml,*/*'
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
      params:       null,
      iframed:      false
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
    var add_params = {}, url = this.url, method = this.method.toLowerCase(), key;
    
    if (method == 'put' || method == 'delete') {
      add_params['_method'] = method;
      method = 'post';
    }
    
    var data = this.prepareData(this.params, this.prepareParams(params), add_params);
    
    if (this.urlEncoded && method == 'post' && !this.headers['Content-type']) {
      this.setHeader('Content-type', 'application/x-www-form-urlencoded;charset='+this.encoding);
    }
    
    if (method == 'get') {
      if (data) url += (url.includes('?') ? '&' : '?') + data;
      data = null;
    }
    
    this.xhr = this.createXhr();
    this.fire('create');
    
    this.xhr.open(method, url, this.async);
    
    this.xhr.onreadystatechange = this.stateChanged.bind(this);
    
    for (key in this.headers) {
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
    try {
      return JSON.parse(this.text);
    } catch(e) {
      // manual json consistancy check
      if (window.JSON || !(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(this.text.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) {
        if (this.secureJSON) {
          throw "JSON parse error: "+this.text;
        } else {
          return null;
        }
      }
    }
    
    // the fallback JSON extraction
    return eval("("+this.text+")");
  },
  
  // initializes the request callbacks
  initCallbacks: function() {
    // connecting basic callbacks
    this.on({
      success:  'tryScripts',
      create:   'showSpinner',
      complete: 'hideSpinner',
      cancel:   'hideSpinner'
    });
    
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

Xhr.onCreate(function() {
  this.counter++;
  this.showSpinner();
}).onComplete(function() {
  this.counter--;
  if (this.counter < 1) this.hideSpinner();
}).onCancel(function() {
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
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
Form.include({
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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Element.include({
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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
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
    
    try {
      this.responseText = window[this.iframe.id].document.documentElement.innerHTML;
    } catch(e) { }
    
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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Fx = new Class(Observer, {
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
    },
    
    ch: [], // scheduled effects registries
    cr: []  // currently running effects registries
  },
  
  /**
   * Basic constructor
   *
   * @param Object options
   */
  initialize: function(element, options) {
    this.$super(options);
    
    if (this.element = element = $(element)) {
      var uid = $uid(element);
      this.ch = (Fx.ch[uid] = Fx.ch[uid] || []);
      this.cr = (Fx.cr[uid] = Fx.cr[uid] || []);
    }
  },
  
  /**
   * starts the transition
   *
   * @return Fx this
   */
  start: function() {
    if (this.queue(arguments)) return this;
    this.prepare.apply(this, arguments);
    
    var options = this.options,
        duration  = Fx.Durations[options.duration] || options.duration;
    this.transition = Fx.Transitions[options.transition] || options.transition;
    
    this.steps  = (duration / 1000 * this.options.fps).ceil();
    this.number = 1;
    
    if (this.cr) this.cr.push(this); // adding this effect to the list of currently active
    
    return this.fire('start', this).startTimer();
  },
  
  /**
   * finishes the transition
   *
   * @return Fx this
   */
  finish: function() {
    return this.stopTimer().unreg().fire('finish').next();
  },
  
  /**
   * interrupts the transition
   *
   * NOTE:
   *   this method cancels all the scheduled effects
   *   in the element chain
   *
   * @return Fx this
   */
  cancel: function() {
    this.ch.clean();
    return this.stopTimer().unreg().fire('cancel');
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
  prepare: function(values) {},

  // dummy method, processes the element properties
  render: function(delta) {},
  
  // the periodically called method
  // NOTE: called outside of the instance scope!
  step: function(that) {
    if (that.number > that.steps) that.finish();
    else {
      if (!that.w) {
        that.w = true;
        that.render(that.transition(that.number / that.steps));
        that.w = false;
      }
      that.number ++;
    }
  },
  
  // starts the effect timer
  startTimer: function() {
    this.timer = this.step.periodical((1000 / this.options.fps).round(), this);
    return this;
  },
  
  // stops the effect timer
  stopTimer: function() {
    if (this.timer) {
      this.timer.stop();
    }
    return this;
  },

  // handles effects queing
  // should return false if there's no queue and true if there is a queue
  queue: function(args) {
    var chain = this.ch, queue = this.options.queue;
    
    if (!chain || this.$ch)
      return this.$ch = false;

    if (queue)
      chain.push([args, this]);
    
    return queue && chain[0][1] !== this;
  },
  
  // calls for the next effect in the queue
  next: function() {
    var chain = this.ch, next = chain.shift(), next = chain[0];
    if (next) {
      next[1].$ch = true;
      next[1].start.apply(next[1], next[0]);
    }
    return this;
  },
  
  // unregisters this effect out of the currently running list
  unreg: function() {
    var currents = this.cr;
    if (currents) currents.splice(currents.indexOf(this), 1);
    return this;
  }
  
});

/**
 * There are the String unit extensions for the effects library
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov
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

String.include({
  /**
   * converts a #XXX or rgb(X, X, X) sring into standard #XXXXXX color string
   *
   * @return String hex color
   */
  toHex: function() {
    var match = /^#(\w)(\w)(\w)$/.exec(this);
    
    if (match) {
      match = "#"+ match[1]+match[1]+match[2]+match[2]+match[3]+match[3];
    } else if (match = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(this)) {
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
    var match = /#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(this.toHex()||'');
    
    if (match) {
      match = match.slice(1).map('toInt', 16);
      match = array ? match : 'rgb('+match+')';
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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Fx.Morph = new Class(Fx, (function() {
  // a list of common style names to compact the code a bit
  var Color = 'Color', Style = 'Style', Width = 'Width', Bg = 'background',
      Border = 'border', Pos = 'Position', BgColor = Bg + Color,
      directions = $w('Top Left Right Bottom');
  
  
  // adds variants to the style names list
  function add_variants(keys, key, variants) {
    for (var i=0; i < variants.length; i++)
      keys.push(key + variants[i]);
  };
  
  // adjusts the border-styles
  function check_border_styles(before, after) {
    for (var i=0; i < 4; i++) {
      var direction = directions[i],
        bd_style = Border + direction + Style,
        bd_width = Border + direction + Width,
        bd_color = Border + direction + Color;
      
      if (before[bd_style] != after[bd_style]) {
        var style = this.element.style;

        if (before[bd_style] == 'none') {
          style[bd_width] = '0px';
        }

        style[bd_style] = after[bd_style];
        if (this._transp(before[bd_color])) {
          style[bd_color] = this.element.getStyle(Color);
        }
      }
    }
  };
  
  // parses the style hash into a processable format
  function parse_style(values) {
    var result = {}, re = /[\d\.\-]+/g, m, key, value, i;
    
    for (key in values) {
      m = values[key].match(re);
      value = m.map('toFloat');
      value.t = values[key].split(re);
      value.r = value.t[0] === 'rgb(';

      if (value.t.length == 1) value.t.unshift('');
      
      for (i=0; i < value.length; i++) {
        value.t.splice(i*2 + 1, 0, value[i]);
      }
      result[key] = value;
    }
    
    return result;
  };
  
return {

// protected  

  // parepares the effect
  prepare: function(style) {
    var keys   = this._styleKeys(style),
        before = this._cloneStyle(this.element, keys),
        after  = this._endStyle(style, keys);
    
    this._cleanStyles(before, after);
    
    this.before = parse_style(before);
    this.after  = parse_style(after);
  },
  
  render: function(delta) {
    var before, after, value, style = this.element.style, key, i;
    for (key in this.after) {
      before = this.before[key];
      after  = this.after[key];
      
      for (i=0; i < after.length; i++) {
        value = before[i] + (after[i] - before[i]) * delta;
        if (after.r) value = Math.round(value);
        after.t[i*2 + 1] = value;
      }
      
      style[key] = after.t.join('');
    }
  },
  
  /**
   * Returns a hash of the end style
   *
   * @param Object style
   * @return Object end style
   */
  _endStyle: function(style, keys) {
    var dummy  = $(this.element.cloneNode(true))
        .setStyle('position:absolute;z-index:-1;visibility:hidden')
        .insertTo(this.element, 'before')
        .setWidth(this.element.sizes().x)
        .setStyle(style),
    
    after  = this._cloneStyle(dummy, keys);
    
    dummy.remove();
    
    return after;
  },
  
  /**
   * Fast styles cloning
   *
   * @param Element element
   * @param Array style keys
   * @return Hash of styles
   */
  _cloneStyle: function(element, keys) {
    for (var i=0, len = keys.length, style = element.computedStyles(), clean = {}; i < len; i++)
      clean[keys[i]] = style[keys[i]];
    
    return clean;
  },
  
  /**
   * creates an appropriate style-keys list out of the user styles
   *
   * @param Object the style hash
   * @return Array of clean style keys list
   */
  _styleKeys: function(style) {
    var keys = [], border_types = [Style, Color, Width], key, i, j;
      
    for (key in style) {
      if (key.startsWith(Border))
        for (i=0; i < border_types.length; i++)
          for (j=0; j < directions.length; j++)
            keys.push(Border + directions[j] + border_types[i]);
      else if (key == 'margin' || key == 'padding')
        add_variants(keys, key, directions);
      else if (key.startsWith(Bg))
        add_variants(keys, Bg, [Color, Pos, Pos+'X', Pos+'Y']);
      else if (key == 'opacity' && Browser.IE)
        keys.push('filter');
      else
        keys.push(key);
    }
    
    return keys;
  },
  
  /**
   * cleans up and optimizies the styles
   *
   * @param Object before
   * @param Object after
   * @return void
   */
  _cleanStyles: function(before, after) {
    var remove = [], key;
    
    for (key in after) {
      // checking the height/width options
      if ((key == 'width' || key == 'height') && before[key] == 'auto') {
        before[key] = this.element['offset'+key.capitalize()] + 'px';
      }
    }
    
    // IE opacity filter fix
    if (after.filter && !before.filter) before.filter = 'alpha(opacity=100)';
    
    // adjusting the border style
    check_border_styles.call(this, before, after);
    
    // cleaing up the list
    for (key in after) {
      // proprocessing colors
      if (after[key] !== before[key] && !remove.includes(key) && /color/i.test(key)) {
        if (Browser.Opera) {
          after[key] = after[key].replace(/"/g, '');
          before[key] = before[key].replace(/"/g, '');
        }

        if (!this._transp(after[key]))  after[key]  = after[key].toRgb();
        if (!this._transp(before[key])) before[key] = before[key].toRgb();

        if (!after[key] || !before[key]) after[key] = before[key] = '';
      }
      
      // filling up the missing sizes
      if (/\d/.test(after[key]) && !/\d/.test(before[key])) before[key] = after[key].replace(/[\d\.\-]+/g, '0');
      
      // removing unprocessable keys
      if (after[key] === before[key] || remove.includes(key) || !/\d/.test(before[key]) || !/\d/.test(after[key])) {
        delete(after[key]);
        delete(before[key]);
      }
    }
  },
  
  // looking for the visible background color of the element
  _getBGColor: function(element) {
    return [element].concat(element.parents()).map(function(node) {
      var bg = node.getStyle(BgColor);
      return (bg && !this._transp(bg)) ? bg : null; 
    }, this).compact().first() || '#FFF';
  },
  
  
  // checks if the color is transparent
  _transp: function(color) {
    return color === 'transparent' || color === 'rgba(0, 0, 0, 0)';
  }
  
}})());



/**
 * the elements hightlighting effect
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
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
    
    var element = this.element;
    element.show();
    this.sizes = element.sizes();
    
    this.styles = {};
    $w('overflow height width marginTop marginLeft').each(function(key) {
      this.styles[key] = element.style[key];
    }, this);

    element.style.overflow = 'hidden';
    this.onFinish('_getBack').onCancel('_getBack');

    return this.$super(this._getStyle(this.options.direction));
  },

  _getBack: function() {
    this.element.setStyle(this.styles);
  },

  // calculates the final style
  _getStyle: function(direction) {
    var style = {}, sizes = this.sizes,
      m_left = 'marginLeft', m_top = 'marginTop',
      margin_left = this.styles[m_left].toFloat() || 0,
      margin_top  = this.styles[m_top].toFloat() || 0;

    if (this.how == 'out') {
      style[['top', 'bottom'].includes(direction) ? 'height' : 'width'] = '0px';

      if (direction == 'right') {
        style[m_left] = margin_left + sizes.x+'px';
      } else if (direction == 'bottom') {
        style[m_top] = margin_top + sizes.y +'px';
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
        style[m_left] = margin_left + 'px';
        element_style[m_left] = margin_left + sizes.x + 'px';
      } else if (direction == 'bottom') {
        style[m_top] = margin_top + 'px';
        element_style[m_top] = margin_top + sizes.y + 'px';
      }
    }
    
    return style;
  }

});

/**
 * The opacity effects wrapper
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Fx.Fade = new Class(Fx.Twin, {
  prepare: function(how) {
    this.setHow(how);
    
    if (this.how == 'in')
      this.element.setStyle({opacity: 0}).show();
    
    return this.$super({opacity: isNumber(how) ? how : this.how == 'in' ? 1 : 0});
  }
});

/**
 * A smooth scrolling visual effect
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
Fx.Scroll = new Class(Fx, {
  
  initialize: function(element, options) {
    // swapping the actual scrollable when it's the window
    this.$super(element.prompt ? element.document[Browser.WebKit ? 'body' : 'documentElement'] : element, options);
  },
  
  prepare: function(value) {
    this.before = {};
    this.after  = value;
    
    if (defined(value.x)) this.before.x = this.element.scrollLeft;
    if (defined(value.y)) this.before.y = this.element.scrollTop;
  },
  
  render: function(delta) {
    var before = this.before, key;
    for (key in before) {
      this.element['scroll' + (key == 'x' ? 'Left' : 'Top')] = before[key] + (this.after[key] - before[key]) * delta;
    }
  }
});

/**
 * This block contains additional Element shortcuts for effects easy handling
 *
 * Credits:
 *   Some ideas are inspired by 
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Element.include((function(methods) {
  var old_hide   = methods.hide,
      old_show   = methods.show,
      old_scroll = methods.scrollTo;

return {
  /**
   * Stops all the visual effects on the element
   *
   * @return Element this
   */
  stop: function() {
    (Fx.cr[$uid(this)] || []).each('cancel');
    return this;
  },

  /**
   * hides the element with given visual effect
   *
   * @param String fx name
   * @param Object fx options
   * @return Element this
   */
  hide: function(fx, options) {
    return fx ? this.fx(fx, ['out', options]) : old_hide.call(this);
  },
  
  /**
   * shows the element with the given visual effect
   *
   * @param String fx name
   * @param Object fx options
   * @return Element this
   */
  show: function(fx, options) {
    return fx ? this.fx(fx, ['in', options]) : old_show.call(this);
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
  
  /**
   * Starts the smooth scrolling effect
   *
   * @param Object {x: NNN, y: NNN} where to scroll
   * @param Object fx-options
   * @return Element this
   */
  scroll: function(value, options) {
    return this.fx('scroll', [value, options||{}]);
  },
  
  /**
   * wraps the old scroll to be able to run it with fxes
   *
   * If you send two hashes then will start a smooth scrolling
   * otherwise will just jump over with the usual method
   * 
   * @return Element this
   */
  scrollTo: function(value, options) {
    return isHash(options) ? this.scroll(value, options) : old_scroll.apply(this, arguments);
  },
  
  
// protected

  // runs an Fx on the element
  fx: function(name, args) {
    var args = $A(args).compact(), options = isHash(args.last()) ? args.pop() : {},
        fx = new Fx[name.capitalize()](this, options);
    
    fx.start.apply(fx, args);
    
    return this;
  }
  
}})(Element.Methods));

/**
 * Old IE browser hacks
 *
 *   Keep them in one place so they were more compact
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
if (Browser.OLD) {
  // loads DOM element extensions for selected elements
  $ = (function(old_function) {
    return function(id) {
      var element = old_function(id);
      
      // old IE browses match both, ID and NAME
      if (element !== null && isString(id) && element.id !== id) 
        element = $$('#'+id)[0];
        
      return element ? Element.prepare(element) : element;
    }
  })($);
  
  
  $ext(document, {
    /**
     * Overloading the native method to extend the new elements as it is
     * in all the other browsers
     *
     * @param String tag name
     * @return Element
     */
    createElement: (function(old_method) {
      return function(tag) {
        return Element.prepare(old_method(tag));
      }
    })(document.createElement)
  });
  
  
  
  $ext(Element, {
    /**
     * IE browsers manual elements extending
     *
     * @param Element
     * @return Element
     */
    prepare: function(element) {
      if (element && element.tagName && !element.set) {
        $ext(element, Element.Methods, true);

        if (window.Form) {
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
    }
  });
  
  Element.include((function() {
    var old_collect = Element.Methods.rCollect;
    
    return {
      rCollect: function(attr, css_rule) {
        return old_collect.call(this, attr, css_rule).each(Element.prepare);
      }
    }
  })());
}

/**
 * Konqueror browser fixes
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */

/**
 * manual position calculator, it works for Konqueror and also
 * old versions of Opera and FF, so we use a feature check in here
 */
if (!$E('p').getBoundingClientRect) {
  Element.include({
    position: function() {
      var left = this.offsetLeft, top = this.offsetTop, position = this.getStyle('position'),
        parent = this.parentNode, body = this.ownerDocument.body;
      
      // getting the parent node position
      while (parent && parent.tagName) {
        if (parent === body || parent.getStyle('position') != 'static') {
          if (parent !== body || position != 'absolute') {
            var subset = parent.position();
            left += subset.x;
            top  += subset.y;
          }
          break;
        }
        parent = parent.parentNode;
      }
      
      return {x: left, y: top};
    }
  });
  
  // Konq doesn't have the Form#elements reference
  Form.include({
    getElements: function() {
      return this.select('input,select,textarea,button');
    }
  })
}


/**
 * The manual css-selector feature implementation
 *
 * NOTE: this will define the standard css-selectors interface
 *       with the same names as native css-selectors implementation
 *       the actual public Element level methods for the feature
 *       is in the dom/selector.js file
 *
 * Credits:
 *   - Sizzle    (http://sizzlejs.org)      Copyright (C) John Resig
 *   - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
if (!document.querySelector) {
  Element.include((function() {
    /**
     * The token searchers collection
     */
    var search = {
      // search for any descendant nodes
      ' ': function(element, tag) {
        return $A(element.getElementsByTagName(tag));
      },

      // search for immidate descendant nodes
      '>': function(element, tag) {
        var result = [], node = element.firstChild;
        while (node) {
          if (tag == '*' || node.tagName == tag)
            result.push(node);
          node = node.nextSibling;
        }
        return result;
      },

      // search for immiate sibling nodes
      '+': function(element, tag) {
        while (element = element.nextSibling) {
          if (element.tagName)
            return (tag == '*' || element.tagName == tag) ? [element] : [];
        }
        return [];
      },

      // search for late sibling nodes
      '~': function(element, tag) {
        var result = [];
        while (element = element.nextSibling)
          if (tag == '*' || element.tagName == tag)
            result.push(element);
        return result;
      }
    };
    
    
    /**
     * Collection of pseudo selector matchers
     */
    var pseudos = {
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
        while (node = node.previousSibling) {
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
        while (node = node.nextSibling) {
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
        if (!this.parentNode) return false;
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
      }
    };
    
    // the regexps collection
    var chunker   = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g;
    var id_re     = /#([\w\-_]+)/;
    var tag_re    = /^[\w\*]+/;
    var class_re  = /\.([\w\-\._]+)/;
    var pseudo_re = /:([\w\-]+)(\((.+?)\))*$/;
    var attrs_re  = /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/;
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  
    /**
     * Builds an atom matcher
     *
     * @param String atom definition
     * @return Object atom matcher
     */
    var atoms_cache = {};
    function build_atom(atom) {
      if (!atoms_cache[atom]) {
        //
        // HACK HACK HACK
        //
        // I use those tiny variable names, case I'm gonna be nougty
        // and generate the matching function nasty way via evals and strings
        // and as the code will be compacted, the real variable names will be lost
        // unless they shortified to the minimum
        //
        // Here what the real variable names are
        //  i - for 'id' string
        //  t - for 'tag' name
        //  c - for 'classes' list
        //  a - for 'attributes' hash
        //  p - for 'pseudo' string
        //  v - for 'value_of_pseudo'
        //  
        var i, t, c, a, p, v, m, desc = {};
        
        // grabbing the attributes 
        while(m = atom.match(attrs_re)) {
          a = a || {};
          a[m[1]] = { o: m[2], v: m[5] || m[6] };
          atom = atom.replace(m[0], '');
        }
        
        // extracting the pseudos
        if (m = atom.match(pseudo_re)) {
          p = m[1];
          v = m[3] == '' ? null : m[3];
          atom = atom.replace(m[0], '');
        }
        
        // getting all the other options
        i = (atom.match(id_re) || [1, null])[1];
        t = (atom.match(tag_re) || '*').toString().toUpperCase();
        c = (atom.match(class_re) || [1, ''])[1].split('.').without('');
        
        desc.tag = t;
        
        // building the matcher function
        //
        // NOTE: we kinda compile a cutom filter function in here 
        //       the point is to create a maximally optimized method
        //       that will make only this atom checks and will filter
        //       a list of elements in a single call
        //
        if (i || c.length || a || p) {
          var filter = 'function(y){var e,r=[];for(var z=0,x=y.length;z<x;z++){e=y[z];_f_}return r}';
          var patch_filter = function(code) {
            filter = filter.replace('_f_', code + '_f_');
          };
          
          // adding the ID check conditions
          if (i) patch_filter('if(e.id!=i)continue;');
          
          // adding the classes matching code
          if (c.length) patch_filter(
            'if(e.className){var n=e.className.split(" ");if(n.length==1&&c.indexOf(n[0])==-1)continue;else{for(var i=0,l=c.length,b=false;i<l;i++)if(n.indexOf(c[i])==-1){b=true;break;}if(b)continue;}}else continue;'
          );
          
          // adding the attributes matching conditions
          if (a) patch_filter(
            'var p,o,v,b=false;for (var k in a){p=e.getAttribute(k)||"";o=a[k].o;v=a[k].v;if((o=="="&&p!=v)||(o=="*="&&!p.includes(v))||(o=="^="&&!p.startsWith(v))||(o=="$="&&!p.endsWith(v))||(o=="~="&&!p.split(" ").includes(v))||(o=="|="&&!p.split("-").includes(v))){b=true;break;}}if(b){continue;}'
          );
          
          // adding the pseudo matchers check
          if (p && pseudos[p]) {
            var s = pseudos;
            patch_filter('if(!s[p].call(e,v,s))continue;');
          }

          desc.filter = eval('['+ filter.replace('_f_', 'r.push(e)') +']')[0];
        }
        
        atoms_cache[atom] = desc;
      }
      
      return atoms_cache[atom];
    };
    
    /**
     * Builds a single selector out of a simple rule chunk
     *
     * @param Array of a single rule tokens
     * @return Function selector
     */
    var tokens_cache = {};
    function build_selector(rule) {
      var rule_key = rule.join('');
      if (!tokens_cache[rule_key]) {
        for (var i=0; i < rule.length; i++) {
          rule[i][1] = build_atom(rule[i][1]);
        }
        
        // creates a list of uniq nodes
        var _uid = $uid;
        var uniq = function(elements) {
          var uniq = [], uids = [], uid;
          for (var i=0, length = elements.length; i < length; i++) {
            uid = _uid(elements[i]);
            if (!uids[uid]) {
              uniq.push(elements[i]);
              uids[uid] = true;
            }
          }

          return uniq;
        };
        
        // performs the actual search of subnodes
        var find_subnodes = function(element, atom) {
          var result = search[atom[0]](element, atom[1].tag);
          return atom[1].filter ? atom[1].filter(result) : result;
        };
        
        // building the actual selector function
        tokens_cache[rule_key] = function(element) {
          var founds, sub_founds;
          
          for (var i=0, i_length = rule.length; i < i_length; i++) {
            if (i == 0) {
              founds = find_subnodes(element, rule[i]);

            } else {
              if (i > 1) founds = uniq(founds);

              for (var j=0; j < founds.length; j++) {
                sub_founds = find_subnodes(founds[j], rule[i]);

                sub_founds.unshift(1); // <- nuke the parent node out of the list
                sub_founds.unshift(j); // <- position to insert the subresult

                founds.splice.apply(founds, sub_founds);

                j += sub_founds.length - 3;
              }
            }
          }
          
          return rule.length > 1 ? uniq(founds) : founds;
        };
      }
      return tokens_cache[rule_key];
    };
    
    
    /**
     * Builds the list of selectors for the css_rule
     *
     * @param String raw css-rule
     * @return Array of selectors
     */
    var selectors_cache = {}, chunks_cache = {};
    function split_rule_to_selectors(css_rule) {
      if (!selectors_cache[css_rule]) {
        chunker.lastIndex = 0;
        
        var rules = [], rule = [], rel = ' ', m, token;
        while (m = chunker.exec(css_rule)) {
          token = m[1];
          
          if (token == '+' || token == '>' || token == '~') {
            rel = token;
          } else {
            rule.push([rel, token]);
            rel = ' ';
          }

          if (m[2]) {
            rules.push(build_selector(rule));
            rule = [];
          }
        }
        rules.push(build_selector(rule));
        
        selectors_cache[css_rule] = rules;
      }
      return selectors_cache[css_rule];
    };
    
    
    /**
     * The top level method, it just goes throught the css-rule chunks
     * collect and merge the results that's it
     *
     * @param Element context
     * @param String raw css-rule
     * @return Array search result
     */
    function select_all(element, css_rule) {
      var selectors = split_rule_to_selectors(css_rule), result = [];
      for (var i=0, length = selectors.length; i < length; i++)
        result = result.concat(selectors[i](element));
      
      if (Browser.OLD) result.forEach(Element.prepare);
      
      return result;
    };
    
    
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  
    // the previous dom-selection methods replacement
    var dom_extension = {
      first: function(css_rule) {
        return this.select(css_rule).first();
      },
      
      select: function(css_rule) {
        return select_all(this, css_rule || '*');
      }
    };
    
    // replacing the document-level search methods
    $ext(document, dom_extension);
    
    // patching the $$ function to make it more efficient
    window.$$ = function(css_rule) {
      return select_all(document, css_rule || '*');
    };
    
    // sending the extension to the Element#include
    return dom_extension;
  })());
}

