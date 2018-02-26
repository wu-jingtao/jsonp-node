import * as vm from 'vm';

/**
 * 解析jsonp
 * @param jsonp jsonp数据
 * @param callback jsonp指定的回调函数名称
 */
function parse(jsonp: string, callback: string) {
    const ctx = {
        result: null as any,
        [callback]: function (data: any) {
            ctx.result = data;
        }
    };

    vm.runInNewContext(jsonp, ctx);

    return ctx.result;
}

/**
 * 将数据序列化成jsonp格式
 * @param data 要序列化的数据
 * @param callback 回调函数的名称，默认为随机数
 */
function stringify(data: any, callback: string = `_${(Math.random() * 10000000000).toFixed(0)}`) {
    return `${callback}(${JSON.stringify(data)})`;
}

export = { parse, stringify };