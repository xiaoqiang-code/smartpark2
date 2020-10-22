// pages/Myinformation/Myinformation.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    name:'',
    eid:'',
    phoneNumber:'',
    com:'',
    js:'',
    duty:'',
    role:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const res = wx.getSystemInfoSync()
    that.setData({
      height:res.windowHeight,
    })
    that.select()
  },
  select:function(){
    var that = this
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/my/info.do',
      data: {
        idNumber :app.globalData.usercardid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        // console.log("____个人信息_____"+JSON.stringify(res))
        that.setData({
          name: res.data.data.name,
          eid: res.data.data.eid,
          phoneNumber: res.data.data.phoneNumber,
          role:res.data.data.role,
          com:res.data.data.companyName
        })
      //  console.log("____个人信息_____"+JSON.stringify(res))
      }
    })
  },
  tipexit:function(){
    var that=this
    wx.showModal({
      title: '提示',
      content: '确认注销？',
      success (res) {
        if (res.confirm) {
          that.exit()
        }
      }
    })
  },
  exit:function(){
    var that = this
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/to/logout.do',
      data: {
        idNumber :app.globalData.usercardid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        // console.log("____tuihcu_____"+JSON.stringify(res))
        if(res.data.status==200){
          wx.reLaunch({
            url: '../index/index'
          })
        }
        if(res.data.status==500){
          wx.showToast({
            title:res.data.message ,
            icon: 'none',
            duration: 1000
          })
          setTimeout(function() {
            wx.hideToast()
          }, 5000)
        }
      }
    })
  },
})