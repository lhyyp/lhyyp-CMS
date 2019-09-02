const Router = require("koa-router")
const router = new Router({
    prefix: '/api/upload'
})

const { Success } = require('../../../utils/http-exception')
const {upload,uploadFile} = require('../../../middlewares/upload')



router.post('/', uploadFile, async ctx => {
    ctx.body = new Success({'src':`http://localhost:3005${ctx.request.files.file.outPath}`})
});

module.exports = router