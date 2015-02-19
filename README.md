# Messg

  Messages via CSS3 animations

## Instalation

  Browser:

```html
<link href="https://cdn.rawgit.com/andrepolischuk/messg/1.1.0/dist/messg.min.css" rel="stylesheet">
<script src="https://cdn.rawgit.com/andrepolischuk/messg/1.1.0/dist/messg.min.js"></script>
```

  Component(1):

```sh
$ component install andrepolischuk/messg
```

  Npm:

```sh
$ npm install messg
```

## API

### messg(text[, type, delay])

  Show message with specified `text` and `type`.
  Аutohide timeout is specified via `delay` parameter.

  Possible types:

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

### messg.set(key, value)

  Setting options

  * `speed` - show and hide speed (ms), default `250`
  * `position` - messages position `top` or `bottom`, default `top`
  * `flow` - disable messages flow if `false`

### messg.button(name[, fn])

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

## License

  MIT
