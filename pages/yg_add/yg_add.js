// pages/yg_add/yg_add.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    JSlist:'',
    name:'',
    eid:'',
    phoneNumber:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    const res = wx.getSystemInfoSync()
    that.setData({
      height:res.windowHeight,
    })
    that.selectJE()
  },
  name:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  eid:function(e){
    this.setData({
      eid:e.detail.value
    })
  },
  phonenumber:function(e){
    this.setData({
      phoneNumber:e.detail.value
    })
  },
  selectJE:function(){
    var that=this
    var condition={}
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/all/role.do',
      data: {
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        that.setData({
          JSlist:res.data.data
        })
        // console.log("____角色列表____"+JSON.stringify(res))
        
      }
    })
  },
  check:function(e){
    var that=this
    var objuid=e.currentTarget.dataset.objuid
    var list=that.data.JSlist
    for(var i=0;i<list.length;i++){
      if(list[i].objuid==objuid){
        list[i].bgColor=list[i].bgColor?false:true
      }
    }
    that.setData({
      JSlist:list
    })
  },
  save:function(){
    var that=this
    var roleJson={}
    var roleUids = new Array();
    for(var i in that.data.JSlist) {
      if(that.data.JSlist[i].bgColor){
        roleUids.push(that.data.JSlist[i].objuid)
      }
    }
    roleJson.name=that.data.name
    roleJson.eid=that.data.eid
    roleJson.phoneNumber=that.data.phoneNumber
    roleJson.roleUids=roleUids
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/create/emp.do',
      data: {
        emp:JSON.stringify(roleJson),
        idNumber :app.globalData.usercardid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
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
              url: '../role_assignment/role_assignment'
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
})