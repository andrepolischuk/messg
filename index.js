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
    if (!self.element.children[0].children.length) {
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
