# streamable-js

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This is a JavaScript library for [Streamable's API](https://streamable.com/documentation).

It's meant to be minimalistic and uses [JavaScript promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) (implemented using [Bluebird](http://bluebirdjs.com/)) and [ECMAScript 6](http://es6-features.org/). Transpilation is done using Babel 6.

The package is available via NPM under the name `streamable-js`.

## Installation

    $ npm install --save streamable-js

## Usage

I plan on using the documentation generator called [Documentation](https://github.com/documentationjs/documentation/), but there's still some issues with it, so for now all of the documentation is in the source code.

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

If you use ECMAScript 5 and `require` from CommonJS, remember that you are importing the *module*, not the class itself. Therefore, you'd have to do something like this:

```javascript
var Streamable = require('streamable-js')
var client = new Streamable.Streamable()
```
