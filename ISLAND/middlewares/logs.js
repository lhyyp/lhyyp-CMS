const logsUtil = require('../utils/logs.js');
const logs = async (ctx, next) => {
    const start = new Date();					          // 响应开始时间
    let intervals;								              // 响应间隔时间
    try {
        await next();
        intervals = new Date() - start;
        logsUtil.logResponse(ctx, intervals);	  //记录响应日志
    } catch (error) {
        intervals = new Date() - start;
        logsUtil.logError(ctx, error, intervals);  //记录异常日志
        ctx.response.status = error.statusCode || error.status || 500;
        ctx.app.emit('error', error, ctx); // 手动释放error事件
    }
  
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
}
module.exports = logs