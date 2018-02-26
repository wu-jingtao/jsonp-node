# jsonp-node
nodejs jsonp

## parse
```javascript
const JSONP = require('jsonp-node');

const data = 'callbackName({"a":1,"b":"abc"})';

const result = JSONP.parse(data, 'callbackName');
```

## stringify
```javascript
const JSONP = require('jsonp-node');

const data = { a: 1, b: "abc" };

const result = JSONP.stringify(data, 'callbackName');
```