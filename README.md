# jsonp-parser


## parse
```javascript
const JSONP = require('jsonp-parser');

const data = 'callbackName({"a":1,"b":"abc"})';

const result = JSONP.parse(data, 'callbackName');
```

## stringify
```javascript
const JSONP = require('jsonp-parser');

const data = { a: 1, b: "abc" };

const result = JSONP.stringify(data, 'callbackName');
```