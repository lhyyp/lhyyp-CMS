const Logger = require('../utils/logs')
const { Sequelize, Model } = require("sequelize")
const {
    clone,
    isArray,
    unset
} = require("lodash")
const {
    dbName,
    host,
    port,
    user,
    password
} = require("../config/config").database

const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host,
    port,
    logging: true,
    timezone: "+08:00",
    define: {
        //更多查看https://itbilu.com/nodejs/npm/VkYIaRPz-.html#api-instance-method
        timestamps: true,  //为模型添加 createdAt 和 updatedAt 两个时间戳字段
        paranoid: true,    //使用逻辑删除。设置为true后，调用 destroy 方法时将不会删队模型，而是设置一个 deletedAt 列。此设置需要 timestamps=true 
        underscoredAll: false,   //转换模型名的驼峰命名规则为表名的下划线命令规则

    },
    logging: function (sql) {    // sql写入操作日志
        Logger.logHandle(sql);
    }

})
sequelize.sync({
    force: false
})

// 序列化json
Model.prototype.toJSON = function () {
    let data = clone(this.dataValues)
    if (isArray(this.exclude)) {
        this.exclude.forEach(value => {
            unset(data, value)
        });
    }
    return data
}
module.exports = {
    db: sequelize
}

