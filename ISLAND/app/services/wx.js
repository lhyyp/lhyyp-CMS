const util = require("util")
const config = require("../../config/config")
const axios = require("axios")
const { Authfailed } = require("../../utils/http-exception")
const { User } = require("../models/user")
const { generateToken } = require("../../utils/util")
const Auth = require("../../middlewares/auth")
class WXManger {
    static async codeToToken(code) {
        // code appid appsecret
        const url = util.format(
            config.wx.loginuRL, config.wx.appId,
            config.wx.appSecret,
            code
        )
        const res = await axios.get(url)
        if (res.status != 200) {
            throw new Authfailed("openid获取失败")
        }
        let errcode = res.data.errcode
        if (errcode) {
            throw new Authfailed("openid获取失败" + res.data.errmsg)
        }
        let user = await User.getUserByopenid(res.data.openid)
        if (!user) {
            user = await User.registerByopenid(res.data.openid)
        }
        return generateToken(user.id, Auth.USER)


    }

}


module.exports = WXManger