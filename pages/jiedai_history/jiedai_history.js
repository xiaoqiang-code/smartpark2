var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startdate: '2020-01-01',//查询条件开始时间
    enddate: util.formatDate(new Date()),//查询条件结束时间
    reason:'',
    applylist:[],
    page:1,
    lastpage:false,
    loading:false,
    sptgimg:'',
    spbhimg:'',
    shzimg:'',
    spzimg:'',
    ygqimg:'',
    objuid:'',
    bustype:'',
    modalName:'',
    modalNameBH:'',
    sprlist:[],
    sprname:'',
    sprarr:[],
    spr_select_form_list:{},//此对象存放每个表单指定的审批人 key:表单主键 value：object value中的对象存放审批人主键id和审批人姓名name
    spr_select_list:[],
    spr_select_temp:[],
    spr_select_id:'',
    spr_select_name:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var time = util.formatDate(new Date());
    const res = wx.getSystemInfoSync()
    that.setData({
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
      var startdate=''
      var enddate=''
      if(app.globalData.peoplestarttime){
        startdate=app.globalData.peoplestarttime
      }else{
        startdate=that.data.startdate
      }
      if(app.globalData.peopleendtime){
        enddate=app.globalData.peopleendtime
      }else{
        enddate=that.data.enddate
      }
      
      var condition={}
      condition.idNumber=app.globalData.usercardid
      condition.startDate=startdate
      condition.endDate=enddate
      condition.pageIndex=that.data.page
      wx.request({
        url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/check/history/list.do',
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
      startdate=that.data.startdate
    }
    if(app.globalData.peopleendtime){
      enddate=app.globalData.peopleendtime
    }else{
      enddate=that.data.enddate
    }
    var condition={}
    condition.idNumber=app.globalData.usercardid
    condition.startDate=startdate
    condition.endDate=enddate
    condition.pageIndex=that.data.page
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/check/history/list.do',
      data: {
        condition:JSON.stringify(condition)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        if(res.data.status==200){
          var list=res.data.data.list

          for(var i=0;i<list.length;i++){
            that.data.spr_select_form_list[list[i].objuid] = list[i].sprSelectMap;
          }
          that.setData({
            applylist:res.data.data.list,
            page:that.data.page+1,
            lastpage:res.data.data.lastPage
          })
          if(flag==2){
            wx.stopPullDownRefresh()
          }
          app.globalData.peoplestarttime=''
          app.globalData.peopleendtime=''
        }
      //  console.log("____接待人查询所有数据_____"+JSON.stringify(res))
      }
    })
  },
  //二维码
  qrcode:function(e){
    var objuid=e.currentTarget.dataset.objuid
    var bustype=e.currentTarget.dataset.bustype
    wx.navigateTo({
      url: '../qrcode/qrcode?objuid='+objuid+'&bustype='+bustype
    })
  }

})