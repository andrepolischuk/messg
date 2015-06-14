
'use strict';

var events = require('component-event');
var messg = require('messg');

events.bind(document.querySelector('.btn-default'), 'click', function(e) {
  messg('Close this by click');
}, false);

events.bind(document.querySelector('.btn-success'), 'click', function(e) {
  messg.success('Close this by click');
}, false);

events.bind(document.querySelector('.btn-info'), 'click', function(e) {
  messg.info('Close this by click');
}, false);

events.bind(document.querySelector('.btn-warning'), 'click', function(e) {
  messg.warning('Close this by click');
}, false);

events.bind(document.querySelector('.btn-danger'), 'click', function(e) {
  messg.error('Close this by click');
}, false);

events.bind(document.querySelector('.btn-delay'), 'click', function(e) {
  messg.success('Task completed', 3000);
}, false);

events.bind(document.querySelector('.btn-x'), 'click', function(e) {
  messg
    .info('You can try other')
    .button('x');
}, false);

events.bind(document.querySelector('.btn-ok'), 'click', function(e) {
  messg
    .error('Connection is lost')
    .button('OK');
}, false);

events.bind(document.querySelector('.btn-yes-no'), 'click', function(e) {
  messg
    .warning('Are you sure?')
    .button('Yes', function() {
      messg.info('Yes', 5000);
    }).button('No', function() {
      messg.info('No', 5000);
    });
}, false);
