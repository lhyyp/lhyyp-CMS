const Router = require("koa-router")
const router = new Router({
    prefix: '/v1/classic'
})
const { Flow } = require("../../models/flow")
const { Art } = require("../../models/art")
const { Favor } = require("../../models/favor")
const { LikeValidator } = require("../../validators/validators")
const Auth = require("../../../middlewares/auth")
const { Success, NotFount } = require("../../../utils/http-exception")


/**
 * 获取最新期数的信息
*/
router.get('/latest', async (ctx, next) => {
    const flow = await Flow.findOne({
        order: [
            ['index', 'DESC']
        ]
    })
    const art = await Art.getData(flow.art_id, flow.type)
    art.setDataValue("index", flow.index)   //返回期数
    if (ctx.auth && ctx.auth.uid) {   //判断当前请求有没有登录，并查询当前用户是否喜欢
        let favor = await Favor.findOne({
            where: {
                id, type, uid
            }
        })
        art.setDataValue("isLike", favor)
    } else {
        art.setDataValue("isLike", false)
    }
    ctx.body = new Success(art)
})

/**
 * 收藏
 * art_id => 资讯id
 * type => 资讯分类
*/
router.post('/like', new Auth().m, async (ctx, next) => {
    const v = await new LikeValidator().validate(ctx, { id: 'art_id' })
    await Favor.like(v.get("body.art_id"), v.get("body.type"), ctx.auth.uid)
    throw new Success()
})

/**
 * 取消收藏
 * art_id => 资讯id
 * type => 资讯分类
*/
router.post('/dislike', new Auth().m, async (ctx, next) => {
    const v = await new LikeValidator().validate(ctx, { id: 'art_id' })
    await Favor.dislike(v.get("body.art_id"), v.get("body.type"), ctx.auth.uid)
    throw new Success()
})

/**
 *获取咨询详情
 * art_id => 资讯id
 * type => 资讯分类
 *  */
router.get('/favor/:type/:id', async (ctx, next) => {
    const v = await new LikeValidator().validate(ctx)
    const id = v.get('path.id')
    const type = parseInt(v.get('path.type'))
    let art = await Art.getData(id, type)
    art.exclude = ['createdAt','updatedAt','deletedAt']
    if (!art) {
        throw new NotFount()
    }
    if (ctx.auth && ctx.auth.uid) {   //判断当前请求有没有登录，并查询当前用户是否喜欢
        let favor = await Favor.findOne({
            where: {
                id, type, uid
            }
        })
        art.setDataValue("isLike", favor)
    } else {
        art.setDataValue("isLike", false)
    }
    ctx.body = new Success(art)
})


/**
 * 获取用户收藏得期刊
 *  */
router.get('/mylike', new Auth().m, async (ctx, next) => {
    const data = await Favor.getMyClassicFavors(ctx.auth.uid)
    ctx.body = new Success(data)
})




module.exports = router