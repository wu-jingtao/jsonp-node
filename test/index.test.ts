import expect from 'expect.js';
import JSONP from '../src';

it('测试 parse', function () {
    expect(JSONP.parse('callbackName(1)')).to.be(1);
    expect(JSONP.parse('callbackName("string")')).to.be('string');
    expect(JSONP.parse('callbackName(true)')).to.be(true);
    expect(JSONP.parse('callbackName(null)')).to.be(null);
    expect(JSONP.parse('callbackName({"a":1,"b":"abc"})')).to.be.eql({ a: 1, b: 'abc' });
    expect(JSONP.parse(' callbackName ( { "a": 1, "b": "abc" } ) ')).to.be.eql({ a: 1, b: 'abc' });

    expect(JSONP.parse('callbackName([1, \'2\', true, null])', false)).to.be.eql([1, '2', true, null]);
    expect(JSONP.parse('callbackName({a: 1, b: \'abc\'})', false)).to.be.eql({ a: 1, b: 'abc' });
    expect(JSONP.parse(' callbackName ( { a: 1, b: \'abc\' } ) ; ', false)).to.be.eql({ a: 1, b: 'abc' });
});

it('测试 stringify', function () {
    expect(JSONP.stringify({ a: 1, b: 'abc' }, 'callbackName')).to.be('callbackName({"a":1,"b":"abc"});');
});

it('测试 parse_var', function () {
    expect(JSONP.parse_var('varName=1')).to.be(1);
    expect(JSONP.parse_var('varName="string"')).to.be('string');
    expect(JSONP.parse_var('varName=true')).to.be(true);
    expect(JSONP.parse_var('varName=null')).to.be(null);
    expect(JSONP.parse_var('varName={"a":1,"b":"abc"}')).to.be.eql({ a: 1, b: 'abc' });
    expect(JSONP.parse_var(' varName = { "a": 1, "b": "abc" } ; ')).to.be.eql({ a: 1, b: 'abc' });

    expect(JSONP.parse_var('var varName={"a":1,"b":"abc"}')).to.be.eql({ a: 1, b: 'abc' });
    expect(JSONP.parse_var('let varName={"a":1,"b":"abc"}')).to.be.eql({ a: 1, b: 'abc' });
    expect(JSONP.parse_var('const varName={"a":1,"b":"abc"}')).to.be.eql({ a: 1, b: 'abc' });

    expect(JSONP.parse_var('varName=[1, \'2\', true, null]', false)).to.be.eql([1, '2', true, null]);
    expect(JSONP.parse_var('var varName={a: 1, b: \'abc\'}', false)).to.be.eql({ a: 1, b: 'abc' });
    expect(JSONP.parse_var('var varName = { a: 1, b: \'abc\' } ; ', false)).to.be.eql({ a: 1, b: 'abc' });

    expect(JSONP.parse_var).withArgs('{"a":1,"b":"abc"}').throwError(err => {
        expect(err.message).to.be('data format error');
    });
});

it('测试 stringify_var', function () {
    expect(JSONP.stringify_var({ a: 1, b: 'abc' }, 'varName', true)).to.be('varName={"a":1,"b":"abc"};');
    expect(JSONP.stringify_var({ a: 1, b: 'abc' }, 'varName', false)).to.be('var varName={"a":1,"b":"abc"};');
});
