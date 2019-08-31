import api from './api.js'
import http from './axios.js'

export const login = (data) => http.post({
    url: api.login,
    ...data
})