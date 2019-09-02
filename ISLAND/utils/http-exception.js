class HttpException extends Error{
    constructor(msg ="服务器错误",status = 200, code = 200){
        super()
        this.msg = msg
        this.status = status
        this.code = code

    }
}


class ParameterException extends HttpException{
    constructor(msg, status=1001){
        super()
        this.msg = msg
        this.status = status
    }
}

class Success {
    constructor(data,msg){
        this.msg = msg || "ok"
        this.data = data
        this.status = 200

    }
}


class NotFount extends HttpException{
    constructor(msg, status){
        super()
        this.msg = msg || "资源未找到"
        this.status = status || 404
        this.code = 200

    }
}

class Authfailed extends HttpException{
    constructor(msg, status){
        super()
        this.msg = msg || "授权失败"
        this.status = status || 1001
        this.code = 200

    }
}

class MissingParameters extends HttpException{
    constructor(msg, status){
        super()
        this.msg = msg || "缺少参数"
        this.status = status || 1001
        this.code = 200

    }
}
class ErrorParameters extends HttpException{
    constructor(msg, status){
        super()
        this.msg = msg || "参数不合法"
        this.status = status || 1003
        this.code = 200

    }
}

class Forbbiden extends HttpException{
    constructor(msg, status){
        super()
        this.msg = msg || "禁止访问"
        this.status = status || 403
        this.code = 200
    }
}


class LikeError extends HttpException{
    constructor(msg, status){
        super()
        this.msg = msg || "您已点赞"
        this.status = status || 200
        this.code = 200
    }
}


module.exports = { 
    HttpException ,
    ParameterException,
    Success,
    NotFount,
    Authfailed,
    MissingParameters,
    ErrorParameters,
    Forbbiden,
    LikeError
}