const Router = require("koa-router")
const router = new Router({
    prefix: '/v1/book'
})
const { PositiveInteferValidator, SearchValidator } = require("../../validators/validators")
const Auth = require("../../../middlewares/auth")
const { HotBook } = require('../../models/hot_book')
const { Book } = require('../../models/book')
const { Success } = require('../../../utils/http-exception')
/**
 * 获取热门书籍
 */
router.get('/hotBook', async (ctx, next) => {
    const books = await HotBook.getAll()
    ctx.body = new Success(books)
})
/**
 * 图书详情
 */
router.get('/detail/:id', async (ctx, next) => {
    const v = await new PositiveInteferValidator().validate(ctx)
    const books = new Book()
    const data = await books.detail(v.get('path.id'))
    ctx.body = new Success(data)
})

/**
 * search
 * q => 关键字
 * start
 * count
 */
router.get('/search', async (ctx, next) => {
    const v = await new SearchValidator().validate(ctx)
    const data = await Book.searchFromYushu(v.get('body.q'), v.get('body.start'), v.get('body.count'))
    ctx.body = new Success(data)
})

router.get('/mylike',new Auth().m, async (ctx, next) => {
    const data = await Book.getLikeByUser()
    ctx.body = new Success(data)
})


module.exports = router