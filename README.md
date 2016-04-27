# streamable-js

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This is a JavaScript library for [Streamable's API](https://streamable.com/documentation).

It's meant to be minimalistic and uses [JavaScript promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) (implemented using [Bluebird](http://bluebirdjs.com/)) and [ECMAScript 6](http://es6-features.org/). Transpilation is done using Babel 6.

The package is available via NPM under the name `streamable-js`.

## Installation

    $ npm install --save streamable-js

## Usage

There is no formal documentation other than this README and the source code itself. Everything is pretty simple at this point, so most things should be obvious.

There are only two exported classes, `Streamable` and `AuthStreamable`.

### Example

```javascript
import { Streamable } from 'streamable-js'

const streamable = new Streamable()
streamable.uploadVideo('my-video.mp4', 'My fancy video').then((resp) => {
  console.log(`Uploaded to https://streamable.com/${resp.shortcode}`)
}).catch((err) => {
  console.error('Something went wrong: ${err}')
})
```

#### Authenticating

To use the library as an authenticated user, it's the same thing but with `AuthStreamable` instead. This also exposes one more method, `retrieveMe`, which retrieves information about the logged-in user.

```javascript
import { AuthStreamable } from './index'
import { open } from 'openurl'

const streamable = new AuthStreamable('<username>', '<password>')
streamable.importVideo('http://foobar.com/video.mp4', 'My example video').then((resp) => {
  open(`https://streamable.com/${resp.shortcode}`)
}).catch((err) => {
  console.error('Aw, shucks! ${err}')
})
```

#### Using ECMAScript 5

You can use this library with ECMAScript 5, in fact if you install it using `npm`, you are getting the ECMAScript 5 version of the code.

If you use ECMAScript 5, remember that you are requiring the *module*, not the class itself. Therefore, you do something like this:

```javascript
var Streamable = require('streamable-js')
var client = new Streamable.Streamable()
```
