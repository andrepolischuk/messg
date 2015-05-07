
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

var body = document.getElementsByTagName('body')[0];

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
