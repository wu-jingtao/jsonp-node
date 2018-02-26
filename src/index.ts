import * as vm from 'vm';

/**
 * 解析jsonp
 * @param jsonp jsonp数据
 * @param callback jsonp指定的回调函数名称
 */
function jsonp_parser<T>(jsonp: string, callback: string) {
    const ctx = {
        result: undefined as any,
        [callback]: function (data: T) {
            ctx.result = data;
        }
    };

    vm.runInNewContext(jsonp, ctx);

    return ctx.result;
}

export = jsonp_parser;