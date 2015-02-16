
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
 * Test element exist
 * @param  {String} type
 * @return {Object}
 * @api private
 */

function existElement(type) {

  var element = document.querySelector([
    '.',
    options.element,
    '-',
    type
  ].join(''));

  if (!element) {

    element = document.createElement('div');

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
      type
    ].join('');

    element.setAttribute('role', type);

    document.getElementsByTagName('body')[0].appendChild(element);

    element.onclick = function() {
      hide(this);
    };

  }

  return element;

}

/**
 * Hide message
 * @param {Object} element
 * @api private
 */

function hide(element) {

  element.style.opacity = '0.0';

  setTimeout(function() {
    element.style.display = 'none';
  }, options.speed);

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

    var elements = document.querySelectorAll('.' + options.element);

    for (var el = 0; el < elements.length; el++) {
      if (elements[el].getAttribute('role') !== type) {
        hide(elements[el]);
      }
    }

    var element = existElement(type);

    element.innerHTML = text.replace(/(<script.*>.*<\/script>)/gim, '');
    element.style.display = 'block';

    setTimeout(function() {
      element.style.opacity = '1.0';
    }, 50);

    if (delay) {

      setTimeout(function() {
        hide(element);
      }, delay + options.speed);

    }

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
