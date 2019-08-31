function isThisType(val) {
    for (let key in this) {
        if (this[key] === val) {
            return true
        }
    }
    return false

}

const LoginType = {
    USER_EMAIL: 101,
    USER_IPHONE: 102,
    USER_MINI_PROGRAM:103,
    isThisType
}
const classicType = {
    movie: 1,
    music: 2,
    sentence:3,
    isThisType
}

module.exports = { LoginType,classicType } 