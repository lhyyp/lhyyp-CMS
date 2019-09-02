const Router = require("koa-router")
const router = new Router({
    prefix: '/api/v1/user'
})
const { User } = require("../../models/user")
const { RegisterValidator, TokenValidator, VerifyTokenValidator } = require("../../validators/validators")
const { Success, MissingParameters } = require("../../../utils/http-exception")
const { USER_EMAIL, USER_NAME, USER_MINI_PROGRAM } = require("../../lib/enum").LoginType
const { generateToken } = require("../../../utils/util")
const Auth = require("../../../middlewares/auth")
const WXManger = require("../../services/wx")

/***
 * 注册
 * email => 邮箱
 * password1 => 密码
 * password2
 * userName => 昵称
 */

router.post('/register', async (ctx) => {
    const v = await new RegisterValidator().validate(ctx)
    const user = {
        userName: v.get("body.userName"),
        email: v.get("body.email"),
        password: v.get("body.password1")
    }
    await User.create(user)
    ctx.body = new Success(user)
})

/**
 * 登录
 * type => 登录方式 101 => 邮箱登录 102 => 电话号码登录（ps:暂时未开发） 103=>小程序登录
 * account => type:101 => 邮箱 103 => 前端小程序获取的用户code
 * secret =>  type:101 => 用户密码,  103 =>不需要传
 */
router.post('/login', async (ctx) => {
    const v = await new TokenValidator().validate(ctx)
    const account = v.get("body.account")
    let token = null
    // 处理不同的登录类型
    switch (v.get("body.type")) {
        case USER_EMAIL:
            token = await emailLogin(account, v.get("body.secret"))
            break
        case USER_NAME:
            token = await userNameLogin(account, v.get("body.secret"))
            break
        case USER_MINI_PROGRAM:
            token = await WXManger.codeToToken(v.get("body.account"))
            break
        default:
            throw new MissingParameters("没有处理的函数")
            break
    }
    const user = await User.findOne({
        where: {
            userName:account
        }
    })
  
    ctx.body = new Success({ 'token': token ,user})
})


/**
 * 验证token
 */
router.post("/verify", async (ctx) => {
    const v = await new VerifyTokenValidator().validate(ctx)
    const res = Auth.verifyToken(v.get("body.token"))
    ctx.body = res

})



async function emailLogin(account, secret) {
    const user = await User.verifyEmailPassword(account, secret)
    return token = generateToken(user.id, Auth.USER)
}
async function userNameLogin(account, secret) {
    console.log(account)
    const user = await User.verifyUserNamePassword(account, secret)
    return token = generateToken(user.id, Auth.USER)

}




module.exports = router