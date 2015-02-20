
var events = require('component/event');
var messg = require('andrepolischuk/messg@1.1.0');

events.bind(document.querySelector('.btn-default'), 'click', function(e) {
  messg('Close this by click');
}, false);

events.bind(document.querySelector('.btn-success'), 'click', function(e) {
  messg.success('Task completed', 3000);
}, false);

events.bind(document.querySelector('.btn-info'), 'click', function(e) {
  messg.info('You can try other').button('x');
}, false);

events.bind(document.querySelector('.btn-warning'), 'click', function(e) {
  messg.warning('Are you sure?').button('Yes', function() {
    alert('Yes');
  }).button('No', function() {
    alert('No');
  });
}, false);

events.bind(document.querySelector('.btn-danger'), 'click', function(e) {
  messg.error('Connection is lost').button('OK');
}, false);
