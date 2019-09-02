const { HttpException } = require("../utils/http-exception")
const catchError = async (ctx, next) =>{
    try {
        await next()
    } catch (error) {
        const isDev = process.env.NODE_ENV
        const isHttpException = error instanceof HttpException
        if((isDev == 'development' || !isDev) && !isHttpException){
            throw error
        }
        if(isHttpException){
            ctx.body = {
                msg : error.msg,
                status : error.status,
                requestUrl : `${ctx.method} ${ctx.path}`   
            }
            ctx.status = error.code
        }else{
            ctx.body = {
                msg : "未知异常",
                status : 999,
                requestUrl : `${ctx.method} ${ctx.path}`   
            }
            // ctx.status = 5000
        }       
    }
}
module.exports = catchError