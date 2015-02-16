
'use strict';

/**
 * Default type
 */

var DEFAULT_TYPE = 'default';

/**
 * Object options
 */

var options = {};

/**
 * Object class
 */

options.element = 'messg';

/**
 * Transition speed
 */

options.speed = 250;

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
 * Messages flow
 */

var flow = {};

/**
 * Message
 * @param {String} type
 * @param {String} text
 * @param {Number} delay
 * @api public
 */

function Message(type, text, delay) {

  this.id = [
    options.element,
    '_',
    (new Date()).valueOf(),
    (Math.random() * 1000000000).toFixed()
  ].join('');

  this.type = type;
  this.text = text.replace(/(<script.*>.*<\/script>)/gim, '');
  this.delay = delay + options.speed || null;
  this.element = appendElement(this);

}

/**
 * Show message
 * @api public
 */

Message.prototype.show = function() {

  var self = this;
  self.element.style.display = 'block';

  setTimeout(function() {
    self.element.style.opacity = '1.0';
  }, 50);

  if (self.delay) {
    setTimeout(self.hide, self.delay);
  }

};

/**
 * Hide message
 * @api public
 */

Message.prototype.hide = function() {

  var self = this;
  self.element.style.opacity = '0.0';

  setTimeout(function() {
    self.element.style.display = 'none';
    delete flow[self.id];
  }, options.speed);

};

/**
 * Append element to DOM
 * @param  {Object} message
 * @return {Object}
 * @api private
 */

function appendElement(message) {

  var element = document.createElement('div');

  element.style.display = 'none';
  element.style.opacity = '0.0';

  element.style.transition = [
    'opacity',
    options.speed / 1000 + 's',
    'ease-in-out'
  ].join(' ');

  element.className = [
    options.element,
    ' ',
    options.element,
    '-',
    message.type
  ].join('');

  element.id = message.id;
  element.innerHTML = message.text;
  element.setAttribute('role', message.type);

  document.getElementsByTagName('body')[0].appendChild(element);

  element.onclick = function() {
    message.hide();
  };

  return element;

}

/**
 * Show message
 * @param  {String} type
 * @return {Function}
 * @api private
 */

function show(type) {

  return function(text, delay) {

    if (!type || !text) {
      return;
    }

    for (var fl in flow) {
      if (flow.hasOwnProperty(fl)) {
        flow[fl].hide();
      }
    }

    var message = new Message(type, text, delay);
    flow[message.id] = message;
    message.show();

  };

}

/**
 * Module
 * @param {String} text
 * @param {String} type
 * @param {Number} delay
 * @api private
 */

function messg(text, type, delay) {

  if (!type || typeof type === 'number') {
    delay = type;
    type = DEFAULT_TYPE;
  }

  show(type)(text, delay);

}

/**
 * Set options
 * @param {String|Object} key
 * @param {Mixed} value
 * @api public
 */

messg.set = function(key, value) {

  if (typeof key === 'object') {
    for (var i in key) {
      if (key.hasOwnProperty(i)) {
        options[i] = key[i];
      }
    }
  } else if (value) {
    options[key] = value;
  }

};

/**
 * Show message via type
 * @param {String} text
 * @param {Number} delay
 * @api public
 */

for (var t = 0; t < types.length; t++) {
  messg[types[t]] = show(types[t]);
}

/**
 * Module exports
 */

module.exports = messg;
