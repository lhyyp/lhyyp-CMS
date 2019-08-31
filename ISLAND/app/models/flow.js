
const { db } = require("../../utils/db")
const { Sequelize, Model } = require("sequelize")
const { NotFount } = require("../../utils/http-exception")

class Flow extends Model { }

Flow.init({
    index: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.TINYINT
}, {
        sequelize: db,
        tableName: "flow"
    })




module.exports = { Flow }