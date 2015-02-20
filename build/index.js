(function outer(modules, cache, entries){

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

var events = require('component/event');
var messg = require('andrepolischuk/messg@1.1.0');

events.bind(document.querySelector('.btn-default'), 'click', function(e) {
  messg('Close this by click');
}, false);

events.bind(document.querySelector('.btn-success'), 'click', function(e) {
  messg.success('Task completed', 3000);
}, false);

events.bind(document.querySelector('.btn-info'), 'click', function(e) {
  messg.info('You can try other').button('x');
}, false);

events.bind(document.querySelector('.btn-warning'), 'click', function(e) {
  messg.warning('Are you sure?').button('Yes', function() {
    alert('Yes');
  }).button('No', function() {
    alert('No');
  });
}, false);

events.bind(document.querySelector('.btn-danger'), 'click', function(e) {
  messg.error('Connection is lost').button('OK');
}, false);

}, {"component/event":2,"andrepolischuk/messg@1.1.0":3}],
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
 * Message
 * @param {String} type
 * @param {String} text
 * @param {Number} delay
 * @api public
 */

function Message(type, text, delay) {

  var self = this;

  self.id = uniquid(prefix);
  self.type = type;
  self.text = text.replace(/(<script.*>.*<\/script>)/gim, '');
  self.delay = delay;
  self.exist = false;

  self.element = document.createElement('div');
  self.element.innerHTML = template;
  self.element = self.element.children[0];
  self.element.style.display = display0;
  self.element.style.opacity = opacity0;

  self.element.style.transition = [
    'all',
    messg.speed / 1000 + 's',
    'ease-in-out'
  ].join(' ');

  self.element.className += [
    ' ',
    prefix,
    '-',
    self.type
  ].join('');

  self.element.id = self.id;
  self.element.setAttribute('role', self.type);
  self.buttons = self.element.children[0];
  self.content = self.element.children[1];
  self.content.innerHTML = self.text;

  body.appendChild(self.element);

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

  var self = this;
  self.exist = true;
  self.element.style.display = display1;

  setTimeout(function() {
    self.element.style.opacity = opacity1;
  }, 50);

  if (self.delay) {
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

Message.prototype.hide = function() {

  var self = this;
  self.exist = false;
  self.element.style.opacity = opacity0;

  setTimeout(function() {
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

  var self = this;

  var button = document.createElement('button');
  button.innerHTML = name;

  self.buttons.appendChild(button);
  reposition();

  events.bind(button, 'click', typeof fn === 'function' ? function() {
    fn(name.toLowerCase());
    self.hide();
  } : function() {
    self.hide();
  });

  return self;

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

/**
 * Module
 * @param {String} text
 * @param {String} type
 * @param {Number} delay
 * @api public
 */

function messg(text, type, delay) {

  if (!text) {
    return;
  }

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
 * Set options
 * @param {String|Object} key
 * @param {Mixed} value
 * @api public
 */

messg.set = function(key, value) {
  if (typeof key === 'object') {
    each(key, function(val, k) {
      messg[k] = val;
    });
  } else if (value) {
    messg[key] = value;
  }
};

/**
 * Show message via type
 * @param {String} text
 * @param {Number} delay
 * @api public
 */

each(types, function(type) {
  messg[type] = function(text, delay) {
    return messg(text, type, delay);
  };
});

/**
 * Module exports
 */

module.exports = messg;

}, {"event":2,"component-event":2,"ea":4,"uniquid":5,"./template.html":6}],
4: [function(require, module, exports) {

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
5: [function(require, module, exports) {

'use strict';

/**
 * Generate unique ID
 * @param  {String} prefix
 * @return {String}
 * @api public
 */

function uniqueID(prefix) {

  var uid = parseInt([
    (new Date()).valueOf(),
    (Math.random() * 1000000000).toFixed()
  ].join('')).toString(36);

  return [
    prefix || '',
    uid
  ].join('');

}

/**
 * Module exports
 */

module.exports = uniqueID;

}, {}],
6: [function(require, module, exports) {
module.exports = '<div class="messg">\n  <div class="messg-buttons"></div>\n  <div class="messg-text"></div>\n</div>\n';
}, {}]}, {}, {"1":""})
