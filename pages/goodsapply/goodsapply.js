// pages/goodsapply/goodsapply.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card:'',
    name:'',
    goodsnum:1,
    goodstype:'',
    goodstypeid:'',
    index:0,
    objuid:'',
    objectArray:[],
    time_nyr:'',
    time_nyrsfm:'',
    height:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var time = util.formatDate(new Date());
    const res = wx.getSystemInfoSync()
    that.setData({
      receivernameselect:app.globalData.receptionistName,
      receiveridselectid:app.globalData.receptionistId,
      time_nyr:util.formatDate(new Date()),//年月日
      time_nyrsfm:util.formatTime(new Date()),//年月日时分秒
      height:res.windowHeight
    })
    app.globalData.goodsstarttime='',
    app.globalData.goodsendtime=''
    //物品类型
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/object/type.do',
      data: {
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        that.setData({
          objectArray: res.data.data,
        })
      //  console.log("物品"+JSON.stringify(res))
      }
    })
    //基础信息
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/person/info.do',
      data: {
        idNumber :app.globalData.usercardid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        if(res.data.status==200){
          that.setData({
            card:res.data.data.idNumber,
            name:res.data.data.name,
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1500
          })
          setTimeout(function() {
            wx.hideToast()
          }, 2000)
        }
      //  console.log("____基础信息____"+JSON.stringify(res))
      }
    })
    //查询接待人数据
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/receptionist/list.do',
      data: {
        idNumber:app.globalData.usercardid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        that.setData({
          peoplelist:res.data.data
        })
      //  console.log("___所有接待人__"+JSON.stringify(res))
      }
    })
  },
  goodsnum(e){
    this.setData({
      goodsnum:e.detail.value
    })
  },
  PickerChange(e){
    var that=this
    that.setData({
      index: e.detail.value,
      objuid:that.data.objectArray[e.detail.value].id,
      goodstype:that.data.objectArray[e.detail.value].name
    })
  },
  DateChange(e) {
    this.setData({
      start_date: e.detail.value
    })
  },
  DateChange2(e) {
    this.setData({
      end_date: e.detail.value
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  radio_receiver:function(e){
    var that=this
    that.setData({
      receiverid:e.currentTarget.dataset.id,
      receivername:e.currentTarget.dataset.value
    })
  },
  receiversure:function(){
    var that=this
    if(that.data.receiverid==null||that.data.receiverid==''){
      wx.showToast({
        title: '请选择接待人!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    that.setData({
      receivernameselect:that.data.receivername,
      receiveridselectid:that.data.receiverid,
      modalName: null
    })
  },
  bfdwss(e){
    this.setData({
      bfdwss:e.detail.value
    })
  },
  comsearch:function(e){
    var that=this
    
    //接待人
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/receptionist/list.do',
      data: {
        name:that.data.bfdwss
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        that.setData({
          peoplelist: res.data.data,
        })
      //  console.log("____搜索接待人_____"+JSON.stringify(res))
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

  },
  submitapply:function(){
    var that=this
    if (that.data.goodsnum == '' || that.data.goodsnum == null) {
      wx.showToast({
        title: '物品数量不得为空!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    if (that.data.goodstype.replace(/\s*/g, "") == '' || that.data.goodstype == null) {
      wx.showToast({
        title: '请选择(限制)物品类型!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    if (that.data.receiveridselectid.replace(/\s*/g, "") == '' || that.data.receiveridselectid == null) {
      wx.showToast({
        title: '请选择接待人!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    if (that.data.start_date>that.data.end_date) {
      wx.showToast({
        title: '起始日期不能大于结束日期!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    var formList = {};
    formList.idNumber=app.globalData.usercardid
    formList.objectCount=that.data.goodsnum
    formList.objectTypeUid=that.data.objuid
    
    formList.receptionist=that.data.receiveridselectid

    if(app.globalData.goodsstarttime){
      formList.objectAuthStartDate=app.globalData.goodsstarttime
    }else{
      formList.objectAuthStartDate=that.data.time_nyr+" 00:00:00"
    }
    if(app.globalData.goodsendtime){
      formList.objectAuthEndDate=app.globalData.goodsendtime
    }else{
      formList.objectAuthEndDate=that.data.time_nyr+" 23:59:59"
    }

    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/object/apply/create.do',
      data: {
        formList:JSON.stringify(formList)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        if(res.data.status==200){
          wx.showToast({
            title:'申请成功' ,
            icon: 'success',
            duration: 1500
          })
          setTimeout(function() {
            wx.hideToast()
            app.globalData.goodsstarttime='',
            app.globalData.goodsendtime=''
            wx.reLaunch({
              url: '../index/index?miao=2'
            })
          }, 2000)
          
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
      //  console.log("_____物品申请______"+JSON.stringify(res))
      }
    })
  }
})