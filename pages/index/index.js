//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    card:'',//证件号
    login:false,//当前是否登录
    sjh:'',//手机号
    yzm:'',//验证码
    bgimg:'',//背景图片
    loginbgimg:'',//背景图片
    wlryimg:'',//外来人员图片
    lsclimg:'',//临时车辆图片
    xdwpimg:'',//携带物品图片
    jdcximg:'',//进度查询图片
    jdlsimg:'',//接待历史查询图片
    jdxxspimg:'',//接待信息审批图片
    splscximg:'',//审批历史查询图片
    jsglimg:'',//角色管理图片
    jsfpimg:'',//角色分配图片
    tsbgimg:'',//提示背景
    tsbtimg:'',//提示标题
    jdxxshimg:'',//接待信息审核图片
    myimg:'',//接待信息审核图片
    yzmdjs:60,//验证码倒计时
    yzmflag:1,//验证码显示标记
    menulist:[],//目录集合
    width:''
  },
  onLoad: function (options) {
    var that=this
    const res = wx.getSystemInfoSync()
    that.setData({
      height:res.windowHeight,
      width:res.windowWidth,
      bgimg:util.bgimg(),
      wlryimg:util.wlryimg(),
      lsclimg:util.lsclimg(),
      xdwpimg:util.xdwpimg(), 
      loginbgimg:util.loginbgimg(),
      jdcxbgimg:util.jdcximg(),
      jdxxshimg:util.jdxxshimg(),
      tsbgimg:util.tsbgimg(),
      tsbtimg:util.tsbtimg(),
      jdlsimg:util.jdlsimg(),
      jdxxspimg:util.jdxxspimg(),
      splscximg:util.splscximg(),
      jsglimg:util.jsglimg(),
      jsfpimg:util.jsfpimg(),
      myimg:util.myimg(),
    })
    //分享
    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage']
    })
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          var user={}
          user.appid=app.globalData.appid
          user.secret=app.globalData.secret
          user.js_code=res.code 
          wx.request({
            url:app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/login/info.do',
            data: {
              user:JSON.stringify(user)
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success(res) {
              if(res.data.status==200){
                if(res.data.data==false){
                  that.setData({ 
                    login:false
                  })
                  wx.hideLoading()
                  that.showModal()
                }else{
                  that.setData({
                    login:true,
                    menulist:res.data.data.menus
                  })
                  app.globalData.usercardid=res.data.data.idNumber
                  wx.hideLoading()
                }
                app.globalData.receptionistId=res.data.data.receptionistId
                app.globalData.receptionistName=res.data.data.receptionistName
              }
            //  console.log("____登录成功返回的菜单信息___"+JSON.stringify(res))
            }
          })
        } 
      },
    })
  },
  showModal(e) {
    this.setData({
      modalName: "Modal"
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  onShareAppMessage: function () {
    return {
      title: 'SF智慧园区'
    }
  },
  //验证方法
  verification:function(e){
    var that=this
    var flag=e.currentTarget.dataset.flag
    that.goto(flag)
  },
  //跳转到对应页面
  goto:function(flag){
    var that=this
    switch(flag){
      case 1:
        wx.navigateTo({
          url: '../peopleapply/peopleapply'
        })
        break;
      case 2:
        that.carapply()
        break;
      case 3:
        that.goodsapply()
        break;
      case 4:
        wx.navigateTo({
          url: '../receiveraudit/receiveraudit'
        })
        break;
      case 5:
        wx.navigateTo({
          url: '../goVisa/goVisa'
        })
        break;
      case 6:
        wx.navigateTo({
          url: '../HandleCode/HandleCode'
        })
        break;
      case 7:
        wx.navigateTo({
          url: '../jiedai_history/jiedai_history'
        })
        break;
      case 8:
        wx.navigateTo({
          url: '../govisa_history/govisa_history'
        })
        break;
      case 9:
        wx.navigateTo({
          url: '../authority_management/authority_management'
        })
        break;
      case 10:
        wx.navigateTo({
          url: '../role_assignment/role_assignment'
        })
        break;
      case 11:
        wx.navigateTo({
          url: '../jiedai_history/jiedai_history'
        })
        break;
      case 11:
        wx.navigateTo({
          url: '../Myinformation/Myinformation'
        })
        break;
    }
  },
  //跳转到人员申请页面
  peopleapply:function(){
    wx.navigateTo({
      url: '../peopleapply/peopleapply'
    })
  },
  //跳转到车辆申请页面
  carapply:function(){
    wx.request({
      url: app.globalData.http+'://'+ app.globalData.ip + '/' + app.globalData.projectName + '/api/get/auth/by/idnumber.do',
      data: {
      idNumber:app.globalData.usercardid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        if(res.data.data==false){
          wx.showToast({
            title: '您未取得入厂授权,不能直接申请车辆!',
            icon: 'none',
            duration: 1500
          })
          setTimeout(function() {
            wx.hideToast()
          }, 2000)
        }else{
          wx.navigateTo({
            url: '../carapply/carapply'
          })
        }
      //  console.log("__人员是否授权___"+JSON.stringify(res.data.data))
      }
    })
  },
  //跳转到物品申请页面
  goodsapply:function(){
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/auth/by/idnumber.do',
      data: {
      idNumber:app.globalData.usercardid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        if(res.data.data==false){
          wx.showToast({
            title: '您未取得入厂授权,不能直接申请(限制)物品!',
            icon: 'none',
            duration: 1500
          })
          setTimeout(function() {
            wx.hideToast()
          }, 2000)
        }else{
          wx.navigateTo({
            url: '../goodsapply/goodsapply'
          })
        }
      //  console.log("__人员是否授权___"+JSON.stringify(res.data.data))
      }
    })
  },
  //接待人审批页面
  approver:function(){
    wx.navigateTo({
      url: '../goVisa/goVisa'
    })
  },
  //证件号、手机号、验证码
  card:function(e){
    var that=this
    that.setData({
      card:e.detail.value
    })
  },
  sjh:function(e){
    this.setData({
      sjh:e.detail.value
    })
  },
  yzm:function(e){
    this.setData({
      yzm:e.detail.value
    })
  },
  //查询页面
  goHandleCode:function(){
    wx.navigateTo({
      url: '../HandleCode/HandleCode'
    })
  },
  //审核页面
  goreceiveraudit:function(){
    wx.navigateTo({
      url: '../receiveraudit/receiveraudit'
    })
  },
  jiedaihistory:function(){
    wx.navigateTo({
      url: '../jiedai_history/jiedai_history'
    })
  },
  govisahistory:function(){
    wx.navigateTo({
      url: '../govisa_history/govisa_history'
    })
  },
  authoritymanagement:function(){
    wx.navigateTo({
      url: '../authority_management/authority_management'
    })
  },
  roleassignment:function(){
    wx.navigateTo({
      url: '../role_assignment/role_assignment'
    })
  },
  history:function(){
    wx.navigateTo({
      url: '../history/history'
    })
  },
  myinf:function(){
    wx.navigateTo({
      url: '../Myinformation/Myinformation'
    })
  },
  //点击登录
  login:function(){
    var that=this
    if (that.data.card.replace(/\s*/g, "") == '' || that.data.card == null) {
      wx.showToast({
        title: '请输入证件号!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    if (that.data.sjh.replace(/\s*/g, "") == '' || that.data.sjh == null) {
      wx.showToast({
        title: '请输入手机号!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    if (that.data.yzm.replace(/\s*/g, "") == '' || that.data.yzm == null) {
      wx.showToast({
        title: '请输入验证码!',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
      return
    }
    wx.login({
      success (res) {
        if (res.code) {
          var user={}
          user.appid=app.globalData.appid
          user.secret=app.globalData.secret
          user.js_code=res.code
          user.id=that.data.card
          user.phoneNumber=that.data.sjh
          user.code=that.data.yzm
          wx.request({
            url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/login.do', 
            data: {
              user:JSON.stringify(user)
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success(res) {
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
              if(res.data.status==200){
                app.globalData.usercardid=res.data.data.idNumber
                that.onLoad()
              }
            //  console.log("___登陆成功返回值____"+JSON.stringify(res))
            }
          })
        } else {
          // console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  //获取验证码
  hqyam:function(){
    var that=this
    var param={}
    param.phoneNumber=that.data.sjh
    param.id=that.data.card
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/short/msg/code.do', 
      data: {
        param:JSON.stringify(param)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success(res) {
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
        if(res.data.status==200){
          wx.showToast({
            title:"验证码发送成功！",
            icon: 'success',
            duration: 1500
          })
          setTimeout(function() {
            wx.hideToast()
          }, 2000)
          that.setData({
            yzmflag:2
          })
          clearInterval(interval)
          var interval = setInterval(function(){
            that.setData({
              yzmdjs:that.data.yzmdjs-1
            })
            if(that.data.yzmdjs==0){
              that.setData({
                yzmflag:1,
                yzmdjs:60
              })
              clearInterval(interval)
            }
          },1000)
        }
      }
    })
  }
})
