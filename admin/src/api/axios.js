import axios from 'axios';
import  { Base64 }  from "js-base64"
import {
    Loading,
    Message,
    MessageBox
} from 'element-ui';
import store from '../store/index';
import router from '../router/index';
import { sessionStorage } from 'src/assets/js/storage';

if (!store.state.token) {
    store.commit('SET_TOKEN', sessionStorage.getItem('token'));
}
const encode = () => {
    const token = store.state.token
    const base64 = Base64.encode(token+":")
    return "Basic "+ base64

  }

// axios 配置
console.log(process.env.NODE_ENV)
const http = axios.create({
    baseURL: process.env.NODE_ENV == "development" ? '/api' : '/backEnd/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: encode()
    },
    transformRequest: [function (data, headers) {
        if (headers['Content-type'] === 'multipart/form-data') {
            return data;
        } else {
            return JSON.stringify(data);
        }
    }]
});


var loadingInstance;

// 请求拦截器
http.interceptors.request.use(config => {
    loadingInstance = Loading.service({
        fullscreen: true,
        lock: true,
        text: '正在请求数据...'
    });

    // 开发环境下，如果请求是 post,put,patch,则打印数据体，方便调试
    if (process.env.NODE_ENV === 'development') {
        const { method } = config;
        if (method === 'post' || method === 'put' || method === 'patch') {
            console.log(config.data);
        }
    }

    return config;
}, error => {
    loadingInstance.close();
    Message.error({
        message: '请求失败'
    });
    return Promise.reject(error);
});

// 响应拦截器
http.interceptors.response.use(res => {
    loadingInstance.close();
    return res.data;
}, error => {
    loadingInstance.close();
    if (error && error.response) {
        switch (error.response.status) {
            // 401 token失效
            case 401:
                MessageBox.alert('身份信息已过期，请重新登陆', '提示', {
                    confirmButtonText: '重新登陆',
                    showClose: false,
                    type: 'error',
                    callback: action => {
                        router.replace({
                            path: '/login',
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        });
                    }
                });
                break;
        }
        return Promise.reject(error);
    }
});

export default http;
