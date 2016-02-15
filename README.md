# streamable-js

This is a JavaScript library for [Streamable's API](1).

It's meant to be minimalistic and uses [JavaScript promises](2) and [ECMAScript 6](3). Transpilation is done using Babel 6.

The package is available via NPM under the name `streamable-js`.

## Installation

	$ npm install --save streamable-js

## Usage

I plan on using the documentation generator called [Documentation](4), but there's still some issues with it, so for now all of the documentation is in the source code.

There are only two exported classes, `Streamable` and `AuthStreamable`.

### Example

```javascript
import { Streamable } from 'streamable-js';

let s = new Streamable();

s.uploadVideo('my-video.mp4', 'My fancy video').then(resp => {
	console.log(`Uploaded to https://streamable.com/${resp.shortcode}`);
}, err => {
	console.error('Something went wrong!');
})
```

#### Authenticating

To use the library as an authenticated user, it's the same thing but with `AuthStreamable` instead:

```javascript
import { AuthStreamable } from 'streamable-js';

let s = new AuthStreamable(username, password);
```

This also exposes one more method, `retrieveMe`, which retrieves information about the logged-in user.

#### Using ECMAScript 5

If you use ECMAScript 5 and `require` from CommonJS, remember that you are importing the *module*, not the class itself. Therefore, you'd have to do something like this:

```javascript
var Streamable = require('streamable-js');
var client = new Streamable.Streamable();
```

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
