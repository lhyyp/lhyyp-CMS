
const { db } = require("../../utils/db")
const { Sequelize, Model, Op } = require("sequelize")
const { NotFount } = require("../../utils/http-exception")
const { Favor } = require("./favor")

class HotBook extends Model {
    static async getAll() {
        const books = await HotBook.findAll({
            order: [
                'index'
            ]
        })
        let ids = []
        books.forEach((book) => {
            ids.push(book.id)
        })
        // 获取每本书的点赞数量
        const numsById = await Favor.findAll({
            where: {
                art_id: {
                    [Op.in]: ids
                },
                type:4
            },
            group: ['art_id'],
            attributes: ['art_id', [Sequelize.fn("COUNT", '*'), "count"]]
        })
        books.forEach(book => {
            HotBook._getEachBookStatus(book,numsById)
        })

        return books

    }
    static _getEachBookStatus(book,numsById){
        let count = 0
        numsById.forEach( item => {
            if(book.id === item.art_id){
                count = item.get('count')
            }
            book.setDataValue('count',count)
            return book
        })
    }
}

HotBook.init({
    index: Sequelize.INTEGER,
    image: Sequelize.STRING,
    author: Sequelize.STRING,
    title: Sequelize.STRING,
}, {
        sequelize: db,
        tableName: "hot_book",
        createdAt: 'created_at',
        updatedAt: "updated_at",
        deletedAt: 'deleted_at'
    })




module.exports = { HotBook }