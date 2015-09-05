import messg from 'messg';
const btnDefault = document.querySelector('.btn-default');
const btnSuccess = document.querySelector('.btn-success');
const btnInfo = document.querySelector('.btn-info');
const btnWarning = document.querySelector('.btn-warning');
const btnDanger = document.querySelector('.btn-danger');
const btnDelay = document.querySelector('.btn-delay');
const btnX = document.querySelector('.btn-x');
const btnOk = document.querySelector('.btn-ok');
const btnYesNo = document.querySelector('.btn-yes-no');

btnDefault.addEventListener('click', () => {
  messg('Close this by click');
}, false);

btnSuccess.addEventListener('click', () => {
  messg.success('Close this by click');
}, false);

btnInfo.addEventListener('click', () => {
  messg.info('Close this by click');
}, false);

btnWarning.addEventListener('click', () => {
  messg.warning('Close this by click');
}, false);

btnDanger.addEventListener('click', () => {
  messg.error('Close this by click');
}, false);

btnDelay.addEventListener('click', () => {
  messg.success('Task completed', 3000);
}, false);

btnX.addEventListener('click', () => {
  messg
    .info('You can try other')
    .button('x');
}, false);

btnOk.addEventListener('click', () => {
  messg
    .error('Connection is lost')
    .button('OK');
}, false);

btnYesNo.addEventListener('click', () => {
  messg
    .warning('Are you sure?')
    .button('Yes', () => {
      messg.warning('You say "Yes"', 5000);
    }).button('No', () => {
      messg.warning('You say "No"', 5000);
    });
}, false);
