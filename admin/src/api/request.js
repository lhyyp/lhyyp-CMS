import api from './api.js'
import http from './axios.js'
/**
 * 登录
 * @param {*} params 
 */
export const userLogin = (params) => http.post(
    api.login,
    params
)
/**
 * 获取验证码
 * @param {*} params 
 */
export const verifyCode = () => http.get(
    api.verifyCode
)
/**
 * 
 * @param {*获取不同分类资讯列表} params 
 */

export const getListByType = (params) => http.get(
    api.classic.getListByType,
    params
)

/**
 * 删除资讯
 * @param {*} params 
 */
export const deleteArtByType = (params) => http.post(
    api.classic.deleteArtByType,
    params
)

/**
 * 添加资讯
 * @param {*} params 
 */

export const addArtByType = (params) => http.post(
    api.classic.addArtByType,
    params
)


/**
 * 资讯详情
 * @param {*} params 
 */

export const getArtDeatilByType = (params) => http.get(
    api.classic.getArtDeatilByType,
    params
)




