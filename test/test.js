
var messg = require('..');
var assert = require('assert');

describe('messg', function() {
  it('should return function', function() {
    assert(typeof messg === 'function');
  });

  it('should contain props', function() {
    assert(messg.speed);
    assert(messg.position);
    assert(messg.flow);
  });

  it('should contain methods', function() {
    assert(typeof messg.set === 'function');
    assert(typeof messg.default === 'function');
    assert(typeof messg.success === 'function');
    assert(typeof messg.info === 'function');
    assert(typeof messg.warning === 'function');
    assert(typeof messg.error === 'function');
  });
});

describe('messg(text)', function() {
  var message = messg('Default message');
  message.element.style.display = 'none';
  message.element.style.visibility = 'hidden';

  it('should return object', function() {
    assert(typeof message === 'object');
  });

  it('should contain props', function() {
    assert(message.id);
    assert(message.text === 'Default message');
    assert(message.type === 'default');
    assert(message.element);
  });

  it('should contain methods', function() {
    assert(typeof message.show === 'function');
    assert(typeof message.hide === 'function');
    assert(typeof message.button === 'function');
  });
});

describe('messg.info(text)', function() {
  var message = messg.info('Info message');
  message.element.style.display = 'none';
  message.element.style.visibility = 'hidden';

  it('should return object', function() {
    assert(typeof message === 'object');
  });

  it('should contain props', function() {
    assert(message.id);
    assert(message.text === 'Info message');
    assert(message.type === 'info');
    assert(message.element);
  });

  it('should contain methods', function() {
    assert(typeof message.show === 'function');
    assert(typeof message.hide === 'function');
    assert(typeof message.button === 'function');
  });
});
