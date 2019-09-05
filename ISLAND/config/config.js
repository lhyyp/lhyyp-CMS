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
    sessionConfig: {
        key: 'koa:sess',   //cookie key (default is koa:sess)
        maxAge: 2 * 60 * 60 * 1000,  // cookie的过期时间 maxAge in ms (default is 1 days)
        overwrite: true,  //是否可以overwrite    (默认default true)
        httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
        signed: true,   //签名默认true
        rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
        renew: false,  //(boolean) renew session when session is nearly expired,
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