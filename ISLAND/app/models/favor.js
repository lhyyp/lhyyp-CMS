
const { db } = require("../../utils/db")
const { Sequelize, Model ,Op} = require("sequelize")
const { LikeError } = require("../../utils/http-exception")
const { Art,NotFount } = require("./art")

class Favor extends Model {

    static async like(art_id, type, uid) {
        // 1、添加记录
        // 2、classic fav_nums +1
        const favor = await Favor.findOne({
            where: {
                art_id, type, uid
            }
        })
        if (favor) {
            throw new LikeError()
        }
        // 开启事务
        return db.transaction(async t => {
            await Favor.create({
                art_id, type, uid
            }, { transaction: t })
            const art = await Art.getData(art_id, type)
            await art.increment("fac_nums", { by: 1, transaction: t })
        })
    }

    static async dislike(art_id, type, uid) {
        // 1、删除记录
        // 2、classic fav_nums -1
        const favor = await Favor.findOne({
            where: {
                art_id, type, uid
            }
        })
        if (!favor) {
            throw new LikeError("你未点赞")
        }

        // 开启事务
        return db.transaction(async t => {
            const art = await Art.getData(art_id, type)
            await art.decrement("fac_nums", { by: 1, transaction: t })
            await favor.destroy({
                force: true,
                transaction: t
            })
        })
    }
    /**
     * 
     * @param {* 获取收藏列表} uid 
     */
    static async getMyClassicFavors(uid){
        const arts = await Favor.findAll({
            where:{
                uid,
                type:{
                    [Op.not]:4
                }
            }
        })
        if(!arts){
            throw new NotFount()
        }
        return await Art.getList(arts)
    }
}

Favor.init({
    art_id: Sequelize.INTEGER,
    uid: Sequelize.INTEGER,
    type: Sequelize.TINYINT
}, {
        sequelize: db,
        tableName: "favor"
    })




module.exports = { Favor }