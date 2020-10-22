const app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    height:'',
    ygtximg:'',
    page:1,
    lastpage:false,
    loading:false,
    YGlist:[],
    searchtext:'',
    objuid:'',
  },
  onLoad: function (options) {
    var that = this
    const res = wx.getSystemInfoSync()
    that.setData({
      height:res.windowHeight,
      ygtximg:util.ygtximg()
    })
    that.selectYG()
  },
  searchtext:function(e){
    this.setData({
      searchtext:e.detail.value
    })
  },
  search:function(){
    this.selectYG()
  },
  selectYG:function(){
    var that=this
    that.setData({
      page:1
    })
    var condition={}
    if(that.data.searchtext){
      condition.name=that.data.searchtext
    }
    condition.pageIndex=that.data.page
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/emps/list.do',
      data: {
        condition:JSON.stringify(condition)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        // console.log("____员工列表____"+JSON.stringify(res))
        if(res.data.status==200){
          that.setData({
            YGlist:res.data.data.list,
            page:that.data.page+1,
            lastpage:res.data.data.lastPage
          })
        }
      }
    })
  },
  //下拉刷新
  onReach:function(){
    var that=this
    if(!that.data.lastpage){
      that.setData({
        loading:true
      })
      var condition={}
      if(that.data.searchtext){
        condition.name=that.data.searchtext
      }
      condition.pageIndex=that.data.page
      wx.request({
        url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/emps/list.do',
        data: {
          condition :JSON.stringify(condition)
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' 
        },
        method: 'POST',
        success(res) {
          // console.log("____员工列表____"+JSON.stringify(res))
          if(res.data.status==200){
            var tmpArr = that.data.YGlist;
            tmpArr.push.apply(tmpArr,res.data.data.list);
            that.setData({
              YGlist:tmpArr,
              page:that.data.page+1,
              lastpage:res.data.data.lastPage,
              loading:false
            })
          }
        }
      })
    }
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },
  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },
  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection =='left'){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  addYG:function(){
    wx.navigateTo({
        url: '../yg_add/yg_add'
      })
  },
  //删除提示
  delete:function(e){
    var that=this
    var objuid=e.currentTarget.dataset.objuid
    wx.showModal({
      title: '提示',
      content: '确认删除此员工？',
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
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/remove/emp/by/objuid.do',
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
  edit:function(e){
    var objuid=e.currentTarget.dataset.objuid
    wx.navigateTo({
      url: '../yg_edit/yg_edit?objuid='+objuid
    })
  }
})