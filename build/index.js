(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

'use strict';

var events = require('component-event');
var messg = require('messg');

events.bind(document.querySelector('.btn-default'), 'click', function(e) {
  messg('Close this by click');
}, false);

events.bind(document.querySelector('.btn-success'), 'click', function(e) {
  messg.success('Close this by click');
}, false);

events.bind(document.querySelector('.btn-info'), 'click', function(e) {
  messg.info('Close this by click');
}, false);

events.bind(document.querySelector('.btn-warning'), 'click', function(e) {
  messg.warning('Close this by click');
}, false);

events.bind(document.querySelector('.btn-danger'), 'click', function(e) {
  messg.error('Close this by click');
}, false);

events.bind(document.querySelector('.btn-delay'), 'click', function(e) {
  messg.success('Task completed', 3000);
}, false);

events.bind(document.querySelector('.btn-x'), 'click', function(e) {
  messg
    .info('You can try other')
    .button('x');
}, false);

events.bind(document.querySelector('.btn-ok'), 'click', function(e) {
  messg
    .error('Connection is lost')
    .button('OK');
}, false);

events.bind(document.querySelector('.btn-yes-no'), 'click', function(e) {
  messg
    .warning('Are you sure?')
    .button('Yes', function() {
      messg.info('Yes', 5000);
    }).button('No', function() {
      messg.info('No', 5000);
    });
}, false);

},{"component-event":2,"messg":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){

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

/**
 * Object types
 */

var types = [
  'default',
  'success',
  'info',
  'warning',
  'error'
];

/**
 * Body ref
 */

var body;

/**
 * Prefix
 */

var prefix = 'messg';

/**
 * Template
 */

var template = '<div class="' + prefix + '">' +
    '<div class="' + prefix + '-buttons"></div>' +
    '<div class="' + prefix + '-text"></div>' +
  '</div>';

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

module.exports = Message;

/**
 * Transition speed
 */

Message.speed = 250;

/**
 * Position
 */

Message.position = 'top';

/**
 * Add to flow
 */

Message.flow = true;

/**
 * Expose set options
 *
 * @param {String|Object} key
 * @param {Mixed} value
 * @api public
 */

module.exports.set = function(key, value) {
  if (typeof key === 'object') {
    each(key, function(val, k) {
      Message[k] = val;
    });
  } else if (value) {
    Message[key] = value;
  }
};

/**
 * Expose message calling via type
 *
 * @param {String} text
 * @param {Number} delay
 * @api public
 */

each(types, function(type) {
  module.exports[type] = function(text, delay) {
    if (!text) return;
    return new Message(text, type, delay);
  };
});

/**
 * Message
 *
 * @param {String} text
 * @param {String} type
 * @param {Number} delay
 * @api public
 */

function Message(text, type, delay) {
  if (!text) return;
  if (!(this instanceof Message)) return new Message(text, type, delay);

  this.id = uniquid(prefix);
  this.delay = typeof type === 'number' ? type : delay;
  this.type = typeof type === 'string' ? type : types[0];
  this.text = text.replace(/(<script.*>.*<\/script>)/gim, '');
  this.exist = false;

  this.element = document.createElement('div');
  this.element.innerHTML = template;
  this.element = this.element.children[0];
  this.element.style.display = display0;
  this.element.style.opacity = opacity0;
  this.element.style.transition = 'all ' +
    Message.speed / 1000 + 's ease-in-out';
  this.element.className += ' ' + prefix + '-' + this.type;
  this.element.id = this.id;
  this.element.setAttribute('role', this.type);
  this.buttons = this.element.children[0];
  this.content = this.element.children[1];
  this.content.innerHTML = this.text;

  if (!body) body = document.getElementsByTagName('body')[0];
  body.appendChild(this.element);

  if (!Message.flow) {
    each(flow, function(message) {
      message.hide();
    });
  }

  flow[this.id] = this;
  this.show();

  var self = this;

  setTimeout(function() {
    if (!self.buttons.children.length) {
      events.bind(self.element, 'click', function() {
        self.hide();
      });
    }
  }, Message.speed);
}

/**
 * Show message
 *
 * @return {Object}
 * @api public
 */

Message.prototype.show = function() {
  this.exist = true;
  this.element.style.display = display1;
  reposition();

  var self = this;

  setTimeout(function() {
    self.element.style.opacity = opacity1;
  }, 50);

  if (this.delay) {
    setTimeout(function() {
      self.hide();
    }, self.delay + Message.speed);
  }

  return this;
};

/**
 * Hide message
 *
 * @api public
 */

Message.prototype.hide = function(fn) {
  if (typeof fn === 'function') {
    this.fn = fn;
    return this;
  }

  this.exist = false;
  this.element.style.opacity = opacity0;
  if (this.fn) this.fn();
  reposition();

  var self = this;

  setTimeout(function() {
    self.element.style.display = display0;
    body.removeChild(self.element);
    delete flow[self.id];
  }, Message.speed);
};

/**
 * Add button
 *
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

  events.bind(button, 'click', function() {
    if (typeof fn === 'function') fn(name.toLowerCase());
    self.hide();
  });

  return this;
};

/**
 * Flow reposition
 *
 * @api private
 */

function reposition() {
  var pos = margin;

  each.reverse(flow, function(message) {
    if (message.exist) {
      message.element.style[Message.position] = pos + 'px';
      pos += message.element.offsetHeight + margin;
    }
  });
}

},{"component-event":2,"ea":4,"event":2,"uniquid":6}],4:[function(require,module,exports){

'use strict';

/**
 * Module dependencies
 */

try {
  var type = require('type');
} catch (err) {
  var type = require('component-type');
}

/**
 * Has own property
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Expose direct iterate
 */

module.exports = each;

/**
 * Expose reverse iterate
 *
 * @param {Object|Array} obj
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

module.exports.reverse = function(obj, fn) {
  return each(obj, fn, 'reverse');
};

/**
 * Iteration router
 *
 * @param {Object|Array} obj
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

function each(obj, fn, direction) {
  if (typeof fn === 'function') {
    switch (type(obj)) {
      case 'array':
        return (array[direction] || array)(obj, fn);
      case 'object':
        if (type(obj.length) === 'number') {
          return (array[direction] || array)(obj, fn);
        }
        return (object[direction] || object)(obj, fn);
      case 'string':
        return (string[direction] || string)(obj, fn);
    }
  }
}

/**
 * Iterate array
 *
 * @param {Array} obj
 * @param {Function} fn
 * @api private
 */

function array(obj, fn) {
  for (var i = 0; i < obj.length; i++) {
    fn(obj[i], i);
  }
}

/**
 * Iterate array in reverse order
 *
 * @param {Array} obj
 * @param {Function} fn
 * @api private
 */

array.reverse = function(obj, fn) {
  for (var i = obj.length - 1; i >= 0; i--) {
    fn(obj[i], i);
  }
};

/**
 * Iterate object
 *
 * @param {Object} obj
 * @param {Function} fn
 * @api private
 */

function object(obj, fn) {
  for (var i in obj) {
    if (has.call(obj, i)) {
      fn(obj[i], i);
    }
  }
}

/**
 * Iterate object in reverse order
 *
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
 * Iterate string
 *
 * @param {Array} obj
 * @param {Function} fn
 * @api private
 */

function string(obj, fn) {
  for (var i = 0; i < obj.length; i++) {
    fn(obj.charAt(i), i);
  }
}

/**
 * Iterate string in reverse order
 *
 * @param {Array} obj
 * @param {Function} fn
 * @api private
 */

string.reverse = function(obj, fn) {
  for (var i = obj.length - 1; i >= 0; i--) {
    fn(obj.charAt(i), i);
  }
};

},{"component-type":5,"type":5}],5:[function(require,module,exports){
/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object Error]': return 'error';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val !== val) return 'nan';
  if (val && val.nodeType === 1) return 'element';

  val = val.valueOf
    ? val.valueOf()
    : Object.prototype.valueOf.apply(val)

  return typeof val;
};

},{}],6:[function(require,module,exports){

'use strict';

/**
 * Generate unique ID
 *
 * @param  {String} prefix
 * @return {String}
 * @api public
 */

module.exports = function(prefix) {
  var uid = parseInt((new Date()).valueOf() +
    (Math.random() * 1000000).toFixed()).toString(36);
  return (prefix || '') + uid;
};

},{}]},{},[1]);
