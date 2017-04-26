'use strict'
var flow = []
var margin = 10
var prefix = 'messg'

var template = '<div class="' + prefix + '">' +
    '<div class="' + prefix + '__buttons"></div>' +
    '<div class="' + prefix + '__text"></div>' +
  '</div>'

module.exports = Message
module.exports.default = getMessageByType('default')
module.exports.success = getMessageByType('success')
module.exports.info = getMessageByType('info')
module.exports.warning = getMessageByType('warning')
module.exports.error = getMessageByType('error')

Message.speed = 250
Message.position = 'top'
Message.flow = true
Message.max = null
Message.delay = null

function Message (text, type, delay) {
  if (!text) return
  if (!(this instanceof Message)) return new Message(text, type, delay)
  this.delay = (typeof type === 'number' ? type : delay) || Message.delay
  this.type = typeof type === 'string' ? type : 'default'
  this.text = text.replace(/(<script.*>.*<\/script>)/gim, '')
  this.element = document.createElement('div')
  this.element.innerHTML = template
  this.element = this.element.children[0]
  this.element.className += ' ' + prefix + '--' + this.type

  if (/-/.test(Message.position)) {
    this.element.className += ' ' + prefix + '--' + Message.position.split(/-/)[1]
  }

  this.element.setAttribute('role', this.type)
  this.element.children[1].innerHTML = this.text
  document.body.appendChild(this.element)
  this.element.style.opacity = '0.0'
  this.element.style.transition = 'all ' + Message.speed + 'ms ease-in-out'
  this.element.offsetWidth // eslint-disable-line no-unused-expressions

  if (!Message.flow || Message.max) {
    flow.forEach(function (message, i) {
      if (!Message.max || i <= flow.length - Message.max) message.hide()
    })
  }

  flow.unshift(this)
  this.hide = this.hide.bind(this)
  this.element.addEventListener('click', this.hide, false)
  this.show()
}

Message.prototype.show = function () {
  this.element.style.opacity = '1.0'
  Message.reposition()

  if (this.delay) {
    setTimeout(this.hide, this.delay + Message.speed)
  }

  return this
}

Message.prototype.hide = function (fn) {
  if (typeof fn === 'function') {
    this.fn = fn
    return this
  }

  if (this.isHidden()) return
  this.element.style.opacity = '0.0'
  if (this.fn) this.fn()
  flow.splice(flow.indexOf(this), 1)
  Message.reposition()

  setTimeout(function () {
    this.element.parentNode.removeChild(this.element)
  }.bind(this), Message.speed)
}

Message.prototype.button = function (name, fn) {
  var button = document.createElement('button')
  button.innerHTML = name
  button.className = prefix + '__button'
  this.element.children[0].appendChild(button)
  this.element.removeEventListener('click', this.hide, false)

  button.addEventListener('click', function () {
    if (this.isHidden()) return
    if (typeof fn === 'function') fn(name.toLowerCase())
    this.hide()
  }.bind(this), false)

  return this
}

Message.prototype.isHidden = function () {
  return flow.indexOf(this) < 0
}

Message.reposition = function () {
  var top = margin
  var verticalPosition = Message.position.split(/-/)[0]

  flow.forEach(function (message) {
    message.element.style[verticalPosition] = top + 'px'
    top += message.element.offsetHeight + margin
  })
}

Message.clean = function () {
  flow.forEach(function (message) {
    message.hide()
  })
}

function getMessageByType (type) {
  return function (text, delay) {
    if (!text) return
    return new Message(text, type, delay)
  }
}
