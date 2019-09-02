const { Movie, Music, Sentence } = require("./classic")
const { Op, Sequelize } = require("sequelize")
const { NotFount } = require("../../utils/http-exception")
class Art {
    /**
     * 获取不同分类资讯列表
     * type ，pagesize ，pageNum
     */
    static async getListByType(type, pagesize, pageNum) {
        let res = null
        switch (type) {
            case 1:
                res = await Movie.findAndCountAll({
                    offset: pagesize * (pagesize - 1),
                    limit: pageNum,
                    order: [
                        ['createdAt', 'DESC'],
                    ]

                })
                break
            case 2:
                res = await Music.findAndCountAll({
                    offset: pagesize * (pagesize - 1),
                    limit: pageNum,
                    order: [
                        ['createdAt', 'DESC'],
                    ]
                })
                break
            case 3:
                res = await Sentence.findAndCountAll({
                    offset: pagesize * (pagesize - 1),
                    limit: pageNum,
                    order: [
                        ['createdAt', 'DESC'],
                    ]
                })
                break
            default:
                break
        }
        return res

    }
    static async deleteArtByType(type, art_id) {
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
        if (!res) {
            throw new NotFount("该资讯不存在")
        }
        const data = await res.destroy({
            force: false,  //软删除
        })
        return data
    }
    /**
     * 添加资讯
     * @param {*} type 
     * @param {*} title 
     * @param {*} Image 
     * @param {*} content 
     */
    static async addArtByType(type, title, Image, content, abstract, id) {
        let res = null
        switch (type) {
            case 1:
                if (id) {
                    let art = await Movie.findOne({
                        where: {
                            id
                        }
                    })
                    if (!art) {
                        throw new NotFount("找不到该资讯")
                    }
                    res = await Movie.update({ title, Image, content, abstract }, { where: { id } })
                } else {
                    res = await Movie.create({ title, Image, content, abstract })
                }

                break
            case 2:
                if (id) {
                    let art = await Music.findOne({
                        where: {
                            id
                        }
                    })
                    if (!art) {
                        throw new NotFount("找不到该资讯")
                    }
                    res = await Music.update({ title, Image, content, abstract }, { where: { id } })
                } else {
                    res = await Music.create({ title, Image, content, abstract })
                }
                break
            case 3:
                if (id) {
                    let art = await Sentence.findOne({
                        where: {
                            id
                        }
                    })
                    if (!art) {
                        throw new NotFount("找不到该资讯")
                    }
                    res = await Sentence.update({ title, Image, content, abstract }, { where: { id } })
                } else {
                    res = await Sentence.create({ title, Image, content, abstract })
                }
                break
            default:
                break
        }
        return res

    }

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