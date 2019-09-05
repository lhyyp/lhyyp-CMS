const Router = require("koa-router")
const svgCaptcha = require('svg-captcha');

const { Success } = require('../../../utils/http-exception')
const router = new Router({
    prefix: '/api/verifyCode'
})




router.get('/',  async ctx => {
    var captcha = svgCaptcha.create();
    ctx.session.captcha = captcha.text
	ctx.body = new Success(captcha.data)
});

router.get('/aaa',  async ctx => {
	ctx.body = ctx.session
});


module.exports = router