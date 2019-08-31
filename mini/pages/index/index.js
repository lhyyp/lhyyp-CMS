//index.js
//获取应用实例
const app = getApp()
import { Base64 }  from "js-base64"

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
  },
  getToken () {
    wx.login({
      success : (res) => {
        console.log(res.code)
        if(res.code){
          wx.request({
            url: 'http://127.0.0.1:3005/v1/user/login',
            method:'Post',
            data:{
              account : res.code,
              type: 103
              
            },
            success: (res)=>{
              console.log(res)
              const token = res.data.data.token;
              console.log(token)
              wx.setStorageSync('token', token)
            }
          })
        }
      }
    })

  },
  verifyToken() {
    console.log(wx.getStorageSync("token"),111)
    wx.request({
      url: 'http://127.0.0.1:3005/v1/user/verify',
      method: 'Post',
      data: {
        token: "wx.getStorageSync("
      },
      success: (res) => {
        console.log(res)
      }
    })

  },
  ongetlatest() {
    wx.request({
      url: 'http://127.0.0.1:3005/v1/classic/latest',
      header:{
        Authorization: this.encode1()
      },
      success: (res) => {
        console.log(res)
      }
    })

  },
  onlike(){
    wx.request({
      url: 'http://127.0.0.1:3005/v1/classic/like',
      method:'POST',
      data:{
        "art_id":1,
        "type":1
      },
      header: {
        Authorization: this.encode1()
      },
      success: (res) => {
        console.log(res)
      }
    })

  },
  ondislike(){
    wx.request({
      url: 'http://127.0.0.1:3005/v1/classic/dislike',
      method: 'POST',
      data: {
        "art_id": 1,
        "type": 1
      },
      header: {
        Authorization: this.encode1()
      },
      success: (res) => {
        console.log(res)
      }
    })

  },
  encode1(){
    console.log(1)
    const token = wx.getStorageSync("token")
    const base64 = Base64.encode(token+":")
    return "Basic "+ base64

  }

})
