import axios from 'axios'
import router from '../router/index';
import {
    Loading,
    Message,
    MessageBox
} from 'element-ui';
class AjaxRequest {

    constructor() {
        // this.baseURL = process.env.NODE_ENV == "production" ? '/' : 'http://localhost:300'
        this.timeout = 10000 //超时时间
        this.queue ={} // 每次的请求的路径
        this.loadingInstance = ""
    }

    merge(options) {
        return { ...options, baseURL: this.baseURL, timeout: this.timeout }
    }

    setInterceptor(instance, url) {
        instance.interceptors.request.use( (config) => {
            if(Object.keys(this.queue).length===0){
                // this.loadingInstance = Loading.service({
                //     fullscreen: true,
                //     lock: true,
                //     text: '正在请求数据...'
                // });
            }
            config.headers={
                Authorization: localStorage.getItem('token')
            }
            this.queue[url] = url
            return config;
        },  (error) => {
            delete this.queue[url]     //请求成功删除队列的请求路径
            if(Object.keys(this.queue).length===0){  // 请求队列为空关闭 loading
                // this.loadingInstance.close();
            }
            Message.error({
                message: '请求失败'
            });
            return Promise.reject(error);
        });

        instance.interceptors.response.use( (response) => {
            delete this.queue[url]  //请求成功删除队列的请求路径
            if(Object.keys(this.queue).length===0){  // 所有的請求成功关闭 loading
                // this.loadingInstance.close();
            }
            if (response.status === 200) {
                return response.data;
            } else {
                if(response.data.code === 401){    // 登录失效
                    router.replace({
                        path: '/login',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                }
                return response.data;
            }
        },  (error) => {
            delete this.queue[url]     //请求成功删除队列的请求路径
            if(Object.keys(this.queue).length===0){  // 请求队列为空关闭 loading
                // this.loadingInstance.close();
            }
            Message.error({
                message: '请求失败'
            });
            return Promise.reject(error);
        });
    }
    request(options) {
        let instance = axios.create()  // 创建一个axios实例
        this.setInterceptor(instance, options.url)
        let config = this.merge(options)
        return instance(config)   //axios执行返回的promise
    }
    post(options){
        let config = { ...options, method: 'post'}
        return this.request(config)

    }
    get(options){
        let config = { ...options, method: 'get'}
        return this.request(config)

    }
}
export default new AjaxRequest()