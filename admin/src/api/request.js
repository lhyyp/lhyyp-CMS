import api from './api.js'
import http from './axios.js'
/**
 * 
 * @param {*登录} params 
 */
export const userLogin = (params) => http.post(
    api.login,
    params
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




