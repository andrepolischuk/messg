# messg

> Messages via CSS3 animations

## Install

```sh
npm install --save messg
```

## Usage

```js
var messg = require('messg');

messg
  .success('Awesome!')
  .button('Ok');
```

## API

### messg(text[, type, delay])

Create `Message` instance with specified `text` and `type`.
Аutohide timeout is specified via `delay` parameter.

#### Types:

* default
* success
* info
* warning
* error

### messg.default(text[, delay])
### messg.success(text[, delay])
### messg.info(text[, delay])
### messg.warning(text[, delay])
### messg.error(text[, delay])

Aliases for `messg(text[, type, delay])`

```js
messg.warning('Connection is lost');
messg.success('Task completed', 2500);
```

### .button(name[, fn])

Add buttons with handler

```js
messg
  .warning('Are you sure?')
  .button('Yes', function() {

  })
  .button('No', function() {

  });
```

Add simple close button

```js
messg
  .success('Task completed')
  .button('Ok');
```

If buttons not specified, close message by clicking on it

### .hide(fn)

Add hide handler

```js
messg
  .warning('Hello!')
  .hide(function() {

  });
```

### messg.clean()

Close all messages in flow

## Options

* `messg.speed` — show and hide speed (ms), default `250`
* `messg.position` — messages position `top` or `bottom`, default `top`
* `messg.flow` — disable messages flow if `false`
* `messg.max` — max flow length, default `false`

## License

MIT
