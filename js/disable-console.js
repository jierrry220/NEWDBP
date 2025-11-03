// 禁用控制台输出（保留错误信息用于调试）
(function() {
    // 如果在 URL 中有 ?debug=true 参数，则不禁用控制台
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true') {
        return; // 调试模式，不禁用
    }
    
    const noop = function() {};
    
    // 禁用常规日志
    console.log = noop;
    console.info = noop;
    console.debug = noop;
    console.trace = noop;
    console.dir = noop;
    console.dirxml = noop;
    console.group = noop;
    console.groupCollapsed = noop;
    console.groupEnd = noop;
    console.time = noop;
    console.timeEnd = noop;
    console.timeLog = noop;
    console.count = noop;
    console.countReset = noop;
    console.table = noop;
    console.clear = noop;
    
    // 保留 console.warn 和 console.error 用于关键错误调试
    // 如需完全禁用，可以取消下面两行的注释
    // console.warn = noop;
    // console.error = noop;
    
    // 如需完全隐藏所有输出（包括错误），可在 URL 添加 ?silent=true
    if (urlParams.get('silent') === 'true') {
        console.warn = noop;
        console.error = noop;
        console.assert = noop;
    }
})();
