const Router = require("koa-router")
const router = new Router()


router.get('/v2/index',(ctx, next) => {
    ctx.body = {
        code : 200,
        data: 'index'
    }

})
module.exports = router