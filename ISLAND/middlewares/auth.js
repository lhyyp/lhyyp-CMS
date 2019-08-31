const basicAuth = require("basic-auth")
const jwt = require('jsonwebtoken')
const { Forbbiden ,Success } = require("../utils/http-exception")
const config = require("../config/config")

class Auth{
    constructor(level){
        this.level = level || 1
        Auth.USER = 8
        Auth.ADMIN = 16
        Auth.SUPER_ADMIN = 32
    }
    get m (){
        return async (ctx,next) => {
            // 检测token
            let tokenMsg = "token不合法"
            const userToken = basicAuth(ctx.req)
            if(!userToken || !userToken.name){
                throw new Forbbiden(tokenMsg)
            }
            try {
                // 检验token
                var decode = jwt.verify(userToken.name,config.security.secretKey)
            } catch (error) {
                if(error.name == "TokenExpiredError"){
                    tokenMsg = "token已过期"
                }
                throw new Forbbiden(tokenMsg)
            }
            if(decode.scope < this.level){
                tokenMsg = "权限不足"
                throw new Forbbiden(tokenMsg)
            }
            ctx.auth = {
                uid : decode.uid,
                scope: decode.scope
            }
            await next()
        }
    }
    static verifyToken(token){
        let tokenMsg = "token不合法"
        try {
            // 检验token
            jwt.verify(token,config.security.secretKey)
        } catch (error) {
            if(error.name == "TokenExpiredError"){
                tokenMsg = "token已过期"
            }
            throw new Forbbiden(tokenMsg)
        }
        throw new Success()
    }
}
module.exports = Auth