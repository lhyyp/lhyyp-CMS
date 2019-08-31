const koa = require("koa")
const parser = require("koa-bodyparser")
const static = require("koa-static")


const InitManger = require('./utils/init.js')           // 自动注册路由
const catchError = require("./middlewares/exceptions")  //异常处理
const logs = require("./middlewares/logs")              // 日志
const config = require("./config/config")


const app = new koa()


app.use(static(__dirname + '/static'))         // 静态文件
app.use(parser())
app.use(logs)             // 全局添加日志
app.use(catchError)       // 全局异常处理




InitManger.initCore(app)  // 自动注册路由


app.listen(config.port)
