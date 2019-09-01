const bcrypt = require("bcryptjs")
const { db } = require("../../utils/db")
const { Sequelize, Model } = require("sequelize")
const { NotFount, Authfailed, MissingParameters } = require("../../utils/http-exception")


class User extends Model {
    static async verifyEmailPassword(email, plainPassword) {
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (!user) {
            throw new NotFount("账号不存在")
        }
        if (!plainPassword) {
            throw new MissingParameters("缺少密码参数")
        }
        const correct = bcrypt.compareSync(plainPassword, user.password)
        if (!correct) {
            throw new Authfailed("密码不正确")
        }
        return user
    }
    static async verifyUserNamePassword(userName, plainPassword) {
        const user = await User.findOne({
            where: {
                userName
            }
        })
        if (!user) {
            throw new NotFount("账号不存在")
        }
        if (!plainPassword) {
            throw new MissingParameters("缺少密码参数")
        }
        const correct = bcrypt.compareSync(plainPassword, user.password)
        if (!correct) {
            throw new Authfailed("密码不正确")
        }
        return user
    }

    static async getUserByopenid(openid) {
        const user = await User.findOne({
            where: {
                openid
            }
        })
        return user

    }
    static async registerByopenid(openid) {
        return await User.create({
            openid
        })

    }


}


User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: ''
    },
    userName: Sequelize.STRING,
    openid: Sequelize.STRING,
    password: {
        type: Sequelize.STRING,
        set(val) {
            const salt = bcrypt.genSaltSync(10)
            const psw = bcrypt.hashSync(val, salt)
            this.setDataValue("password", psw)
        }
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    }
}, { sequelize: db })

module.exports = { User }