const { Movie, Music, Sentence } = require("./classic")
const { Op } = require("sequelize")
class Art {
    static async getData(art_id, type) {
        const finder = {
            where: {
                id: art_id
            }

        }
        let res = null
        switch (type) {
            case 1:
                res = await Movie.findOne(finder)
                break
            case 2:
                res = await Music.findOne(finder)
                break
            case 3:
                res = await Sentence.findOne(finder)
                break
            default:
                break
        }
        return res
    }
    static async getList(artInfoList) {
        let arts = []
        // 根据type的不同需要进行三次查询
        let artInfoObj = {
            1: [],
            2: [],
            3: []
        }
        for (let artInfo of artInfoList) {
            artInfoObj[artInfo.type].push(artInfo.art_id)
        }
        for (let key in artInfoObj) {
            const ids = artInfoObj[key]
            if (ids.length === 0) {
                continue
            }
            key = parseInt(key)
            let ListByType = await Art._getListByType(ids, key)
            arts = [...arts, ...ListByType]

        }
        return arts

    }
    static async _getListByType(ids, type) {
        let arts = []
        const finder = {
            where: {
                id: {
                    [Op.in]: ids
                }
            }

        }
        switch (type) {
            case 1:
                arts = await Movie.findAll(finder)

                break
            case 2:
                arts = await Music.findAll(finder)
                arts.exclude = ['createdAt', 'updatedAt', 'deletedAt']
                break
            case 3:
                arts = await Sentence.findAll(finder)
                arts.exclude = ['createdAt', 'updatedAt', 'deletedAt']
                break
            default:
                break
        }
        return arts


    }

}

module.exports = { Art }