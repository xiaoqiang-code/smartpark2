// pages/peopleapply/peopleapply.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card:'',
    name:'',
    company2:'',
    cause:'',
    companyselect:'',
    companyid:'',
    companyselectid:'',
    cardnum:'',
    goodsnum:'',
    cardtype:'',
    goodstype:'',
    start_date: '2000-01-01',
    end_date: '2000-01-01',
    start_date2: '2000-01-01',
    index:0,
    index2:0,
    objuid:'',
    objuid2:'',
    automobile:false,
    automobiletext:'添加车辆',
    goods:false,
    goodstext:'添加(限制)物品',
    objectArray: [{
      id: 2222,
      name: '无脊柱动物'
    },
    {
      id: 33333,
      name: '脊柱动物'
    }],
    objectArray2: [{
      id: 2222,
      name: '无脊柱动物8898'
    },
    {
      id: 33333,
      name: '脊柱动物7766'
    }],
    unitlist: [{
      id: '111111',
      value: '电脑1'
    }, {
      id: '22222222',
      value: '电脑2'
    }, {
      id: '3333333',
      value: '电脑3'
    }], 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var time = util.formatDate(new Date());
    // wx.request({
    //   url: 'http://192.168.194.172:8088/znyq/api/get/car/type.do',
    //   data: {
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' 
    //   },
    //   method: 'POST',
    //   success(res) {
    //     that.setData({
    //       objectArray: res.data.data,
    //     })
    //    console.log(JSON.stringify(res))
    //   }
    // })
    that.setData({
      start_date: time,
      end_date: time,
      start_date2:time
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
  DateChange3(e) {
    this.setData({
      start_date2: e.detail.value
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  PickerChange(e) {
    var that=this
    this.setData({
      index: e.detail.value,
      objuid:that.data.objectArray[e.detail.value].id,
      cardtype:that.data.objectArray[e.detail.value].name
    })
    console.log(this.data.objuid)
  },
  PickerChange2(e) {
    var that=this
    this.setData({
      index2: e.detail.value,
      objuid2:that.data.objectArray2[e.detail.value].id,
      goodstype:that.data.objectArray2[e.detail.value].name
    })
    console.log(this.data.objuid2)
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
  card:function(e){
    var that=this
    that.setData({
      card:e.detail.value
    })
    console.log(that.data.card)
    console.log(that.data.start_date)
  },
  name:function(e){
    var that=this
    that.setData({
      name:e.detail.value
    })
    console.log(that.data.name)
  },
  company:function(e){
    var that=this
    that.setData({
      company2:e.detail.value
    })
    console.log(that.data.company)
  },
  textareaAInput:function(e){
    var that=this
    that.setData({
      cause:e.detail.value
    })
    console.log(that.data.cause)
  },
  addautomobile:function(){
    var that=this
    if(that.data.automobile){
      that.setData({
        automobiletext:'添加车辆',
        automobile:false,
      })
    }else{
      that.setData({
        automobiletext:'删除车辆',
        automobile:true,
      })
    }
  },
  addgoods:function(){
    var that=this
    if(that.data.goods){
      that.setData({
        goodstext:'添加(限制)物品',
        goods:false,
      })
    }else{
      that.setData({
        goodstext:'删除(限制)物品',
        goods:true,
      })
    }
  },
  companysure:function(){
    var that=this
    that.setData({
      companyselect:that.data.company,
      companyselectid:that.data.companyid,
      modalName: null
    })
    console.log(that.data.companyselect)
    console.log(that.data.companyselectid)
  },
  radio_select:function(e){
    var that=this
    that.setData({
      companyid:e.currentTarget.dataset.id,
      company:e.currentTarget.dataset.value
    })
    console.log(that.data.companyid)
    console.log(that.data.company)
  },
  cardnum:function(e){
    var that=this
    that.setData({
      cardnum:e.detail.value,
    })
  },
  goodsnum:function(e){
    var that=this
    that.setData({
      goodsnum:e.detail.value,
    })
  },
  submitapply:function(){
    var that=this
    if (that.data.card.replace(/\s*/g, "") == '' || that.data.card == null) {
      wx.showToast({
        title: '身份证号不得为空!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    if (that.data.name.replace(/\s*/g, "") == '' || that.data.name == null) {
      wx.showToast({
        title: '姓名不得为空!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    if (that.data.company.replace(/\s*/g, "") == '' || that.data.company == null) {
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
    if (that.data.companyselect.replace(/\s*/g, "") == '' || that.data.companyselect == null) {
      wx.showToast({
        title: '请选择类型!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    var formlist={}
    formlist.card=that.data.card
    formlist.name=that.data.name
    formlist.company=that.data.company2
    formlist.companyselectid=that.data.companyselectid

    console.log(JSON.stringify(formlist))

  }
})