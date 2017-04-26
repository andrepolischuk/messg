# messg [![Build Status][travis-image]][travis-url]

> Messages via CSS3 animations

![](screenshot.png)

## Install

```sh
npm install --save messg
```

## Usage

```js
import messg from 'messg';

messg
  .success('Awesome!')
  .button('Ok');
```

## API

### messg(text[, type, delay])

Create `Message` instance.

#### text

Type: `string`

Message text.

#### type

Type: `string`  
Default: `'default'`

Message type:

* default
* success
* info
* warning
* error

#### delay

Type: `number`  
Default: `null`

Аutohide timeout.

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

Add button.

#### name

Type: `string`

Button title.

#### fn

Type: `function`

Handler for click on the button.

Buttons with handler:

```js
messg
  .warning('Are you sure?')
  .button('Yes', () => {

  })
  .button('No', () => {

  });
```

Simple close button:

```js
messg
  .success('Task completed')
  .button('Ok');
```

If buttons not specified, close message by clicking on it.

### .hide(fn)

Add hide handler.

#### fn

Type: `function`

Handler for hide the message.

```js
messg
  .warning('Hello!')
  .hide(() => {

  });
```

### messg.clean()

Close all messages in flow.

## Options

### messg.speed

Show and hide speed (ms), default `250`.

### messg.position

Messages position:

* `top` — default
* `top-left`
* `top-right`
* `bottom`
* `bottom-left`
* `bottom-right`

### messg.flow

Disable messages flow if `false`.

### messg.max

Max flow length, default `false`.

### messg.delay

Global delay for all messages, default `null`.

## License

MIT

[travis-url]: https://travis-ci.org/andrepolischuk/messg
[travis-image]: https://travis-ci.org/andrepolischuk/messg.svg?branch=master
