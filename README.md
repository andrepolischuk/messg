# Messg

  Messages via CSS3 animations

## Instalation

  Browser:

```html
<link href="https://cdn.rawgit.com/andrepolischuk/messg/1.0.0/messg.min.css" rel="stylesheet">
<script src="https://cdn.rawgit.com/andrepolischuk/messg/1.0.0/messg.min.js"></script>
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

### messg.set(key, value)

  Setting options

  * `element` - DOM element class, default `messg`
  * `speed` - show and hide speed (ms), default 250

## License

  MIT
