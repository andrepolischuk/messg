
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

  this.id = uniquid(messg.element);
  this.type = type;
  this.text = text.replace(/(<script.*>.*<\/script>)/gim, '');
  this.delay = delay;
  this.exist = false;

  this.element = document.createElement('div');
  this.element.style.display = display0;
  this.element.style.opacity = opacity0;

  this.element.style.transition = [
    'all',
    messg.speed / 1000 + 's',
    'ease-in-out'
  ].join(' ');

  this.element.className = [
    messg.element,
    ' ',
    messg.element,
    '-',
    this.type
  ].join('');

  this.element.id = this.id;
  this.element.setAttribute('role', this.type);

  this.content = document.createElement('div');
  this.content.innerHTML = this.text;
  this.content.className = messg.element + '-text';

  this.element.appendChild(this.content);
  body.appendChild(this.element);

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

  if (!self.buttons) {
    self.buttons = document.createElement('div');
    self.buttons.className = messg.element + '-buttons';
    self.element.insertBefore(self.buttons, self.element.childNodes[0]);
  }

  var button = document.createElement('button');
  button.innerHTML = name;

  button.className = [
    messg.element,
    '-button'
  ].join('');

  self.buttons.appendChild(button);
  reposition();

  events.bind(button, 'click', typeof fn === 'function' ? function() {
    fn(name);
    self.hide();
  } : function() {
    self.hide();
  });

  return self;

};

/**
 * Close when click on element
 * @return {Object}
 * @api public
 */

Message.prototype.close = function() {

  var self = this;

  events.bind(self.element, 'click', function() {
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

  var message = new Message(type, text, delay);
  flow[message.id] = message;
  message.show();

  return message;

}

/**
 * Object class
 */

messg.element = 'messg';

/**
 * Transition speed
 */

messg.speed = 250;

/**
 * Position
 */

messg.position = 'top';

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
