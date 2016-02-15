# streamable-js

This is a JavaScript library for [Streamable's API](1).

It's meant to be minimalistic and uses [JavaScript promises](2) and [ECMAScript 6](3). Transpilation is done using Babel 6.

The package is available via NPM under the name `streamable-js`.

## Installation

	$ npm install --save streamable-js

## Usage

I plan on using the documentation generator called [Documentation](4), but there's still some issues with it, so for now all of the documentation is in the source code.

### Example

```javascript
import { Streamable } from 'streamable-js';

let s = new Streamable();

s.uploadVideo('my-video.mp4', 'My fancy video', resp => {
	console.log(`Uploaded to https://streamable.com/${resp.shortcode}`);
}, err => {
	console.error('Something went wrong!');
})
```

To use it, do `new Streamable()`. If you want to use it with HTTP basic access authentication, use `new AuthStreamable(user, pass)` instead.

## Development and pull requests

The source code lies in the "lib" directory. The uglified ES5 code lives in the "src" directory.

* Use tabs, not spaces.
* Document all public methods.
* Document all non-obvious private methods.
* Run `npm run dist` before committing

## TODO

See the project issues.

[1]: https://streamable.com/documentation
[2]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[3]: http://es6-features.org/
[4]: https://github.com/documentationjs/documentation/
