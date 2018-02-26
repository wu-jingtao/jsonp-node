# jsonp-parser
nodejs jsonp parser

```javascript
const jsonp_parser = require('jsonp-parser');

const data = 'callbackName({"a":1,"b":"abc"})';

const result = jsonp_parser(data, 'callbackName');
```