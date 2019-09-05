const Router = require("koa-router")
const xss = require("xss")
const router = new Router({
    prefix: '/api/v1/classic'
})
const { Flow } = require("../../models/flow")
const { Art } = require("../../models/art")
const { Favor } = require("../../models/favor")
const { LikeValidator, ClassicTypeValidator, addArtByTypeValidator } = require("../../validators/validators")
const Auth = require("../../../middlewares/auth")
const { Success, NotFount } = require("../../../utils/http-exception")


/**
 * 获取不同分类资讯列表
 * type:
 */
router.get("/getListByType", async ctx => {
    const v = await new ClassicTypeValidator().validate(ctx);
    const type = parseInt(v.get("query.type"))
    const pageSize = parseInt(v.get("query.pageSize"))
    const pageNum = parseInt(v.get("query.pageNum"))
    const data = await Art.getListByType(type, pageSize, pageNum)
    ctx.body = new Success(data)

})

/**
 * 删除资讯
 * type:
 * id
 */
router.post("/deleteArtByType", new Auth().m, async ctx => {
    const v = await new LikeValidator().validate(ctx, { id: 'art_id' });
    const type = parseInt(v.get("body.type"))
    const art_id = parseInt(v.get("body.art_id"))
    const data = await Art.deleteArtByType(type, art_id)
    ctx.body = new Success('', "删除成功")
})
/**
 * 添加/修改资讯
 */
router.post("/addArtByType", new Auth().m, async ctx => {
    const v = await new addArtByTypeValidator().validate(ctx);
    const type = parseInt(v.get("body.type"))
    const title = xss(v.get("body.title"))
    const Image = v.get("body.Image")
    const content = xss(v.get("body.content"))
    const abstract = xss(v.get("body.abstract"))
    const id = parseInt(v.get("body.id"))
    const data = await Art.addArtByType(type, title, Image, content, abstract, id)
    let msg = id ? '修改成功' : "添加成功"
    ctx.body = new Success('', msg)
})


/**
 *获取咨询详情
 * art_id => 资讯id
 * type => 资讯分类
 *  */
router.get('/favor', async (ctx, next) => {
    const v = await new LikeValidator().validate(ctx)
    const id = v.get('query.id')
    const type = parseInt(v.get('query.type'))
    let art = await Art.getData(id, type)
    art.exclude = ['createdAt', 'updatedAt', 'deletedAt']     //去掉不要的字段
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
 * 获取用户收藏得期刊
 *  */
router.get('/mylike', new Auth().m, async (ctx, next) => {
    const data = await Favor.getMyClassicFavors(ctx.auth.uid)
    ctx.body = new Success(data)
})




module.exports = router