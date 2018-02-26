/**
 * 解析jsonp
 * @param jsonp jsonp数据
 * @param callback jsonp指定的回调函数名称
 */
declare function jsonp_parser<T>(jsonp: string, callback: string): any;
export = jsonp_parser;
