"use strict";
const vm = require("vm");
/**
 * 解析jsonp
 * @param jsonp jsonp数据
 * @param callback jsonp指定的回调函数名称
 */
function jsonp_parser(jsonp, callback) {
    const ctx = {
        result: undefined,
        [callback]: function (data) {
            ctx.result = data;
        }
    };
    vm.runInNewContext(jsonp, ctx);
    return ctx.result;
}
module.exports = jsonp_parser;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx5QkFBeUI7QUFFekI7Ozs7R0FJRztBQUNILHNCQUF5QixLQUFhLEVBQUUsUUFBZ0I7SUFDcEQsTUFBTSxHQUFHLEdBQUc7UUFDUixNQUFNLEVBQUUsU0FBZ0I7UUFDeEIsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLElBQU87WUFDekIsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDdEIsQ0FBQztLQUNKLENBQUM7SUFFRixFQUFFLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUUvQixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUN0QixDQUFDO0FBRUQsaUJBQVMsWUFBWSxDQUFDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdm0gZnJvbSAndm0nO1xyXG5cclxuLyoqXHJcbiAqIOino+aekGpzb25wXHJcbiAqIEBwYXJhbSBqc29ucCBqc29ucOaVsOaNrlxyXG4gKiBAcGFyYW0gY2FsbGJhY2sganNvbnDmjIflrprnmoTlm57osIPlh73mlbDlkI3np7BcclxuICovXHJcbmZ1bmN0aW9uIGpzb25wX3BhcnNlcjxUPihqc29ucDogc3RyaW5nLCBjYWxsYmFjazogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBjdHggPSB7XHJcbiAgICAgICAgcmVzdWx0OiB1bmRlZmluZWQgYXMgYW55LFxyXG4gICAgICAgIFtjYWxsYmFja106IGZ1bmN0aW9uIChkYXRhOiBUKSB7XHJcbiAgICAgICAgICAgIGN0eC5yZXN1bHQgPSBkYXRhO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdm0ucnVuSW5OZXdDb250ZXh0KGpzb25wLCBjdHgpO1xyXG5cclxuICAgIHJldHVybiBjdHgucmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgPSBqc29ucF9wYXJzZXI7Il19
