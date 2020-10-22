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
    //查询审批人
    that.loadSPR()
  },
  //搜索审批人
  comsearch:function(){
    var that=this
    this.loadSPR(that.data.sprname)
  },
  //搜索赋值
  bfdwss:function(e){
    this.setData({
      sprname:e.detail.value
    })
  },
  //点击单个审批人
  radio_receiver:function(e){
    var that=this
    that.data.spr_select_temp = {};
    that.data.spr_select_temp[e.currentTarget.dataset.id] = e.currentTarget.dataset.value;
  },
  //审批人选择确定
  receiversure:function(e){
    var that=this

    //利用当前表单主键获取到此表单指定的审批人集合MAP
    var formSelectMap = that.data.spr_select_form_list[that.data.objuid];
    //如果这个Map不存在，说明可能是第一次进入界面，或者后台没有传递默认值
    if(!formSelectMap){
      formSelectMap = {};
      that.data.spr_select_form_list[that.data.objuid] = formSelectMap;
    }

    for(var key in that.data.spr_select_temp){
      if(key in formSelectMap) {
        wx.showToast({
          title:'当前审批人已选' ,
          icon: 'none',
          duration: 1500
        })
        setTimeout(function() {
          wx.hideToast()
        }, 2000)
      }
      formSelectMap[key] = that.data.spr_select_temp[key];
    }
    var arr = new Array();
    for(var key in formSelectMap){
      var obj = {id : key, name : formSelectMap[key]};
      arr.push(obj);
    }
    that.setData({
      spr_select_list:arr
    })
    
  },
  deletespr:function(e){
    var that=this
    var objuid = that.data.objuid;
    var id=e.currentTarget.dataset.id;
    var sprSelectMap = that.data.spr_select_form_list[objuid];
    if(!sprSelectMap) {
      sprSelectMap = {};
      that.data.spr_select_form_list[objuid] = sprSelectMap;
    }else{
      delete sprSelectMap[id];
    }
    var arr = new Array();
    for(var key in sprSelectMap){
      var obj = {id : key, name : sprSelectMap[key]};
      arr.push(obj);
    }
    that.setData({
      spr_select_list:arr
    })
  },
  //隐藏审批人列表窗口
  hideModalreceiver:function(){
    this.setData({
      modalNamereceiver:''
    })
  },
  //搜索审批人
  loadSPR:function(name){
    if(!name) {
      name = '';
    }
    var that=this
    //查询接待人数据
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/approver/list.do',
      data: {
        name:name
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        that.setData({
          sprlist:res.data.data
        })
      //  console.log("___所有审批人__"+JSON.stringify(res))
      }
    })
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
        url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/check/list.do',
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
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/check/list.do',
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
  //隐藏审批人窗口
  hideModal:function(){
    this.setData({
      modalName: ""
    })
  },
  //审核通过前置
  selectSPR:function(e){
    var that = this
    var sprSelectMap = that.data.spr_select_form_list[e.currentTarget.dataset.objuid];
    if(!sprSelectMap) {
      sprSelectMap = {};
      that.data.spr_select_form_list[e.currentTarget.dataset.objuid] = sprSelectMap;
    }
    var arr = new Array();
    for(var key in sprSelectMap){
      var obj = {id : key, name : sprSelectMap[key]};
      arr.push(obj);
    }
    this.setData({
      modalName: e.currentTarget.dataset.target,
      objuid:e.currentTarget.dataset.objuid,
      bustype:e.currentTarget.dataset.bustype,
      spr_select_list:arr
    })
  },
  //添加审批人
  addspr:function(){
    //查询审批人
    this.loadSPR()
    this.setData({
      modalNamereceiver: "bottomModal"
    })
  },
  //审核通过
  pass:function(e){
    var that=this
    var pass={}
    pass.objuid=that.data.objuid
    pass.busType=that.data.bustype
    pass.idNumber=app.globalData.usercardid
    pass.sprarr=that.data.spr_select_list
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/apply/check/pass.do',
      data: {
         param:JSON.stringify(pass)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        if(res.data.status==200){
          wx.showToast({
            title:'审核通过成功' ,
            icon: 'success',
            duration: 1500
          })
          setTimeout(function() {
            that.setData({
              modalName:''
            })
            wx.hideToast()
          }, 2000)
          that.onLoad()
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
          return
        }
      //  console.log("___通过成功返回数据___"+JSON.stringify(res))
      }
    })
  },
  //打开填写原因窗口
  rejectReason:function(e){
    this.setData({
      modalNameBH:'DialogModal',
      bustype:e.currentTarget.dataset.bustype,
      objuid:e.currentTarget.dataset.objuid
    })
  },
  //隐藏填写原因窗口
  rejectReasonHide:function(){
    var that=this
    that.setData({
      modalNameBH:'',
      reason:'',
      bustype:'',
      objuid:''
    })
  },
  //驳回原因
  reason(e){
    this.setData({
      reason:e.detail.value
    })
    // console.log("___"+e.detail.value)
  },
  //驳回提交
  reject:function(e){
    var that=this
    if(that.data.reason.replace(/\s*/g, "") == '' || that.data.reason == null){
      wx.showToast({
        title: '请填写驳回原因!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    var reject={}
    reject.objuid=that.data.objuid
    reject.busType=that.data.bustype
    reject.reason=that.data.reason
    reject.idNumber=app.globalData.usercardid
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/apply/check/reject.do',
      data: {
         param:JSON.stringify(reject)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        if(res.data.status==200){
          wx.showToast({
            title:'驳回成功' ,
            icon: 'success',
            duration: 1500
          })
          setTimeout(function() {
            that.setData({
              modalNameBH:'',
              reason:'',
              bustype:'',
              objuid:''
            })
            wx.hideToast()
          }, 2000)
          that.setData({
            modalNameno: null
          })
          that.onLoad()
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
          return
        }
      //  console.log("___驳回返回数据___"+JSON.stringify(res))
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