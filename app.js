//app.js
var util = require('/utils/util.js');
App({
  onLaunch: function() {
    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
         	this.globalData.Custom = capsule;
        	this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
        	this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },
  globalData: {
    http:'http',//本地
    ip:'192.168.194.172:8080',//ip本地 
    // http:'https',//线上
    // ip:'abfree.top',//ip线上
    projectName:'znyq',//项目名称
    appid:'wx78518c4e0cebe111',//appid 
    secret: '769f6c6245dc2ca5f186c85d5ed374d6',   
    usercardid:'',
    useropenid:'',
    jdrmap:{},
    userqx:0,
    miao:1,
    peoplestarttime:'',
    peopleendtime:'',
    cartime:'',
    goodsstarttime:'',
    goodsendtime:'',
    receptionistId:'',
    receptionistName:'',
  }
})