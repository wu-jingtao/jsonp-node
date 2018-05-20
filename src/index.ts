import * as vm from 'vm';

//#region 解析标准jsonp格式

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
function stringify(data: any, callback: string) {
    return `${callback}(${JSON.stringify(data)})`;
}

//#endregion

//#region 解析 变量格式

/**
 * 解析变量格式的jsonp
 * @param jsonp jsonp数据
 * @param varName 变量名称
 * @param isGlobal 是否是全局变量
 */
function parse_var(jsonp: string, varName: string, isGlobal: boolean) {
    if (isGlobal) {
        const ctx = { [varName]: null as any };

        vm.runInNewContext(jsonp, ctx);

        return ctx[varName];
    } else {
        const ctx = { result: null as any };

        vm.runInNewContext(`${jsonp}; result = ${varName}`, ctx);

        return ctx.result;
    }
}

/**
 * 将数据序列化成变量jsonp格式
 * @param data 要序列化的数据
 * @param varName 变量名称
 * @param isGlobal 是否是全局变量
 */
function stringify_var(data: any, varName: string, isGlobal: boolean) {
    return `${isGlobal ? '' : 'var '}${varName}=${JSON.stringify(data)}`;
}

//#endregion

export = { parse, stringify, parse_var, stringify_var };