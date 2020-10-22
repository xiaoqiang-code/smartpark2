// pages/qrcode/qrcode.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodeimg:'',
    height:'',
    width:'',
    left:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var objuid=options.objuid
    var bustype=options.bustype
    const res = wx.getSystemInfoSync()
    var l=(res.windowWidth-230)/2
    var l2=(res.windowWidth-220)/2
    that.setData({
      height:res.windowHeight,
      width:res.windowWidth,
      qrcodeimg:util.qrcodeimg(),
      left:l,
      left2:l2,
      src:app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/qrcode/by/form/objuid.do?objuid='+objuid+'&busType='+bustype
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goback(){
    wx.reLaunch({
      url: '../receiveraudit/receiveraudit'
    })
  },
  goindex(){
    wx.navigateBack({})
  }
})