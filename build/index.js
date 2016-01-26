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
    _messg2['default'].success('You say "Yes"', 5000);
  }).button('No', function () {
    _messg2['default'].error('You say "No"', 5000);
  });
}, false);

},{"messg":2}],2:[function(require,module,exports){
'use strict';
var flow = [];
var margin = 10;
var prefix = 'messg';

var template = '<div class="' + prefix + '">' +
    '<div class="' + prefix + '__buttons"></div>' +
    '<div class="' + prefix + '__text"></div>' +
  '</div>';

module.exports = Message;
module.exports.default = getMessageByType('default');
module.exports.success = getMessageByType('success');
module.exports.info = getMessageByType('info');
module.exports.warning = getMessageByType('warning');
module.exports.error = getMessageByType('error');
Message.speed = 250;
Message.position = 'top';
Message.flow = true;

function Message(text, type, delay) {
  if (!text) return;
  if (!(this instanceof Message)) return new Message(text, type, delay);
  this.delay = typeof type === 'number' ? type : delay;
  this.type = typeof type === 'string' ? type : 'default';
  this.text = text.replace(/(<script.*>.*<\/script>)/gim, '');
  this.element = document.createElement('div');
  this.element.innerHTML = template;
  this.element = this.element.children[0];
  this.element.className += ' ' + prefix + '--' + this.type;
  this.element.setAttribute('role', this.type);
  this.element.children[1].innerHTML = this.text;
  document.body.appendChild(this.element);
  this.element.style.opacity = '0.0';
  this.element.style.transition = 'all ' + Message.speed + 'ms ease-in-out';
  this.element.offsetWidth;

  if (!Message.flow || Message.max) {
    flow.forEach(function (message, i) {
      if (!Message.max || i <= flow.length - Message.max) message.hide();
    });
  }

  flow.unshift(this);
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

  if (this.isHidden()) return;
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
  button.className = prefix + '__button';
  this.element.children[0].appendChild(button);
  this.element.removeEventListener('click', this.hide, false);

  button.addEventListener('click', function () {
    if (this.isHidden()) return;
    if (typeof fn === 'function') fn(name.toLowerCase());
    this.hide();
  }.bind(this), false);

  return this;
};

Message.prototype.isHidden = function () {
  return flow.indexOf(this) < 0;
};

Message.reposition = function () {
  var pos = margin;

  flow.forEach(function (message) {
    message.element.style[Message.position] = pos + 'px';
    pos += message.element.offsetHeight + margin;
  });
};

Message.clean = function () {
  flow.forEach(function (message) {
    message.hide();
  });
};

function getMessageByType(type) {
  return function (text, delay) {
    if (!text) return;
    return new Message(text, type, delay);
  };
}

},{}]},{},[1]);
