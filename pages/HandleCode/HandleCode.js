var app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    xm:'',
    lfsy:'',
    sqrq:'',
    lfdw:'',
    tjsj:'',
    ssgs:'',
    cph2:'',
    cllx2:'',
    clsqrq2:'',
    wplx2:'',
    wpsl2:'',
    wpsqrq2:'',
    objuid:'',
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
    bustype:9,
    peoplelist: [],
  },
  onLoad: function (options) {
    var that=this
    var time = util.formatDate(new Date());
    that.setData({
      startdate: time,
      enddate: time,
    })
    //查询列表数据
    var condition={}
    condition.idNumber=app.globalData.usercardid,
    condition.startDate=that.data.startdate,
    condition.endDate=that.data.enddate
    wx.request({
      url: 'https://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/apply/list.do',
      data: {
        condition :JSON.stringify(condition)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        if(res.data.status==200){
          that.setData({
            applylist:res.data.data.list
          })
        }
       console.log(JSON.stringify(res))
      }
    })
  },
  StartDateChange(e) {
    this.setData({
      startdate: e.detail.value
    })
  },
  EndDateChange(e) {
    this.setData({
      enddate: e.detail.value
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      searchcontent:null
    })
  },
//弹出驳回窗口
  showModalno(e) {
    this.setData({
      modalNameno: e.currentTarget.dataset.target,
      objuid:e.currentTarget.dataset.objuid,
      bustype:e.currentTarget.dataset.type
    })
  },
  hideModalno(e) {
    this.setData({
      modalNameno: null
    })
  },
  hideModaldetail(){
    this.setData({
      modalNamedetail: null
    })
  },
  radio_select(e){
    this.setData({
      peoplename:e.currentTarget.dataset.value,
      peopleeid:e.currentTarget.dataset.id
    })
    console.log(this.data.peopleeid)
    console.log(this.data.peoplename)
  },
  search_ry(e){
    this.setData({
      searchcontent: e.detail.value
    })
    console.log(this.data.searchcontent)
  },
  peoplesure(){
    var that=this
    if(that.data.peoplename.replace(/\s*/g, "") == '' || that.data.peoplename == null){
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
      receiver:that.data.peoplename,
      peopleeidselect:that.data.peopleeid,
      modalName: null,
      searchcontent:null
    })
  },
  modify:function(e){
    var list={}
    list.objuid=e.currentTarget.dataset.objuid
    list.name=e.currentTarget.dataset.name
    var date=e.currentTarget.dataset.date
    var startdate=date.split("~")[0]
    var enddate=startdate.split("-")[0]+"-"+date.split("~")[1]
    list.startdate=startdate
    list.enddate=enddate
    list.company=e.currentTarget.dataset.company
    list.dw=e.currentTarget.dataset.dw
    list.reason=e.currentTarget.dataset.reason
    list.carnum=e.currentTarget.dataset.carnum
    list.cartype=e.currentTarget.dataset.cartype
    list.cardate=e.currentTarget.dataset.cardate
    list.goodstype=e.currentTarget.dataset.goodstype
    list.goodsnum=e.currentTarget.dataset.goodsnum
    var date2=e.currentTarget.dataset.goodsdate
    var goodsstartdate=date2.split("~")[0]
    var goodsenddate=goodsstartdate.split("-")[0]+"-"+date2.split("~")[1]
    list.goodsstartdate=goodsstartdate
    list.goodsenddate=goodsenddate
    var list2=[]
    list2.push(list)
    console.log(list2)
    wx.navigateTo({
      url: '../gomodify/gomodify?list='+JSON.stringify(list2)
    })
  },
  modify_goods:function(){
    wx.navigateTo({
      url: '../gomodify/gomodify'
    })
  },
  modify_car:function(){
    wx.navigateTo({
      url: '../gomodify/gomodify'
    })
  },
  reason(e){
    this.setData({
      reason:e.detail.value
    })
    console.log(this.data.reason)
  },
  search:function(){
    var that=this
    if(that.data.startdate>that.data.enddate){
      wx.showToast({
        title: '日期范围输入有误!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    var condition={}
  //condition.idNumber='210504198805120279'
    condition.idNumber=app.globalData.usercardid
    condition.startDate=that.data.startdate
    condition.endDate=that.data.enddate
    wx.request({
      url: 'https://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/apply/list.do',
      data: {
        condition:JSON.stringify(condition)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        that.setData({
          applylist:res.data.data.list
        })
       console.log("*******"+JSON.stringify(res))
      }
    })
  },
  //搜索接待人
  searchreceiver:function(){
    var that=this
    console.log(that.data.searchcontent)
    wx.request({
      url: 'https://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/receptionist/list.do',
      data: {
        idNumber:app.globalData.usercardid,
        name:that.data.searchcontent
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        that.setData({
          peoplelist:res.data.data
        })
       console.log("__搜索接待人___"+JSON.stringify(res))
      }
    })
  },
//通过
  pass:function(e){
    var that=this
    if(that.data.receiver.replace(/\s*/g, "") == '' || that.data.receiver == null||that.data.receiver =='无'){
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
    var objuid=e.currentTarget.dataset.objuid
    var type=e.currentTarget.dataset.type
    var pass={}
    pass.objuid=objuid
    pass.busType=type
    pass.idNumber=app.globalData.useropenid
    pass.receptionist=that.data.peopleeidselect
    wx.request({
      url: 'https://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/apply/pass.do',
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
            title:'通过成功' ,
            icon: 'success',
            duration: 1500
          })
          setTimeout(function() {
            wx.hideToast()
          }, 2000)
          that.onLoad()
        }
       console.log("___通过___"+JSON.stringify(res))
      }
    })
  },
  revoke(e){
    var that=this
    var ObjuidNum=e.currentTarget.dataset.objuid
        
    wx.request({
      url: 'https://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/cancel/apply.do',
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
            title:'查询成功' ,
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
        /*
       console.log(JSON.stringify(res))
       pepolist:res.data.data
       that.setData({
        pepolist:res.data.data.list
      }) */
      }
    })
  },
