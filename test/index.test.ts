/* eslint-disable max-lines-per-function */

import expect from 'expect.js';
import { parse, stringify } from '../src';

describe('测试 parse', () => {
    describe('测试 回调函数式 JSONP', () => {
        describe('测试 解析对象', function () {
            it('测试 解析 JSON', function () {
                expect(parse('callback({ "name": "test", "age": 18 });')).to.eql({ name: 'test', age: 18 });
            });

            it('测试 解析 JSON5', function () {
                expect(parse('callback({ name: "test", age: 18 });', true)).to.eql({ name: 'test', age: 18 });
            });
        });

        describe('测试 解析数组', function () {
            it('测试 解析 JSON', function () {
                expect(parse('callback([{ "name": "test", "age": 18 }]);')).to.eql([{ name: 'test', age: 18 }]);
            });

            it('测试 解析 JSON5', function () {
                expect(parse('callback([{ name: "test", age: 18 }]);', true)).to.eql([{ name: 'test', age: 18 }]);
            });
        });

        describe('测试 解析字面量', function () {
            it('测试 解析字符串', () => {
                expect(parse('showMessage("hello world");')).to.be('hello world');
            });

            it('测试 解析数字', () => {
                expect(parse('count(123.45);')).to.be(123.45);
            });

            it('测试 解析布尔', () => {
                expect(parse('is(true);')).to.be(true);
            });

            it('测试 解析 null', () => {
                expect(parse('handleNull(null);')).to.be(null);
            });
        });

        describe('测试 忽略注释', function () {
            it('测试 行内注释', () => {
                expect(parse('callback({ "name": "test" }); // 行注释', undefined, true)).to.eql({ name: 'test' });
                expect(parse('callback({ "name": "test" });// 行注释', undefined, true)).to.eql({ name: 'test' });
                expect(parse('callback({ "name": "test" });//行注释', undefined, true)).to.eql({ name: 'test' });
            });

            it('测试 开头的块注释', () => {
                expect(parse('/* 注释 */ callback({ "name": "test" });', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/* 注释 */callback({ "name": "test" });', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/* 注释*/callback({ "name": "test" });', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/*注释*/callback({ "name": "test" });', undefined, true)).to.eql({ name: 'test' });
            });

            it('测试 结尾的块注释', () => {
                expect(parse('callback({ "name": "test" }); /* 注释 */', undefined, true)).to.eql({ name: 'test' });
                expect(parse('callback({ "name": "test" });/* 注释 */', undefined, true)).to.eql({ name: 'test' });
                expect(parse('callback({ "name": "test" });/*注释 */', undefined, true)).to.eql({ name: 'test' });
                expect(parse('callback({ "name": "test" });/*注释*/', undefined, true)).to.eql({ name: 'test' });
            });

            it('测试 夹杂在数据之间的块注释', () => {
                expect(parse('callback( /* 注释 */ { "name": "test" } /* 注释 */ );', undefined, true)).to.eql({ name: 'test' });
                expect(parse('callback(/* 注释 */{ "name": "test" }/* 注释 */);', undefined, true)).to.eql({ name: 'test' });
            });

            it('测试 开头与结尾的块注释', () => {
                expect(parse(`
                    /* 注释 */
                    callback({ "name": "test" });
                    /* 注释 */
                `, undefined, true)).to.eql({ name: 'test' });
            });

            it('测试 注释中包含 JSONP 数据', () => {
                expect(parse(`
                    // callback({ "name": "test1" });
                    /* callback({ "name": "test2" }); */
                    callback({ "name": "test3" });
                    /* callback({ "name": "test4" }); */
                `, undefined, true)).to.eql({ name: 'test3' });
            });

            it('测试 JSON5 数据中包含注释', () => {
                expect(parse(`
                    callback({ 
                        /* 注释 */
                        name: "test" // 注释
                        /* 注释 */
                    });
                `, true)).to.eql({ name: 'test' });
            });
        });

        it('测试 字符串中包含注释', function () {
            expect(parse('showMessage("123 // hello world");', undefined, true)).to.be('123 // hello world');
            expect(parse('showMessage("123 /* hello world */");', undefined, true)).to.be('123 /* hello world */');
        });

        it('测试 字符串中包含函数', function () {
            expect(parse('showMessage("function a123({ \\"name\\": \\"test\\", \\"age\\": 18 })");', undefined, true)).to.be('function a123({ "name": "test", "age": 18 })');
            expect(parse('showMessage("function a123({ \\"name\\": \\"test\\", \\"age\\": 18 });");', undefined, true)).to.be('function a123({ "name": "test", "age": 18 });');
        });

        it('测试 结尾包含多个分号', function () {
            expect(parse('callback({ "name": "test", "age": 18 })')).to.eql({ name: 'test', age: 18 });
            expect(parse('callback({ "name": "test", "age": 18 }) ')).to.eql({ name: 'test', age: 18 });

            expect(parse('callback({ "name": "test", "age": 18 });')).to.eql({ name: 'test', age: 18 });
            expect(parse('callback({ "name": "test", "age": 18 }); ')).to.eql({ name: 'test', age: 18 });

            expect(parse('callback({ "name": "test", "age": 18 }); ;  ;  ;')).to.eql({ name: 'test', age: 18 });
            expect(parse('callback({ "name": "test", "age": 18 }); ;  ;  ; ')).to.eql({ name: 'test', age: 18 });
        });

        describe('测试 数据被多个括号包裹', function () {
            it('测试 解析 JSON', function () {
                expect(parse('callback(( (  (   ("test")   )  ) ));')).to.be('test');
                expect(parse('callback(( (  (   ({ "name": "test", "age": 18 })   )  ) ));')).to.eql({ name: 'test', age: 18 });
                expect(parse('callback(( (  (   ([{ "name": "test", "age": 18 }])   )  ) ));')).to.eql([{ name: 'test', age: 18 }]);
            });

            it('测试 解析 JSON5', function () {
                expect(parse('callback(( (  (   ("test")   )  ) ));')).to.be('test');
                expect(parse('callback(( (  (   ({ name: "test", age: 18 })   )  ) ));', true)).to.eql({ name: 'test', age: 18 });
                expect(parse('callback(( (  (   ([{ name: "test", age: 18 }])   )  ) ));', true)).to.eql([{ name: 'test', age: 18 }]);
            });
        });
    });

    describe('测试 变量式 JSONP', () => {
        describe('测试 解析对象', function () {
            it('测试 解析 JSON', function () {
                expect(parse('var user = { "name": "test", "age": 18 };')).to.eql({ name: 'test', age: 18 });
                expect(parse('let user = { "name": "test", "age": 18 };')).to.eql({ name: 'test', age: 18 });
                expect(parse('const user = { "name": "test", "age": 18 };')).to.eql({ name: 'test', age: 18 });

                expect(parse('var user ={ "name": "test", "age": 18 };')).to.eql({ name: 'test', age: 18 });
                expect(parse('var user= { "name": "test", "age": 18 };')).to.eql({ name: 'test', age: 18 });
                expect(parse('var user={ "name": "test", "age": 18 };')).to.eql({ name: 'test', age: 18 });

                expect(parse('user ={ "name": "test", "age": 18 };')).to.eql({ name: 'test', age: 18 });
                expect(parse('user= { "name": "test", "age": 18 };')).to.eql({ name: 'test', age: 18 });
                expect(parse('user={ "name": "test", "age": 18 };')).to.eql({ name: 'test', age: 18 });
            });

            it('测试 解析 JSON5', function () {
                expect(parse('var user = { name: "test", age: 18 };', true)).to.eql({ name: 'test', age: 18 });
                expect(parse('let user = { name: "test", age: 18 };', true)).to.eql({ name: 'test', age: 18 });
                expect(parse('const user = { name: "test", age: 18 };', true)).to.eql({ name: 'test', age: 18 });

                expect(parse('var user ={ name: "test", age: 18 };', true)).to.eql({ name: 'test', age: 18 });
                expect(parse('var user= { name: "test", age: 18 };', true)).to.eql({ name: 'test', age: 18 });
                expect(parse('var user={ name: "test", age: 18 };', true)).to.eql({ name: 'test', age: 18 });

                expect(parse('user ={ name: "test", age: 18 };', true)).to.eql({ name: 'test', age: 18 });
                expect(parse('user= { name: "test", age: 18 };', true)).to.eql({ name: 'test', age: 18 });
                expect(parse('user={ name: "test", age: 18 };', true)).to.eql({ name: 'test', age: 18 });
            });
        });

        describe('测试 解析数组', function () {
            it('测试 解析 JSON', function () {
                expect(parse('var user = [{ "name": "test", "age": 18 }];')).to.eql([{ name: 'test', age: 18 }]);
                expect(parse('let user = [{ "name": "test", "age": 18 }];')).to.eql([{ name: 'test', age: 18 }]);
                expect(parse('const user = [{ "name": "test", "age": 18 }];')).to.eql([{ name: 'test', age: 18 }]);

                expect(parse('var user =[{ "name": "test", "age": 18 }];')).to.eql([{ name: 'test', age: 18 }]);
                expect(parse('var user= [{ "name": "test", "age": 18 }];')).to.eql([{ name: 'test', age: 18 }]);
                expect(parse('var user=[{ "name": "test", "age": 18 }];')).to.eql([{ name: 'test', age: 18 }]);

                expect(parse('user =[{ "name": "test", "age": 18 }];')).to.eql([{ name: 'test', age: 18 }]);
                expect(parse('user= [{ "name": "test", "age": 18 }];')).to.eql([{ name: 'test', age: 18 }]);
                expect(parse('user=[{ "name": "test", "age": 18 }];')).to.eql([{ name: 'test', age: 18 }]);
            });

            it('测试 解析 JSON5', function () {
                expect(parse('var user = [{ name: "test", age: 18 }];', true)).to.eql([{ name: 'test', age: 18 }]);
                expect(parse('let user = [{ name: "test", age: 18 }];', true)).to.eql([{ name: 'test', age: 18 }]);
                expect(parse('const user = [{ name: "test", age: 18 }];', true)).to.eql([{ name: 'test', age: 18 }]);

                expect(parse('var user =[{ name: "test", age: 18 }];', true)).to.eql([{ name: 'test', age: 18 }]);
                expect(parse('var user= [{ name: "test", age: 18 }];', true)).to.eql([{ name: 'test', age: 18 }]);
                expect(parse('var user=[{ name: "test", age: 18 }];', true)).to.eql([{ name: 'test', age: 18 }]);

                expect(parse('user =[{ name: "test", age: 18 }];', true)).to.eql([{ name: 'test', age: 18 }]);
                expect(parse('user= [{ name: "test", age: 18 }];', true)).to.eql([{ name: 'test', age: 18 }]);
                expect(parse('user=[{ name: "test", age: 18 }];', true)).to.eql([{ name: 'test', age: 18 }]);
            });
        });

        describe('测试 解析字面量', function () {
            it('测试 解析字符串', () => {
                expect(parse('var message = "hello world";')).to.be('hello world');
                expect(parse('let message = "hello world";')).to.be('hello world');
                expect(parse('const message = "hello world";')).to.be('hello world');

                expect(parse('var message ="hello world";')).to.be('hello world');
                expect(parse('var message= "hello world";')).to.be('hello world');
                expect(parse('var message="hello world";')).to.be('hello world');

                expect(parse('message ="hello world";')).to.be('hello world');
                expect(parse('message= "hello world";')).to.be('hello world');
                expect(parse('message="hello world";')).to.be('hello world');
            });

            it('测试 解析数字', () => {
                expect(parse('var count = 123.45;')).to.be(123.45);
                expect(parse('let count = 123.45;')).to.be(123.45);
                expect(parse('const count = 123.45;')).to.be(123.45);

                expect(parse('var count =123.45;')).to.be(123.45);
                expect(parse('var count= 123.45;')).to.be(123.45);
                expect(parse('var count=123.45;')).to.be(123.45);

                expect(parse('count =123.45;')).to.be(123.45);
                expect(parse('count= 123.45;')).to.be(123.45);
                expect(parse('count=123.45;')).to.be(123.45);
            });

            it('测试 解析布尔', () => {
                expect(parse('var is = true;')).to.be(true);
                expect(parse('let is = true;')).to.be(true);
                expect(parse('const is = true;')).to.be(true);

                expect(parse('var is =true;')).to.be(true);
                expect(parse('var is= true;')).to.be(true);
                expect(parse('var is=true;')).to.be(true);

                expect(parse('is =true;')).to.be(true);
                expect(parse('is= true;')).to.be(true);
                expect(parse('is=true;')).to.be(true);
            });

            it('测试 解析 null', () => {
                expect(parse('var handleNull = null;')).to.be(null);
                expect(parse('let handleNull = null;')).to.be(null);
                expect(parse('const handleNull = null;')).to.be(null);

                expect(parse('var handleNull =null;')).to.be(null);
                expect(parse('var handleNull= null;')).to.be(null);
                expect(parse('var handleNull=null;')).to.be(null);

                expect(parse('handleNull =null;')).to.be(null);
                expect(parse('handleNull= null;')).to.be(null);
                expect(parse('handleNull=null;')).to.be(null);
            });
        });

        describe('测试 忽略注释', function () {
            it('测试 行内注释', () => {
                expect(parse('var user = { "name": "test" }; // 行注释', undefined, true)).to.eql({ name: 'test' });
                expect(parse('var user = { "name": "test" };// 行注释', undefined, true)).to.eql({ name: 'test' });
                expect(parse('var user = { "name": "test" };//行注释', undefined, true)).to.eql({ name: 'test' });

                expect(parse('var user={ "name": "test" }; // 行注释', undefined, true)).to.eql({ name: 'test' });
                expect(parse('var user={ "name": "test" };// 行注释', undefined, true)).to.eql({ name: 'test' });
                expect(parse('var user={ "name": "test" };//行注释', undefined, true)).to.eql({ name: 'test' });

                expect(parse('user = { "name": "test" }; // 行注释', undefined, true)).to.eql({ name: 'test' });
                expect(parse('user = { "name": "test" };// 行注释', undefined, true)).to.eql({ name: 'test' });
                expect(parse('user = { "name": "test" };//行注释', undefined, true)).to.eql({ name: 'test' });

                expect(parse('user={ "name": "test" }; // 行注释', undefined, true)).to.eql({ name: 'test' });
                expect(parse('user={ "name": "test" };// 行注释', undefined, true)).to.eql({ name: 'test' });
                expect(parse('user={ "name": "test" };//行注释', undefined, true)).to.eql({ name: 'test' });
            });

            it('测试 开头的块注释', () => {
                expect(parse('/* 注释 */ var user = { "name": "test" };', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/* 注释 */var user = { "name": "test" };', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/* 注释*/var user = { "name": "test" };', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/*注释*/var user = { "name": "test" };', undefined, true)).to.eql({ name: 'test' });

                expect(parse('/* 注释 */ var user={ "name": "test" };', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/* 注释 */var user={ "name": "test" };', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/* 注释*/var user={ "name": "test" };', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/*注释*/var user={ "name": "test" };', undefined, true)).to.eql({ name: 'test' });

                expect(parse('/* 注释 */ user = { "name": "test" };', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/* 注释 */user = { "name": "test" };', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/* 注释*/user = { "name": "test" };', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/*注释*/user = { "name": "test" };', undefined, true)).to.eql({ name: 'test' });

                expect(parse('/* 注释 */ user={ "name": "test" };', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/* 注释 */user={ "name": "test" };', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/* 注释*/user={ "name": "test" };', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/*注释*/user={ "name": "test" };', undefined, true)).to.eql({ name: 'test' });
            });

            it('测试 结尾的块注释', () => {
                expect(parse('var user = { "name": "test" }; /* 注释 */', undefined, true)).to.eql({ name: 'test' });
                expect(parse('var user = { "name": "test" };/* 注释 */', undefined, true)).to.eql({ name: 'test' });
                expect(parse('var user = { "name": "test" };/*注释 */', undefined, true)).to.eql({ name: 'test' });
                expect(parse('var user = { "name": "test" };/*注释*/', undefined, true)).to.eql({ name: 'test' });

                expect(parse('var user={ "name": "test" }; /* 注释 */', undefined, true)).to.eql({ name: 'test' });
                expect(parse('var user={ "name": "test" };/* 注释 */', undefined, true)).to.eql({ name: 'test' });
                expect(parse('var user={ "name": "test" };/*注释 */', undefined, true)).to.eql({ name: 'test' });
                expect(parse('var user={ "name": "test" };/*注释*/', undefined, true)).to.eql({ name: 'test' });

                expect(parse('user = { "name": "test" }; /* 注释 */', undefined, true)).to.eql({ name: 'test' });
                expect(parse('user = { "name": "test" };/* 注释 */', undefined, true)).to.eql({ name: 'test' });
                expect(parse('user = { "name": "test" };/*注释 */', undefined, true)).to.eql({ name: 'test' });
                expect(parse('user = { "name": "test" };/*注释*/', undefined, true)).to.eql({ name: 'test' });

                expect(parse('user={ "name": "test" }; /* 注释 */', undefined, true)).to.eql({ name: 'test' });
                expect(parse('user={ "name": "test" };/* 注释 */', undefined, true)).to.eql({ name: 'test' });
                expect(parse('user={ "name": "test" };/*注释 */', undefined, true)).to.eql({ name: 'test' });
                expect(parse('user={ "name": "test" };/*注释*/', undefined, true)).to.eql({ name: 'test' });
            });

            it('测试 夹杂在数据之间的块注释', () => {
                expect(parse('var /* 注释 */ user /* 注释 */ = /* 注释 */ { "name": "test" } /* 注释 */;', undefined, true)).to.eql({ name: 'test' });
                expect(parse('var/* 注释 */user/* 注释 */=/* 注释 */{ "name": "test" }/* 注释 */;', undefined, true)).to.eql({ name: 'test' });

                expect(parse('/* 注释 */ user /* 注释 */ = /* 注释 */ { "name": "test" } /* 注释 */;', undefined, true)).to.eql({ name: 'test' });
                expect(parse('/* 注释 */user/* 注释 */=/* 注释 */{ "name": "test" }/* 注释 */;', undefined, true)).to.eql({ name: 'test' });
            });

            it('测试 开头与结尾的块注释', () => {
                expect(parse(`
                    /* 注释 */
                    var user = { "name": "test" };
                    /* 注释 */
                `, undefined, true)).to.eql({ name: 'test' });

                expect(parse(`
                    /* 注释 */
                    var user={ "name": "test" };
                    /* 注释 */
                `, undefined, true)).to.eql({ name: 'test' });

                expect(parse(`
                    /* 注释 */
                    user = { "name": "test" };
                    /* 注释 */
                `, undefined, true)).to.eql({ name: 'test' });

                expect(parse(`
                    /* 注释 */
                    user={ "name": "test" };
                    /* 注释 */
                `, undefined, true)).to.eql({ name: 'test' });
            });

            it('测试 注释中包含 JSONP 数据', () => {
                expect(parse(`
                    // var user = { "name": "test1" };
                    /* var user = { "name": "test2" }; */
                    var user = { "name": "test3" };
                    /* var user = { "name": "test4" }; */
                `, undefined, true)).to.eql({ name: 'test3' });

                expect(parse(`
                    // var user={ "name": "test1" };
                    /* var user={ "name": "test2" }; */
                    var user={ "name": "test3" };
                    /* var user={ "name": "test4" }; */
                `, undefined, true)).to.eql({ name: 'test3' });

                expect(parse(`
                    // user = { "name": "test1" };
                    /* user = { "name": "test2" }; */
                    user = { "name": "test3" };
                    /* user = { "name": "test4" }; */
                `, undefined, true)).to.eql({ name: 'test3' });

                expect(parse(`
                    // user={ "name": "test1" };
                    /* user={ "name": "test2" }; */
                    user={ "name": "test3" };
                    /* user={ "name": "test4" }; */
                `, undefined, true)).to.eql({ name: 'test3' });
            });

            it('测试 JSON5 数据中包含注释', () => {
                expect(parse(`
                    var user = { 
                        /* 注释 */
                        name: "test" // 注释
                        /* 注释 */
                    };
                `, true)).to.eql({ name: 'test' });

                expect(parse(`
                    var user={ 
                        /* 注释 */
                        name: "test" // 注释
                        /* 注释 */
                    };
                `, true)).to.eql({ name: 'test' });

                expect(parse(`
                    user = { 
                        /* 注释 */
                        name: "test" // 注释
                        /* 注释 */
                    };
                `, true)).to.eql({ name: 'test' });

                expect(parse(`
                    user={ 
                        /* 注释 */
                        name: "test" // 注释
                        /* 注释 */
                    };
                `, true)).to.eql({ name: 'test' });
            });
        });

        it('测试 字符串中包含注释', function () {
            expect(parse('var message="123 // hello world";', undefined, true)).to.be('123 // hello world');
            expect(parse('var message="123 /* hello world */";', undefined, true)).to.be('123 /* hello world */');
        });

        it('测试 字符串中包含函数', function () {
            expect(parse('var message="function a123({ \\"name\\": \\"test\\", \\"age\\": 18 })";', undefined, true)).to.be('function a123({ "name": "test", "age": 18 })');
            expect(parse('var message="function a123({ \\"name\\": \\"test\\", \\"age\\": 18 });";', undefined, true)).to.be('function a123({ "name": "test", "age": 18 });');
        });

        it('测试 结尾包含多个分号', function () {
            expect(parse('var message={ "name": "test", "age": 18 }')).to.eql({ name: 'test', age: 18 });
            expect(parse('var message={ "name": "test", "age": 18 } ')).to.eql({ name: 'test', age: 18 });

            expect(parse('var message={ "name": "test", "age": 18 };')).to.eql({ name: 'test', age: 18 });
            expect(parse('var message={ "name": "test", "age": 18 }; ')).to.eql({ name: 'test', age: 18 });

            expect(parse('var message={ "name": "test", "age": 18 }; ;  ;  ;')).to.eql({ name: 'test', age: 18 });
            expect(parse('var message={ "name": "test", "age": 18 }; ;  ;  ; ')).to.eql({ name: 'test', age: 18 });
        });

        describe('测试 数据被多个括号包裹', function () {
            it('测试 解析 JSON', function () {
                expect(parse('var message=(( (  (   ("test")   )  ) ));')).to.be('test');
                expect(parse('var message=(( (  (   ({ "name": "test", "age": 18 })   )  ) ));')).to.eql({ name: 'test', age: 18 });
                expect(parse('var message=(( (  (   ([{ "name": "test", "age": 18 }])   )  ) ));')).to.eql([{ name: 'test', age: 18 }]);
            });

            it('测试 解析 JSON5', function () {
                expect(parse('var message=(( (  (   ("test")   )  ) ));')).to.be('test');
                expect(parse('var message=(( (  (   ({ name: "test", age: 18 })   )  ) ));', true)).to.eql({ name: 'test', age: 18 });
                expect(parse('var message=(( (  (   ([{ name: "test", age: 18 }])   )  ) ));', true)).to.eql([{ name: 'test', age: 18 }]);
            });
        });
    });

    describe('测试 错误处理', () => {
        it('测试 不支持的格式', () => {
            const data = '这是不支持的格式';
            expect(() => parse(data)).to.throwError(/Unsupported JSONP format/);
        });

        it('测试 空的 JSON', () => {
            const data = 'callback();';
            expect(() => parse(data)).to.throwError(/No JSON content found/);
        });

        it('测试 无效的 JSON', () => {
            const data = 'callback({ invalid json });';
            expect(() => parse(data)).to.throwError(/Failed to parse JSON content/);
        });
    });
});

describe('测试 stringify', () => {
    it('测试 生成对象格式', () => {
        const data = { name: 'test', age: 18 };
        expect(stringify(data, 'handleData')).to.equal('handleData({"name":"test","age":18});');
        expect(stringify(data, 'handleData', 'var')).to.equal('var handleData = {"name":"test","age":18};');
        expect(stringify(data, 'handleData', 'let')).to.equal('let handleData = {"name":"test","age":18};');
        expect(stringify(data, 'handleData', 'const')).to.equal('const handleData = {"name":"test","age":18};');
        expect(stringify(data, 'handleData', 'var', false)).to.equal('handleData = {"name":"test","age":18};');
    });

    it('测试 生成数组格式', () => {
        const data = [1, 2, 3];
        expect(stringify(data, 'loadList')).to.equal('loadList([1,2,3]);');
        expect(stringify(data, 'loadList', 'var')).to.equal('var loadList = [1,2,3];');
        expect(stringify(data, 'loadList', 'let')).to.equal('let loadList = [1,2,3];');
        expect(stringify(data, 'loadList', 'const')).to.equal('const loadList = [1,2,3];');
        expect(stringify(data, 'loadList', 'var', false)).to.equal('loadList = [1,2,3];');
    });

    it('测试 生成字符串类型格式', () => {
        const data = 'hello world';
        expect(stringify(data, 'showMessage')).to.equal('showMessage("hello world");');
        expect(stringify(data, 'showMessage', 'var')).to.equal('var showMessage = "hello world";');
        expect(stringify(data, 'showMessage', 'let')).to.equal('let showMessage = "hello world";');
        expect(stringify(data, 'showMessage', 'const')).to.equal('const showMessage = "hello world";');
        expect(stringify(data, 'showMessage', 'var', false)).to.equal('showMessage = "hello world";');
    });

    it('测试 生成数字类型格式', () => {
        const data = 123.45;
        expect(stringify(data, 'setNumber')).to.equal('setNumber(123.45);');
        expect(stringify(data, 'setNumber', 'var')).to.equal('var setNumber = 123.45;');
        expect(stringify(data, 'setNumber', 'let')).to.equal('let setNumber = 123.45;');
        expect(stringify(data, 'setNumber', 'const')).to.equal('const setNumber = 123.45;');
        expect(stringify(data, 'setNumber', 'var', false)).to.equal('setNumber = 123.45;');
    });

    it('测试 生成布尔值类型格式', () => {
        const data = true;
        expect(stringify(data, 'setFlag')).to.equal('setFlag(true);');
        expect(stringify(data, 'setFlag', 'var')).to.equal('var setFlag = true;');
        expect(stringify(data, 'setFlag', 'let')).to.equal('let setFlag = true;');
        expect(stringify(data, 'setFlag', 'const')).to.equal('const setFlag = true;');
        expect(stringify(data, 'setFlag', 'var', false)).to.equal('setFlag = true;');
    });

    it('测试 生成 null 类型格式', () => {
        const data = null;
        expect(stringify(data, 'setNull')).to.equal('setNull(null);');
        expect(stringify(data, 'setNull', 'var')).to.equal('var setNull = null;');
        expect(stringify(data, 'setNull', 'let')).to.equal('let setNull = null;');
        expect(stringify(data, 'setNull', 'const')).to.equal('const setNull = null;');
        expect(stringify(data, 'setNull', 'var', false)).to.equal('setNull = null;');
    });

    describe('测试 标识符验证', () => {
        it('测试 包含空格的标识符', () => {
            expect(() => { stringify({}, 'invalid id') }).to.throwError(/Invalid identifier/);
        });

        it('测试 以数字开头的标识符', () => {
            expect(() => { stringify({}, '123name') }).to.throwError(/Invalid identifier/);
        });

        it('测试 包含特殊字符的标识符', () => {
            expect(() => { stringify({}, 'user@name') }).to.throwError(/Invalid identifier/);
        });
    });
});
