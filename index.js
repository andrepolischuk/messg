
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