//详细
  detail:function(e){
    var that=this
    var index=e.currentTarget.dataset.index
    var listone=that.data.applylist
 
    if(listone[index].plateNumber==undefined){
      var cph='无'
    }else{
      var cph=listone[index].plateNumber
    }
    if(listone[index].carTypeName==undefined){
      var cllx='无'
    }else{
      var cllx=listone[index].carTypeName
    }
    if(listone[index].carAuthDate==undefined){
      var clsqrq='无'
    }else{
      var clsqrq=listone[index].carAuthDate
    }
    if(listone[index].objectTypeName==undefined){
      var wplx='无'
    }else{
      var wplx=listone[index].objectTypeName
    }
    if(listone[index].objectCount==undefined){
      var wpsl='无'
    }else{
      var wpsl=listone[index].objectCount
    }
    if(listone[index].objectAuthRange==undefined){
      var wpsqrq='无'
    }else{
      var wpsqrq=listone[index].objectAuthRange
    }
    that.setData({
        xm:listone[index].name,
        lfsy:listone[index].resonForVisiting,
        sqrq:listone[index].visitorAuthRange,
        lfdw:listone[index].managerDeptName,
        tjsj:listone[index].submitTime,
        ssgs:listone[index].companyName,
        cph2:cph,
        cllx2:cllx,
        clsqrq2:clsqrq,
        wplx2:wplx,
        wpsl2:wpsl,
        wpsqrq2:wpsqrq,
        modalNamedetail:e.currentTarget.dataset.target
    })
  },
//驳回
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
    //reject.idNumber=app.globalData.usercardid
    reject.idNumber='211404199005224424'
    wx.request({
      url: 'https://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/apply/reject.do',
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
            wx.hideToast()
          }, 2000)
          that.setData({
            modalNameno: null
          })
          that.onLoad()
        }
        
       console.log("___驳回___"+JSON.stringify(res))
      }
    })
  },
})