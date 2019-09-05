const koa = require("koa")
const koaBody = require("koa-body")
const static = require("koa-static")
const session = require('koa-session');

const InitManger = require('./utils/init.js')           // 自动注册路由
const catchError = require("./middlewares/exceptions")  //异常处理
const logs = require("./middlewares/logs")              // 日志
const config = require("./config/config")


const app = new koa()


app.keys = ['some secret hurr'];

app.use(session(config.sessionConfig,app))


app.use(static(__dirname + '/static'))         // 静态文件
app.use(koaBody({
    multipart: true,  // 支持文件上传
    formidable: {
        maxFileSize: 2000 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
    }
}))
app.use(logs)             // 全局添加日志
app.use(catchError)       // 全局异常处理


InitManger.initCore(app)  // 自动注册路由





app.listen(config.port)
