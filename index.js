
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
