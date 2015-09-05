(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _messg = require('messg');

var _messg2 = _interopRequireDefault(_messg);

var btnDefault = document.querySelector('.btn-default');
var btnSuccess = document.querySelector('.btn-success');
var btnInfo = document.querySelector('.btn-info');
var btnWarning = document.querySelector('.btn-warning');
var btnDanger = document.querySelector('.btn-danger');
var btnDelay = document.querySelector('.btn-delay');
var btnX = document.querySelector('.btn-x');
var btnOk = document.querySelector('.btn-ok');
var btnYesNo = document.querySelector('.btn-yes-no');

btnDefault.addEventListener('click', function () {
  (0, _messg2['default'])('Close this by click');
}, false);

btnSuccess.addEventListener('click', function () {
  _messg2['default'].success('Close this by click');
}, false);

btnInfo.addEventListener('click', function () {
  _messg2['default'].info('Close this by click');
}, false);

btnWarning.addEventListener('click', function () {
  _messg2['default'].warning('Close this by click');
}, false);

btnDanger.addEventListener('click', function () {
  _messg2['default'].error('Close this by click');
}, false);

btnDelay.addEventListener('click', function () {
  _messg2['default'].success('Task completed', 3000);
}, false);

btnX.addEventListener('click', function () {
  _messg2['default'].info('You can try other').button('x');
}, false);

btnOk.addEventListener('click', function () {
  _messg2['default'].error('Connection is lost').button('OK');
}, false);

btnYesNo.addEventListener('click', function () {
  _messg2['default'].warning('Are you sure?').button('Yes', function () {
    _messg2['default'].warning('You say "Yes"', 5000);
  }).button('No', function () {
    _messg2['default'].warning('You say "No"', 5000);
  });
}, false);

},{"messg":3}],2:[function(require,module,exports){
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

try {
  var events = require('event');
} catch (err) {
  var events = require('component-event');
}

var each = require('ea');
var eachReverse = require('each-reverse');
var uniquid = require('uniquid');
var body;
var flow = {};
var margin = 10;
var prefix = 'messg';

var template = '<div class="' + prefix + '">' +
    '<div class="' + prefix + '-buttons"></div>' +
    '<div class="' + prefix + '-text"></div>' +
  '</div>';

var types = [
  'default',
  'success',
  'info',
  'warning',
  'error'
];

module.exports = Message;

Message.speed = 250;
Message.position = 'top';
Message.flow = true;

module.exports.set = function(key, value) {
  if (typeof key === 'object') {
    each(key, function(val, k) {
      Message[k] = val;
    });
  } else if (value) {
    Message[key] = value;
  }
};

each(types, function(type) {
  module.exports[type] = function(text, delay) {
    if (!text) return;
    return new Message(text, type, delay);
  };
});

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
  this.element.style.display = 'none';
  this.element.style.opacity = '0.0';
  this.element.style.transition = 'all ' +
    Message.speed / 1000 + 's ease-in-out';
  this.element.className += ' ' + prefix + '-' + this.type;
  this.element.id = this.id;
  this.element.setAttribute('role', this.type);
  this.element.children[1].innerHTML = this.text;
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

Message.prototype.show = function() {
  this.exist = true;
  this.element.style.display = 'block';
  reposition();
  var self = this;

  setTimeout(function() {
    self.element.style.opacity = '1.0';
  }, 50);

  if (this.delay) {
    setTimeout(function() {
      self.hide();
    }, self.delay + Message.speed);
  }

  return this;
};

Message.prototype.hide = function(fn) {
  if (typeof fn === 'function') {
    this.fn = fn;
    return this;
  }

  this.exist = false;
  this.element.style.opacity = '0.0';
  if (this.fn) this.fn();
  reposition();
  var self = this;

  setTimeout(function() {
    self.element.style.display = 'none';
    body.removeChild(self.element);
    delete flow[self.id];
  }, Message.speed);
};

Message.prototype.button = function(name, fn) {
  var button = document.createElement('button');
  button.innerHTML = name;
  this.element.children[0].appendChild(button);
  reposition();
  var self = this;

  events.bind(button, 'click', function() {
    if (typeof fn === 'function') fn(name.toLowerCase());
    self.hide();
  });

  return this;
};

function reposition() {
  var pos = margin;

  eachReverse(flow, function(message) {
    if (message.exist) {
      message.element.style[Message.position] = pos + 'px';
      pos += message.element.offsetHeight + margin;
    }
  });
}

},{"component-event":2,"ea":4,"each-reverse":6,"event":2,"uniquid":8}],4:[function(require,module,exports){
'use strict';

try {
  var type = require('type');
} catch (err) {
  var type = require('component-type');
}

module.exports = function(obj, fn) {
  if (type(fn) !== 'function') return;

  switch (type(obj)) {
    case 'array':
      return array(obj, fn);
    case 'object':
      if (type(obj.length) === 'number') return array(obj, fn);
      return object(obj, fn);
    case 'string':
      return string(obj, fn);
  }
};

function array(obj, fn) {
  for (var i = 0, len = obj.length; i < len; i++) {
    fn(obj[i], i);
  }
}

function object(obj, fn) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      fn(obj[i], i);
    }
  }
}

function string(obj, fn) {
  for (var i = 0, len = obj.length; i < len; i++) {
    fn(obj.charAt(i), i);
  }
}

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

try {
  var type = require('type');
} catch (err) {
  var type = require('component-type');
}

module.exports = function(obj, fn) {
  if (type(fn) !== 'function') return;

  switch (type(obj)) {
    case 'array':
      return array(obj, fn);
    case 'object':
      if (type(obj.length) === 'number') return array(obj, fn);
      return object(obj, fn);
    case 'string':
      return string(obj, fn);
  }
};

function array(obj, fn) {
  for (var i = obj.length - 1; i >= 0; i--) {
    fn(obj[i], i);
  }
}

function object(obj, fn) {
  var keys = [];

  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      keys.push(k);
    }
  }

  for (var i = keys.length - 1; i >= 0; i--) {
    fn(obj[keys[i]], keys[i]);
  }
}

function string(obj, fn) {
  for (var i = obj.length - 1; i >= 0; i--) {
    fn(obj.charAt(i), i);
  }
}

},{"component-type":7,"type":7}],7:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],8:[function(require,module,exports){
'use strict';

module.exports = function(prefix) {
  var uid = parseInt((new Date()).valueOf() +
    (Math.random() * 1000000).toFixed()).toString(36);
  return (prefix || '') + uid;
};

},{}]},{},[1]);
