import JSON5 from 'json5';
import strip from 'strip-comments';

/**
 * 解析 JSONP 数据
 * @param data JSONP 数据字符串
 * @param json5 是否使用 JSON5 进行解析（支持 JS 对象格式，但性能更差），默认 false
 * @param stripComment 是否需要去除数据中的注释（如果没有就不要开启，否则性能会大幅下降），默认 false
 * @description
 * - 支持 回调函数式 与 变量式 风格
 * - 支持 JSON 与 JSON5 格式内容
 * - 支持 结尾无分号的情况
 * - 支持 数据中带有 行注释 或 块注释
 * @example 回调函数式
 * ```
 * callbackName({ "name": "soup millet", "age": 30 });
 * ```
 * @example 变量式（支持没有 var 关键字）
 * ```
 * var someVariable = { "name": "soup millet", "age": 30 };
 * ```
 */
export function parse<T = unknown>(data: string, json5: boolean = false, stripComment: boolean = false): T {
    if (typeof data !== 'string') {
        throw new Error('Input data must be a string');
    }

    // 首先去除所有注释，简化后续处理
    if (stripComment) {
        data = strip(data);
    }

    let jsonStart: number;
    let jsonEnd: number;

    // 尝试匹配回调函数式
    const callbackStartMatch = data.match(/[a-zA-Z_$][a-zA-Z0-9_$]*\s*(?:\(\s*)+/);
    const callbackEndMatch = data.match(/(?:\s*\))+(?:\s*;)*\s*$/);

    if (callbackStartMatch && callbackEndMatch && callbackStartMatch.index! < callbackEndMatch.index!) {
        jsonStart = callbackStartMatch.index! + callbackStartMatch[0].length;
        jsonEnd = callbackEndMatch.index!;
    } else {
        // 尝试匹配变量式
        const varStartMatch = data.match(/[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*(?:\(\s*)*/);
        const varEndMatch = data.match(/(?:\s*\))*(?:\s*;)*\s*$/);

        if (varStartMatch && varEndMatch && varStartMatch.index! < varEndMatch.index!) {
            jsonStart = varStartMatch.index! + varStartMatch[0].length;
            jsonEnd = varEndMatch.index!;
        } else {
            // 无法识别格式
            throw new Error('Unsupported JSONP format');
        }
    }

    // 提取并解析JSON内容
    const jsonContent = data.substring(jsonStart, jsonEnd).trim();
    if (!jsonContent) {
        throw new Error('No JSON content found in JSONP data');
    }

    try {
        return json5 ? JSON5.parse(jsonContent) : JSON.parse(jsonContent);
    } catch (error) {
        throw new Error('Failed to parse JSON content', { cause: error });
    }
}

/**
 * 将数据序列化成 JSONP 格式字符串
 * @param data 要序列化的数据
 * @param identifier 标识符名称
 * @param style JSONP 风格：'cb' 为回调函数式（默认），'var'、'let'、'const' 为变量式
 * @param addKeyWord 是否添加关键字（默认 true，仅变量式有效）
 * @example 回调函数式（默认）
 * ```
 * stringify({ name: 'Alice', age: 20 }, 'handleUser');
 * // 输出: handleUser({"name":"Alice","age":20});
 * ```
 * @example 变量式（带关键字）
 * ```
 * stringify([1, 2, 3], 'numbers', 'var');
 * // 输出: var numbers = [1,2,3];
 * ```
 * @example 变量式（不带关键字）
 * ```
 * stringify({ id: 100 }, 'config', 'var', false);
 * // 输出: config = {"id":100};
 * ```
 */
export function stringify(data: any, identifier: string, style: 'cb' | 'var' | 'let' | 'const' = 'cb', addKeyWord: boolean = true): string {
    // 验证标识符合法性（必须是有效的 JavaScript 标识符）
    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(identifier)) {
        throw new Error(`Invalid identifier: "${identifier}" (must be a valid JavaScript identifier)`);
    }

    // 序列化数据
    const serializedData = JSON.stringify(data);

    // 根据风格生成不同格式的JSONP
    switch (style) {
        case 'cb': {
            return `${identifier}(${serializedData});`;
        }
        default: {
            return `${addKeyWord ? `${style} ` : ''}${identifier} = ${serializedData};`;
        }
    }
}

export default { parse, stringify };
