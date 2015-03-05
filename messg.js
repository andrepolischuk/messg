(function umd(require){
  if ('object' == typeof exports) {
    module.exports = require('1');
  } else if ('function' == typeof define && (define.amd || define.cmd)) {
    define(function(){ return require('1'); });
  } else {
    this['messg'] = require('1');
  }
})((function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep ? dep : req);
    }, m, m.exports, outer, modules, cache, entries);

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {

'use strict';

/**
 * Module dependencies
 */

try {
  var events = require('event');
} catch (err) {
  var events = require('component-event');
}

var each = require('ea');
var uniquid = require('uniquid');
var template = require('./template.html');

/**
 * Object types
 */

var types =  [
  'default',
  'success',
  'info',
  'warning',
  'error'
];

/**
 * Body ref
 */

var body = document.getElementsByTagName('body')[0];

/**
 * Prefix
 */

var prefix = 'messg';

/**
 * Messages flow
 */

var flow = {};

/**
 * Margin
 */

var margin = 10;

/**
 * Opacity
 */

var opacity0 = '0.0';
var opacity1 = '1.0';

/**
 * Display
 */

var display0 = 'none';
var display1 = 'block';

/**
 * Expose message calling
 */

module.exports = messg;

/**
 * Call message
 * @param {String} text
 * @param {String} type
 * @param {Number} delay
 * @api public
 */

function messg(text, type, delay) {
  if (!text) return;

  delay = typeof type === 'number' ? type : delay;
  type = typeof type === 'string' ? type : types[0];

  if (!messg.flow) {
    each(flow, function(message) {
      message.hide();
    });
  }

  var message = new Message(type, text, delay);
  flow[message.id] = message;
  message.show();
  return message;
}

/**
 * Transition speed
 */

messg.speed = 250;

/**
 * Position
 */

messg.position = 'top';

/**
 * Add to flow
 */

messg.flow = true;

/**
 * Expose set options
 * @param {String|Object} key
 * @param {Mixed} value
 * @api public
 */

module.exports.set = function(key, value) {
  if (typeof key === 'object') {
    each(key, function(val, k) {
      messg[k] = val;
    });
  } else if (value) {
    messg[key] = value;
  }
};

/**
 * Expose message calling via type
 * @param {String} text
 * @param {Number} delay
 * @api public
 */

each(types, function(type) {
  module.exports[type] = function(text, delay) {
    return messg(text, type, delay);
  };
});

/**
 * Message
 * @param {String} type
 * @param {String} text
 * @param {Number} delay
 * @api public
 */

function Message(type, text, delay) {
  this.id = uniquid(prefix);
  this.type = type;
  this.text = text.replace(/(<script.*>.*<\/script>)/gim, '');
  this.delay = delay;
  this.exist = false;

  this.element = document.createElement('div');
  this.element.innerHTML = template;
  this.element = this.element.children[0];
  this.element.style.display = display0;
  this.element.style.opacity = opacity0;

  this.element.style.transition = [
    'all',
    messg.speed / 1000 + 's',
    'ease-in-out'
  ].join(' ');

  this.element.className += [
    ' ',
    prefix,
    '-',
    this.type
  ].join('');

  this.element.id = this.id;
  this.element.setAttribute('role', this.type);
  this.buttons = this.element.children[0];
  this.content = this.element.children[1];
  this.content.innerHTML = this.text;
  body.appendChild(this.element);

  var self = this;

  setTimeout(function() {
    if (!self.buttons.children.length) {
      events.bind(self.element, 'click', function() {
        self.hide();
      });
    }
  }, messg.speed);
}

/**
 * Show message
 * @api public
 */

Message.prototype.show = function() {
  this.exist = true;
  this.element.style.display = display1;

  var self = this;

  setTimeout(function() {
    self.element.style.opacity = opacity1;
  }, 50);

  if (this.delay) {
    setTimeout(function() {
      self.hide();
    }, self.delay + messg.speed);
  }

  reposition();
};

/**
 * Hide message
 * @api public
 */

Message.prototype.hide = function(fn) {

  if (typeof fn === 'function') {
    this.fn = fn;
    return this;
  }

  this.exist = false;
  this.element.style.opacity = opacity0;

  var self = this;

  setTimeout(function() {
    if (self.fn) self.fn();
    self.element.style.display = display0;
    body.removeChild(self.element);
    delete flow[self.id];
  }, messg.speed);

  reposition();
};

/**
 * Add button
 * @param  {String}   name
 * @param  {Function} fn
 * @return {Object}
 * @api public
 */

Message.prototype.button = function(name, fn) {
  var button = document.createElement('button');
  button.innerHTML = name;
  this.buttons.appendChild(button);
  reposition();

  var self = this;

  events.bind(button, 'click', typeof fn === 'function' ? function() {
    fn(name.toLowerCase());
    self.hide();
  } : function() {
    self.hide();
  });

  return this;
};

/**
 * Flow reposition
 * @api private
 */

function reposition() {
  var pos = margin;

  each.reverse(flow, function(message) {
    if (message.exist) {
      message.element.style[messg.position] = pos + 'px';
      pos += message.element.offsetHeight + margin;
    }
  });
}

}, {"event":2,"component-event":2,"ea":3,"uniquid":4,"./template.html":5}],
2: [function(require, module, exports) {
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};
}, {}],
3: [function(require, module, exports) {

'use strict';

/**
 * Has own property
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Types methods
 */

var array = {};
var object = {};

/**
 * Array each
 * @param {Array} obj
 * @param {Function} fn
 * @api private
 */

array.each = function(obj, fn) {
  for (var i = 0; i < obj.length; i++) {
    fn(obj[i], i);
  }
};

/**
 * Array reverse each
 * @param {Array} obj
 * @param {Function} fn
 * @api private
 */

array.reverse = function(obj, fn) {
  for (var i = obj.length - 1; i >= 0 ; i--) {
    fn(obj[i], i);
  }
};

/**
 * Object each
 * @param {Object} obj
 * @param {Function} fn
 * @api private
 */

object.each = function(obj, fn) {
  for (var i in obj) {
    if (has.call(obj, i)) {
      fn(obj[i], i);
    }
  }
};

/**
 * Object reverse each
 * @param {Object} obj
 * @param {Function} fn
 * @api private
 */

object.reverse = function(obj, fn) {
  var keys = [];
  for (var k in obj) {
    if (has.call(obj, k)) {
      keys.push(k);
    }
  }
  for (var i = keys.length - 1; i >= 0; i--) {
    fn(obj[keys[i]], keys[i]);
  }
};

/**
 * Each router
 * @param  {String} method
 * @param  {Object|Array} obj
 * @param  {Function} fn
 * @return {Function}
 * @api private
 */

function route(method, obj, fn) {
  if (typeof fn === 'function') {
    switch (is(obj)) {
      case 'array' :
        return array[method](obj, fn);
      case 'object' :
        return object[method](obj, fn);
    }
  }
}

/**
 * Typeof
 * @param  {Object|Array} obj
 * @return {String}
 * @api private
 */

function is(obj) {
  return Object.prototype.toString.call(obj)
    .replace(/\[\w+\s(\w+)\]/i, '$1').toLowerCase();
}

/**
 * Module
 * @param {Object|Array} obj
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

function ea(obj, fn) {
  return ea.each(obj, fn);
}

/**
 * Each
 * @param {Object|Array} obj
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

ea.each = function(obj, fn) {
  return route('each', obj, fn);
};

/**
 * Reverse each
 * @param {Object|Array} obj
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

ea.reverse = function(obj, fn) {
  return route('reverse', obj, fn);
};

/**
 * Module exports
 */

module.exports = ea;

}, {}],
4: [function(require, module, exports) {

'use strict';

/**
 * Generate unique ID
 * @param  {String} prefix
 * @return {String}
 * @api public
 */

module.exports = function(prefix) {

  var uid = parseInt([
    (new Date()).valueOf(),
    (Math.random() * 1000000).toFixed()
  ].join('')).toString(36);

  return [
    prefix || '',
    uid
  ].join('');

};

}, {}],
5: [function(require, module, exports) {
module.exports = '<div class="messg">\n  <div class="messg-buttons"></div>\n  <div class="messg-text"></div>\n</div>\n';
}, {}]}, {}, {"1":""})
);