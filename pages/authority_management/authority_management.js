// pages/authority_management/authority_management.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    JSList:[],
    bgimg:'',//背景图片
    objuid:'',
    roleDesc:'',
    roleName:'',
    modalNameCK:'',
    menus:[],
    titleimg:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    const res = wx.getSystemInfoSync()
    that.setData({
      height:res.windowHeight,
      bgimg:util.bgimg(),
      titleimg:util.titleimg(),
    })
    that.selectJS()
  },
  //查询角色
  selectJS:function(){
    var that=this
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/all/role.do',
      data: {
        idNumber:app.globalData.usercardid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        that.setData({
          JSList: res.data.data,
        })
      //  console.log("_____角色列表_____"+JSON.stringify(res))
      }
    })
  },
  //删除提示
  delete:function(e){
    var that=this
    var objuid=e.currentTarget.dataset.objuid
    wx.showModal({
      title: '提示',
      content: '确认删除此角色？',
      success (res) {
        if (res.confirm) {
          that.suredelete(objuid)
        }
      }
    })
  },
  //删除
  suredelete:function(objuid){
    var that=this
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/remove/role/by/objuid.do',
      data: {
        objuid:objuid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        if(res.data.status==200){
          wx.showToast({
            title:'删除成功' ,
            icon: 'success',
            duration: 1500
          })
          setTimeout(function() {
            wx.hideToast()
            that.onLoad()
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
  watch:function(e){
    var that=this
    that.setData({
      objuid:e.currentTarget.dataset.objuid,
      roleDesc:e.currentTarget.dataset.roledesc,
      roleName:e.currentTarget.dataset.rolename,
      modalNameCK:'DialogModal',
    })
    // console.log(that.data.roleName)
    for(var i=0;i<that.data.JSList.length;i++){
      if(that.data.JSList[i].objuid==that.data.objuid){
        that.setData({
          menus:that.data.JSList[i].menus
        })
      }
    }
  },
  hideModalCK:function(){
    this.setData({
      objuid:'',
      roleDesc:'',
      roleName:'',
      modalNameCK:'',
    })
  },
  edit:function(e){
    var that=this
    wx.navigateTo({
      url: '../authority_management_edit/authority_management_edit?roleName='+e.currentTarget.dataset.rolename+'&roleDesc='+e.currentTarget.dataset.roledesc+'&objuid='+e.currentTarget.dataset.objuid
    })
  },
  add:function(){
    wx.navigateTo({
      url: '../authority_management_add/authority_management_add'
    })
  }

})