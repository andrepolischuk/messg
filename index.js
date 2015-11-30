'use strict';
var each = require('ea');
var eachReverse = require('each-reverse');
var flow = [];
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

each(types, function (type) {
  module.exports[type] = function (text, delay) {
    if (!text) return;
    return new Message(text, type, delay);
  };
});

function Message(text, type, delay) {
  if (!text) return;
  if (!(this instanceof Message)) return new Message(text, type, delay);
  this.delay = typeof type === 'number' ? type : delay;
  this.type = typeof type === 'string' ? type : types[0];
  this.text = text.replace(/(<script.*>.*<\/script>)/gim, '');
  this.element = document.createElement('div');
  this.element.innerHTML = template;
  this.element = this.element.children[0];
  this.element.className += ' ' + prefix + '-' + this.type;
  this.element.setAttribute('role', this.type);
  this.element.children[1].innerHTML = this.text;
  document.body.appendChild(this.element);
  this.element.style.opacity = '0.0';
  this.element.style.transition = 'all ' + Message.speed + 'ms ease-in-out';
  this.element.offsetWidth;

  if (!Message.flow || Message.max) {
    eachReverse(flow, function (message, i) {
      if (!Message.max || i <= flow.length - Message.max) message.hide();
    });
  }

  flow.push(this);
  this.hide = this.hide.bind(this);
  this.element.addEventListener('click', this.hide, false);
  this.show();
}

Message.prototype.show = function () {
  this.element.style.opacity = '1.0';
  Message.reposition();

  if (this.delay) {
    setTimeout(this.hide, this.delay + Message.speed);
  }

  return this;
};

Message.prototype.hide = function (fn) {
  if (typeof fn === 'function') {
    this.fn = fn;
    return this;
  }

  this.element.style.opacity = '0.0';
  if (this.fn) this.fn();
  flow.splice(flow.indexOf(this), 1);
  Message.reposition();

  setTimeout(function () {
    this.element.parentNode.removeChild(this.element);
  }.bind(this), Message.speed);
};

Message.prototype.button = function (name, fn) {
  var button = document.createElement('button');
  button.innerHTML = name;
  this.element.children[0].appendChild(button);
  this.element.removeEventListener('click', this.hide, false);
  Message.reposition();

  button.addEventListener('click', function () {
    if (typeof fn === 'function') fn(name.toLowerCase());
    this.hide();
  }.bind(this), false);

  return this;
};

Message.reposition = function () {
  var pos = margin;

  eachReverse(flow, function (message) {
    message.element.style[Message.position] = pos + 'px';
    pos += message.element.offsetHeight + margin;
  });
};

Message.clean = function () {
  eachReverse(flow, function (message) {
    message.hide();
  });
};
