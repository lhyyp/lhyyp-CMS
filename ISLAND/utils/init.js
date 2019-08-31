const requireDirectory = require("require-directory")
const Router = require("koa-router")
class InitManger{
    static initCore(app){
        InitManger.app = app
        InitManger.initLoadRouter()

    }
    static initLoadRouter(){
        const apiDirectory = `${process.cwd()}/app/api`
        const modules = requireDirectory(module, apiDirectory, { visit: whenLoadMoudel})

        function whenLoadMoudel(obj) {
            if (obj instanceof Router) {
                InitManger.app.use(obj.routes())
            }

        }
    }
}
module.exports = InitManger