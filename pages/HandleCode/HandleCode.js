var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    zw:'',
    dhhm:'',
    startdate:'',
    enddate:'',
    receiver:'无',
    modalName:false,
    modalNameno:'',
    peoplename:'',
    peopleeid:'',
    peoplenameselect:'',
    peopleeidselect:'',
    searchcontent:null,
    applylist:null,
    reason:'',
    time_nyr:'',
    sptgimg:'',
    spbhimg:'',
    shzimg:'',
    spzimg:'',
    ygqimg:'',
    page:1,
    lastpage:false,
    loading:false,
    nowtime:'2020-01-01'
  },
  onLoad: function (options) {
    var that=this
    var time = util.formatDate(new Date());
    const res = wx.getSystemInfoSync()
    that.setData({
      startdate: time,
      enddate: time,
      time_nyr:util.formatDate(new Date()),//年月日
      height:res.windowHeight,
      sptgimg:util.sptgimg(),
      spbhimg:util.spbhimg(),
      shzimg:util.shzimg(),
      spzimg:util.spzimg(),
      ygqimg:util.ygqimg(),
    })
    app.globalData.peoplestarttime=''
    app.globalData.peopleendtime=''
    //查询列表数据
    that.search()
  },
  //下拉刷新
  onPullDownRefresh:function(){
    this.search(2)
  },
  //上拉加载更多
  onReachBottom:function(){
    var that=this
    if(!that.data.lastpage){
      that.setData({
        loading:true
      })
      var condition={}
      condition.idNumber=app.globalData.usercardid,
      condition.pageIndex=that.data.page
      wx.request({
        url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/apply/list.do',
        data: {
          condition :JSON.stringify(condition)
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' 
        },
        method: 'POST',
        success(res) {
          if(res.data.status==200){
            var tmpArr = that.data.applylist;
            tmpArr.push.apply(tmpArr,res.data.data.list);
            that.setData({
              applylist:tmpArr,
              page:that.data.page+1,
              lastpage:res.data.data.lastPage,
              loading:false
            })
          }
        //  console.log("_____外来人员查看数据______"+JSON.stringify(res))
        }
      })
    }
    
    
  },
  modify_people:function(e){
    wx.navigateTo({
      url: '../gomodify/gomodify?objuid='+e.currentTarget.dataset.objuid+'&bustype='+e.currentTarget.dataset.bustype
    })
  },
  modify_car:function(e){
      wx.navigateTo({
        url: '../gomodify_car/gomodify_car?objuid='+e.currentTarget.dataset.objuid+'&bustype='+e.currentTarget.dataset.bustype
      })
   },
  modify_goods:function(e){
    wx.navigateTo({
            url: '../gomodify_goods/gomodify_goods?objuid='+e.currentTarget.dataset.objuid+'&bustype='+e.currentTarget.dataset.bustype})
  },
  search:function(flag){
    var that=this
    that.setData({
      page:1
    })
    var startdate=''
    var enddate=''
    if(app.globalData.peoplestarttime){
      startdate=app.globalData.peoplestarttime
    }else{
      startdate=that.data.nowtime
    }
    if(app.globalData.peopleendtime){
      enddate=app.globalData.peopleendtime
    }else{
      enddate=that.data.time_nyr
    }
    
    var condition={}
    condition.idNumber=app.globalData.usercardid
    condition.startDate=startdate
    condition.endDate=enddate
    condition.pageIndex=that.data.page
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/apply/list.do',
      data: {
        condition:JSON.stringify(condition)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        if(res.data.status==200){
          that.setData({
            applylist:res.data.data.list,
            page:that.data.page+1,
            lastpage:res.data.data.lastPage
          })
          if(flag==2){
            wx.stopPullDownRefresh()
          }
        }
      //  console.log("*******"+JSON.stringify(res))
      }
    })
  },
  //撤销
  revoke(e){
    var that=this
    wx.showModal({ 
      title: '提示',
      content: '撤销后表单会被删除，确定要撤销此表单吗？',
      success: function (sm) {
        if (sm.confirm) {
          var ObjuidNum=e.currentTarget.dataset.objuid
          wx.request({
            url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/cancel/apply.do',
            data: {
              objuid:ObjuidNum
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' 
            },
            method: 'POST',
            success(res) {
              if(res.data.status==200){
                wx.showToast({
                  title:'撤销成功' ,
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
        }
      } 
    })
  },
})