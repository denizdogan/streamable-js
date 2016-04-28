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

### Example usage

This will upload the local file "my-video.mp4" titled "My video" on Streamable, wait for the video processing to complete, then print the video status.

```javascript
import { Streamable, STATUS_CODE } from 'streamable-js'

const streamable = new Streamable()
streamable.uploadVideo('my-video.mp4', 'My video').then((resp) =>
  streamable.waitFor(resp.shortcode, STATUS_CODE.READY)
).then((resp) =>
  console.log(resp)
)
```

#### Authenticating

To use the library as an authenticated Streamable user, do everything exactly the same, but with the `AuthStreamable` class. This also exposes one more method, `retrieveMe`, which retrieves information about the logged-in user.

```javascript
import { AuthStreamable } from 'streamable-js'
```

##### OAuth2

There is currently no support for OAuth2. Pull requests are welcome!
