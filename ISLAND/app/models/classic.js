
const { db } = require("../../utils/db")
const { Sequelize, Model } = require("sequelize")
const { NotFount } = require("../../utils/http-exception")



const  classFields = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: ''
    },
    Image:Sequelize.STRING,
    title:Sequelize.STRING,
    pubdate:Sequelize.DATEONLY,
    content:Sequelize.STRING,
    abstract:Sequelize.STRING,
    fac_nums: Sequelize.INTEGER,
    type:Sequelize.TINYINT
}
class Movie extends Model {}

Movie.init(classFields,{
    sequelize:db,
    tableName:"movie"
})

class Sentence extends Model {}

Sentence.init(classFields,{
    sequelize:db,
    tableName:"sentence"
})


class Music extends Model {}
const musicFields = Object.assign(classFields,{
    url: Sequelize.STRING
})

Music.init(musicFields,{
    sequelize:db,
    tableName:"music"
})



module.exports = { Movie ,Music,Sentence}