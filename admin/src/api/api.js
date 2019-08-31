




/**
 * 接口地址配置文件
 */


let api = process.env.NODE_ENV == "development" ? '/api'  : '/backEnd/api'
export default {
    login : '/login', //登录
    imgApi :api+"/uploadImg"
}
