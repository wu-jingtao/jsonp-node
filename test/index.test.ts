import expect = require('expect.js');

import JSONP = require('../src');

it('Test parse', function () {
    const data = 'callbackName({"a":1,"b":"abc"})';
    expect(JSONP.parse(data, 'callbackName')).to.be.eql({ a: 1, b: "abc" });
});

it('Test stringify', function () {
    const data = 'callbackName({"a":1,"b":"abc"})';
    expect(JSONP.stringify({ a: 1, b: "abc" }, 'callbackName')).to.be(data);
});

it('Test parse_var', function () {
    const data1 = 'varName={"a":1,"b":"abc"}';
    const data2 = 'var varName={"a":1,"b":"abc"}';

    expect(JSONP.parse_var(data1, 'varName', true)).to.be.eql({ a: 1, b: "abc" });
    expect(JSONP.parse_var(data2, 'varName', false)).to.be.eql({ a: 1, b: "abc" });
});

it('Test stringify_var', function () {
    const data1 = 'varName={"a":1,"b":"abc"}';
    const data2 = 'var varName={"a":1,"b":"abc"}';

    expect(JSONP.stringify_var({ a: 1, b: "abc" }, 'varName', true)).to.be(data1);
    expect(JSONP.stringify_var({ a: 1, b: "abc" }, 'varName', false)).to.be(data2);
});