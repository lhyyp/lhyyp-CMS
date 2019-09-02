





// let api = process.env.NODE_ENV == "development" ? '/api'  : '/backEnd/api'
 const api = {
    login : '/v1/user/login', //登录
    imgApi :'/api/upload',
    
    classic:{
        getListByType:'/v1/classic/getListByType',        //获取资讯列表
        deleteArtByType :'/v1/classic/deleteArtByType',  // 删除资讯
        addArtByType :'/v1/classic/addArtByType',  // 删除资讯
        getArtDeatilByType :'/v1/classic/favor',  // 资讯详情

        
    }
}
export default api
