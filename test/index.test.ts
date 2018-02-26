import expect = require('expect.js');

import jsonp_parser = require('../src');

it('测试', function () {
    const data = 'callback({"a":1,"b":"abc"})';
    expect(jsonp_parser(data, 'callback')).to.be.eql({ a: 1, b: "abc" });
});