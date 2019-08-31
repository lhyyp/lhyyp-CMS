module.exports = {
    port:3005,
    database:{
        dbName:'island',
        host:"localhost",
        port:3306,
        user:'root',
        password:'root',
    },
    security:{
        secretKey:"1111",    //生产token key
        expiresIn:60*60*24
    },
    wx:{
        appId:'wx677cb3ca79d71b08',
        appSecret:'7a65b8d4a357b10ae2e50ea5e27d9232',
        loginuRL:"https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code"
    },
    yushu:{
        detailUrl:'http://t.yushu.im/v2/book/id/%s',
        keywordUrl:'http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s'
    },
}