// pages/authority_management_add/authority_management_add.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    menulist:[],
    roleName:'',
    roleDesc:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    const res = wx.getSystemInfoSync()
    that.selectMenus()
    that.setData({
      height:res.windowHeight,
    })
  },
  selectMenus:function(){
    var that=this
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/all/menus.do',
      data: {
        idNumber:app.globalData.usercardid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        that.setData({
          menulist: res.data.data,
        })
      //  console.log("_____菜单列表_____"+JSON.stringify(res))
      }
    })
  },
  check:function(e){
    var that=this
    var objuid=e.currentTarget.dataset.objuid
    var list=that.data.menulist
    for(var i=0;i<list.length;i++){
      if(list[i].objuid==objuid){
        list[i].bgColor=list[i].bgColor?false:true
      }
    }
    that.setData({
      menulist:list
    })
  },
  roleName:function(e){
    this.setData({
      roleName:e.detail.value
    })
  },
  roleDesc:function(e){
    this.setData({
      roleDesc:e.detail.value
    })
  },
  save:function(){
    var that=this
    var roleJson={}
    roleJson.roleName=that.data.roleName
    roleJson.roleDesc=that.data.roleDesc
    roleJson.menus=that.data.menulist
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/create/role.do',
      data: {
        roleJson:JSON.stringify(roleJson),
        idNumber :app.globalData.usercardid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        // console.log("————————新增角色保存——————"+JSON.stringify(res))
        if(res.data.status==200){
          wx.showToast({
            title:'保存成功' ,
            icon: 'success',
            duration: 1500
          })
          setTimeout(function() {
            wx.hideToast()
            app.globalData.cartime=''
            wx.reLaunch({
              url: '../authority_management/authority_management'
            })
          }, 2000)
        }
        if(res.data.status==500){
          wx.showToast({
            title:res.data.message ,
            icon: 'none',
            duration: 1500
          })
          setTimeout(function() {
            wx.hideToast()
          }, 2000)
        }
      }
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

  }
})