const Router = require("koa-router")
const router = new Router({
    prefix: '/v1/upload'
})

const { Success } = require('../../../utils/http-exception')
const {upload,uploadFile} = require('../../../middlewares/upload')



router.post('/', uploadFile, async ctx => {
    ctx.body = new Success({'src':ctx.request.files.file.outPath})
});

module.exports = router