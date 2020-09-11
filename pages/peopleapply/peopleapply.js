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
    duty:'',
    phonenum:'',
    company2:'',
    cause:'',
    companyselect:'',
    companyid:'',
    companyselectid:'',
    cardnum:'',
    goodsnum:'',
    cardtype:'',
    goodstype:'',
    scrolllocation:0,
    carbgcolor:'#6393e5',
    goodsbgcolor:'#6393e5',
    start_date: '2000-01-01',
    end_date: '2000-01-01',
    start_date2: '2000-01-01',
    goods_start_date:'',
    goods_end_date:'',
    index:0,
    index2:0,
    objuid:'',
    objuid2:'',
    bfdwss:'',
    automobile:false,
    display:true,
    automobiletext:'添加车辆',
    goods:false,
    goodstext:'添加(限制)物品',
    objectArray: [],
    objectArray2: [],
    unitlist: [], 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var time = util.formatDate(new Date());
    //车辆类型
    wx.request({
      url: 'http://192.168.194.172:8088/znyq/api/get/car/type.do',
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
       console.log(JSON.stringify(res))
      }
    })
    //物品类型
    wx.request({
      url: 'http://192.168.194.172:8088/znyq/api/get/object/type.do',
      data: {
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        that.setData({
          objectArray2: res.data.data,
        })
       console.log("物品"+JSON.stringify(res))
      }
    })
    //拜访单位
    wx.request({
      url: 'http://192.168.194.172:8088/znyq/api/get/dept/list.do',
      data: {
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        that.setData({
          unitlist: res.data.data,
        })
       console.log("####"+JSON.stringify(res))
      }
    })
    //基础信息
    wx.request({
      url: 'http://192.168.194.172:8088/znyq/api/get/person/info.do',
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
            duty:res.data.data.businessName,
            phonenum:res.data.data.phoneNumber,
            company2:res.data.data.companyName
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
       console.log("*****"+JSON.stringify(res))
      }
    })
    that.setData({
      start_date: time,
      end_date: time,
      start_date2:time,
      goods_start_date:time,
      goods_end_date:time
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
  goodsDateChange(e){
    this.setData({
      goods_start_date: e.detail.value
    })
  },
  goodsDateChange2(e){
    this.setData({
      goods_end_date: e.detail.value
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      display:false
    })
  },
  hideModal(e) {
    this.setData({
      display:true,
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
  },
  PickerChange2(e) {
    var that=this
    this.setData({
      index2: e.detail.value,
      objuid2:that.data.objectArray2[e.detail.value].id,
      goodstype:that.data.objectArray2[e.detail.value].name
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
  card:function(e){
    var that=this
    that.setData({
      card:e.detail.value
    })
  },
  name:function(e){
    var that=this
    that.setData({
      name:e.detail.value
    })
  },
  duty:function(e){
    var that=this
    that.setData({
      duty:e.detail.value
    })
  },
  phonenum:function(e){
    var that=this
    that.setData({
      phonenum:e.detail.value
    })
  },
  company:function(e){
    var that=this
    that.setData({
      company2:e.detail.value
    })
  },
  textareaAInput:function(e){
    var that=this
    that.setData({
      cause:e.detail.value
    })
  },
  addautomobile:function(){
    var that=this
    if(that.data.automobile){
      that.setData({
        scrolllocation:0,
        automobiletext:'添加车辆',
        automobile:false,
        carbgcolor:'#6393e5'
      })
    }else{

      that.setData({
        scrolllocation:500,
        automobiletext:'删除车辆',
        automobile:true,
        carbgcolor:'red'
      })
    }
  },
  addgoods:function(){
    var that=this
    if(that.data.goods){
      that.setData({
        scrolllocation:0,
        goodstext:'添加(限制)物品',
        goods:false,
        goodsbgcolor:'#6393e5'
      })
    }else{
      that.setData({
        scrolllocation:800,
        goodstext:'删除(限制)物品',
        goods:true,
        goodsbgcolor:'red'
      })
    }
  },
  companysure:function(){
    var that=this
    if(that.data.companyid==null||that.data.companyid==''){
      wx.showToast({
        title: '请选择拜访单位!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    that.setData({
      companyselect:that.data.company,
      companyselectid:that.data.companyid,
      modalName: null,
      display:true
    })
  },
  radio_select:function(e){
    var that=this
    that.setData({
      companyid:e.currentTarget.dataset.id,
      company:e.currentTarget.dataset.value
    })
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
  bfdwss(e){
    this.setData({
      bfdwss:e.detail.value
    })
  },
  comsearch:function(e){
    var that=this
    
    //拜访单位
    wx.request({
      url: 'http://192.168.194.172:8088/znyq/api/get/dept/list.do',
      data: {
        deptName:that.data.bfdwss
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        that.setData({
          unitlist: res.data.data,
        })
       console.log("##拜访单位搜索列表##"+JSON.stringify(res))
      }
    })
  },
  submitapply:function(){
    var that=this
    console.log(999888777)
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
    if (that.data.duty.replace(/\s*/g, "") == '' || that.data.duty == null) {
      wx.showToast({
        title: '职务不得为空!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    if (that.data.phonenum.replace(/\s*/g, "") == '' || that.data.phonenum == null) {
      wx.showToast({
        title: '电话号码不得为空!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    if (that.data.company2.replace(/\s*/g, "") == '' || that.data.company2 == null) {
      wx.showToast({
        title: '所属公司不得为空!',
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
        title: '请选择拜访单位!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    if(that.data.automobile){
      if (that.data.cardnum.replace(/\s*/g, "") == '' || that.data.cardnum == null) {
        wx.showToast({
          title: '车牌号不得为空!',
          icon: 'none',
          duration: 1500
        })
        setTimeout(function() {
          wx.hideToast()
        }, 2000)
        return
      }
      if (that.data.cardtype.replace(/\s*/g, "") == '' || that.data.cardtype == null) {
        wx.showToast({
          title: '请选择车辆类型!',
          icon: 'none',
          duration: 1500
        })
        setTimeout(function() {
          wx.hideToast()
        }, 2000)
        return
      }
    }
    if(that.data.goods){
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
      if (that.data.goodsnum.replace(/\s*/g, "") == '' || that.data.goodsnum == null) {
        wx.showToast({
          title: '(限制)物品数量不得为空!',
          icon: 'none',
          duration: 1500
        })
        setTimeout(function() {
          wx.hideToast()
        }, 2000)
        return
      }
    }
    var formlist={}
    
    formlist.idNumber=that.data.card
    formlist.name=that.data.name
    formlist.businessName=that.data.duty
    formlist.phoneNumber=that.data.phonenum
    formlist.personAuthStartDate=that.data.start_date
    formlist.personAuthEndDate=that.data.end_date
    formlist.companyName=that.data.company2
    formlist.managerDeptUid=that.data.companyselectid
    formlist.reasonForVisiting=that.data.cause
    if(that.data.automobile){
      var carInfo = {};
      carInfo.plateNumber=that.data.cardnum
      carInfo.carTypeUid=that.data.objuid
      carInfo.carAuthDate=that.data.start_date2
      formlist.carInfo = carInfo;
      console.log(formlist)
    }else{
      
    }
    if(that.data.goods){
      var objectInfo = {};
      objectInfo.objectTypeUid=that.data.objuid2
      objectInfo.objectCount=that.data.goodsnum
      objectInfo.objectAuthStartDate=that.data.goods_start_date
      objectInfo.objectAuthEndDate=that.data.goods_start_date
      formlist.objectInfo=objectInfo
    }else{
      
    }
    
    wx.request({
      url: 'http://192.168.194.172:8088/znyq/api/person/apply/create.do',
      data: {
        formList:JSON.stringify(formlist)
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
       console.log(JSON.stringify(res))
      }
    })
  }
})