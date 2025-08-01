# jsonp-node

nodejs jsonp parser

## parse

```js
parse('callback({ "name": "test", "age": 18 });');
parse('var user = { "name": "test", "age": 18 };');
parse('let user = { "name": "test", "age": 18 };');
parse('const user = { "name": "test", "age": 18 };');
```

## stringify

```js
stringify({ name: 'test', age: 18 }, 'handleData'); // handleData({"name":"test","age":18});
stringify({ name: 'test', age: 18 }, 'handleData', 'var'); // var handleData = {"name":"test","age":18};
stringify({ name: 'test', age: 18 }, 'handleData', 'var', false); // handleData = {"name":"test","age":18};
```

## [More Example](./test/index.test.ts)
