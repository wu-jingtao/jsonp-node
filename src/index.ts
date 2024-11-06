import json5 from 'json5';

/**
 * 解析 jsonp
 * @param data jsonp 数据
 */
function parse(data: string): unknown {
    const start = data.indexOf('(') + 1;
    const end = data.lastIndexOf(')');
    data = data.slice(start, end);
    return json5.parse(data);
}

/**
 * 将数据序列化成 jsonp 格式
 * @param data 要序列化的数据
 * @param callbackName 回调函数的名称
 */
function stringify(data: any, callbackName: string): string {
    return `${callbackName}(${JSON.stringify(data)});`;
}

/**
 * 解析变量格式的 jsonp
 * @param data jsonp 数据
 */
function parse_var(data: string): unknown {
    const matchStart = data.match(/=\s*/);
    const matchEnd = data.match(/\s*;?\s*$/);

    if (matchStart === null) {
        throw new Error('Data format error.');
    } else {
        const start = matchStart.index! + matchStart[0].length;
        const end = matchEnd!.index;
        return json5.parse(data.slice(start, end));
    }
}

/**
 * 将数据序列化成 jsonp 变量格式
 * @param data 要序列化的数据
 * @param varName 变量名称
 * @param isGlobal 是否是全局变量(在变量名前面添加 var 关键字)
 */
function stringify_var(data: any, varName: string, isGlobal: boolean): string {
    return `${isGlobal ? '' : 'var '}${varName}=${JSON.stringify(data)};`;
}

export = { parse, stringify, parse_var, stringify_var };
