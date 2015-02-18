
'use strict';

/**
 * Module dependencies
 */

var ea = require('ea');
var evs = require('evs');
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
 * @param {Object} buttons
 * @api public
 */

function Message(type, text, delay, buttons) {
  this.id = uniquid(messg.element);
  this.type = type;
  this.text = text.replace(/(<script.*>.*<\/script>)/gim, '');
  this.delay = delay;
  this.exist = false;
  this.buttons = buttons;
  this.element = appendElement(this);
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
 * Append element to DOM
 * @param  {Object} message
 * @return {Object}
 * @api private
 */

function appendElement(message) {

  var element = document.createElement('div');

  element.style.display = display0;
  element.style.opacity = opacity0;

  element.style.transition = [
    'all',
    messg.speed / 1000 + 's',
    'ease-in-out'
  ].join(' ');

  element.className = [
    messg.element,
    ' ',
    messg.element,
    '-',
    message.type
  ].join('');

  element.id = message.id;
  element.setAttribute('role', message.type);

  if (message.buttons) {
    appendButtons(message, element);
  } else {
    evs.attach(element, 'click', function() {
      message.hide();
    });
  }

  appendText(message, element);
  body.appendChild(element);
  return element;

}

/**
 * Append buttons to element
 * @param {Object} message
 * @param {Object} element
 * @api private
 */

function appendButtons(message, element) {

  var button, buttons = document.createElement('div');

  buttons.className = [
    messg.element,
    '-buttons'
  ].join('');

  element.appendChild(buttons);

  ea(message.buttons, function(handler, k) {

    button = document.createElement('button');
    button.innerHTML = k;

    button.className = [
      messg.element,
      '-button'
    ].join('');

    buttons.appendChild(button);

    evs.attach(button, 'click', handler === true ? function() {
      message.hide();
    } : function() {
      handler(k);
      message.hide();
    });

  });

}

/**
 * Append text to element
 * @param {Object} message
 * @param {Object} element
 * @api private
 */

function appendText(message, element) {

  var text = document.createElement('div');
  text.innerHTML = message.text;

  text.className = [
    messg.element,
    '-text'
  ].join('');

  element.appendChild(text);

}

/**
 * Flow reposition
 * @api private
 */

function reposition() {

  var pos = margin;

  ea.reverse(flow, function(message) {
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
 * @param {Object} buttons
 * @api public
 */

function messg(text, type, delay, buttons) {

  buttons = typeof type === 'object' ? type : buttons;
  buttons = typeof delay === 'object' ? delay : buttons;
  delay = typeof type === 'number' ? type : delay;

  if (!text) {
    return;
  }

  var message = new Message(
    typeof type === 'string' ? type : types[0],
    text,
    typeof delay === 'number' ? delay : undefined,
    typeof buttons === 'object' ? buttons : undefined
  );

  flow[message.id] = message;
  message.show();

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
    ea(key, function(val, k) {
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
 * @param {Object} buttons
 * @api public
 */

ea(types, function(type) {
  messg[type] = function(text, delay, buttons) {
    messg(text, type, delay, buttons);
  };
});

/**
 * Module exports
 */

module.exports = messg;
