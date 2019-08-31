const axios = require('axios')
const util = require("util")
const { db } = require("../../utils/db")
const { Sequelize, Model, Op } = require("sequelize")
const { NotFount } = require("../../utils/http-exception")
const { Favor } = require("./favor")
const config = require("../../config/config")

class Book extends Model {
    async detail(id) {
        const url = util.format(config.yushu.detailUrl, id)
        const res = await axios.get(url)
        return res.data
    }
    static async searchFromYushu(q, start, count, summary = 1) {
        const url = util.format(config.yushu.keywordUrl, encodeURI(q), count, start, summary)
        const res = await axios.get(url)
        return res.data
    }
    static async getLikeByUser(){
        const arts = await Favor.findAll({
            where:{
                uid,
                type
            }
        })
        if(!arts){
            throw new NotFount()
        }
        return arts
    }
}

Book.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    fav_nums: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
}, {
        sequelize: db,
        tableName: "book"
    })
module.exports = { Book }