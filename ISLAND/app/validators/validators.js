
const { LinValidator, Rule } = require("../../utils/lin-validator")
const { User } = require("../models/user")
const { LoginType, classicType } = require("../lib/enum")
const { ErrorParameters } = require("../../utils/http-exception")



class PositiveInteferValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            new Rule("isInt", "需要是正整数", { min: 1 }),
        ]
    }
}


class TokenValidator extends LinValidator {
    constructor() {
        super()
        this.account = [
            new Rule("isLength", "不符合规则", {
                min: 4,
                max: 32
            })
        ]
        this.secret = [
            new Rule("isOptional"),
            new Rule("isLength", "至少6个字符", {
                min: 6,
                max: 128
            })
        ]
        const checker = new Checker(LoginType)
        this.validateLoginType = checker.check.bind(checker)

    }

}

class RegisterValidator extends LinValidator {
    constructor() {
        super()
        this.email = [
            new Rule("isEmail", "不符合Email规则"),
        ]
        this.password1 = [
            new Rule("isLength", "密码至少6个字符，最多32个字符", {
                min: 6,
                max: 32
            })
        ]
        this.password2 = this.password1
        this.userName = [
            new Rule("isLength", "昵称不符合规范", {
                min: 1,
                max: 6
            })
        ]
    }
    validatePassword(vals) {
        const password1 = vals.body.password1
        const password2 = vals.body.password2
        if (password1 != password2) {
            throw new Error("两次密码不相同")

        }
    }
    async validateEmail(vals) {
        const email = vals.body.email
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (user) {
            throw new Error("email已存在")
        }

    }
}

class VerifyTokenValidator extends LinValidator {
    constructor() {
        super()
        this.token = [
            new Rule("isLength", "token不允许为空", {
                min: 1
            })
        ]
    }
}
/**
 * 
 * @param {* 检验登录方式} vals 
 */

function checkLoginType(vals) {
    if (!vals.body.type) {
        throw new ErrorParameters("type是必须参数")
    }
    if (!LoginType.isThisType(vals.body.type)) {
        throw new ErrorParameters("type参数不合法")
    }
}

/**
 * 
 * @param {检验分类type} vals ctx 上下文 
 */
function checkClassicType(vals) {
    let type = vals.body.type || vals.path.type
    if (!type) {
        throw new ErrorParameters("type是必须参数")
    }
    type = parseInt(type)

    // this.parsed.path.type = type
    if (!classicType.isThisType(type)) {
        throw new ErrorParameters("type参数不合法")
    }
}

/**
 *封装checkType 方法
 */
class Checker {
    constructor(type) {
        this.enumType = type
    }
    check(vals) {
        let type = vals.body.type || vals.path.type
        if (!type) {
            throw new ErrorParameters("type是必须参数")
        }
        type = parseInt(type)
        if (!this.enumType.isThisType(type)) {
            throw new ErrorParameters("type参数不合法")
        }
    }
}

class LikeValidator extends PositiveInteferValidator {
    constructor() {
        super()
        const checker = new Checker(classicType)
        this.validateType = checker.check.bind(checker)

    }
}

class SearchValidator extends LinValidator {
    constructor() {
        super()
        this.q =[
            new Rule('isLength','关键字不能为空',{min:1,max:16})
        ]
        this.start =[
            new Rule('isInt','start不合规范',{min:0,max:60000}),
            new Rule("isOptional",'',0)
        ]
        this.count =[
            new Rule('isInt','conut不合规范',{min:1,max:20}),
            new Rule("isOptional",'',20)
        ]

    }
}

class UploadValidator extends LinValidator {
    constructor() {
        super()
        this.files =[
            new Rule('isLength','',{min:1})
        ]

    }
}





module.exports = {
    PositiveInteferValidator,
    RegisterValidator,
    TokenValidator,
    VerifyTokenValidator,
    LikeValidator,
    SearchValidator,
    UploadValidator
} 