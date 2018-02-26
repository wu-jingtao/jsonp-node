import expect = require('expect.js');

import JSONP = require('../src');

it('测试 parse', function () {
    const data = 'callbackName({"a":1,"b":"abc"})';
    expect(JSONP.parse(data, 'callbackName')).to.be.eql({ a: 1, b: "abc" });
});

it('测试 stringify', function () {
    const data = 'callbackName({"a":1,"b":"abc"})';
    expect(JSONP.stringify({ a: 1, b: "abc" }, 'callbackName')).to.be(data);
});