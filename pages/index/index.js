//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    card:'',
    logininf:'',
    login:false,
    flag:9
  },
  onLoad: function () {
    var that=this
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success (res) {
        if (res.code) {
          console.log(res.code)
          //发起网络请求
          var user={}
          user.appid=app.globalData.appid
          user.secret=app.globalData.secret
          user.js_code=res.code 
          wx.request({
            url:'https://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/login/info.do',
            //url: 'http://192.168.194.172:8088/znyq/api/get/login/info.do', 
            data: {
              user:JSON.stringify(user)
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success(res) {
              if(res.data.status==200){
                if(res.data.data==false){
                  that.setData({ 
                    login:false
                  })
                  wx.hideLoading()
                }else{
                  that.setData({
                    login:true,
                    flag:res.data.data.role
                  })
                  app.globalData.usercardid=res.data.data.idNumber
                  wx.hideLoading()
                }
              }
             console.log(JSON.stringify(res))
            }

          })
        } 
      },
    })
  },
  peopleapply:function(){
    wx.navigateTo({
      url: '../peopleapply/peopleapply'
    })
  },
  carapply:function(){
    // wx.navigateTo({
    //   url: '../carapply/carapply'
    // })
    wx.request({
      url: 'https://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/auth/by/idnumber.do',
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
       console.log("__人员是否授权___"+JSON.stringify(res.data.data))
      }
    })
  },
  goodsapply:function(){
    wx.request({
      url: 'https://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/auth/by/idnumber.do',
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
       console.log("__人员是否授权___"+JSON.stringify(res.data.data))
      }
    })
  },
  goVisa:function(){
    wx.navigateTo({
      url: '../goVisa/goVisa'
    })
  },
  Myinformation:function(){
    wx.navigateTo({
      url: '../Myinformation/Myinformation'
    })
  },
  card:function(e){
    var that=this
    that.setData({
      card:e.detail.value
    })
  },
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
    wx.login({
      success (res) {
        if (res.code) {
          var user={}
          user.appid=app.globalData.appid
          user.secret=app.globalData.secret
          user.js_code=res.code
          user.id=that.data.card
          wx.request({
            url: 'https://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/login.do', 
            data: {
              user:JSON.stringify(user)
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
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
                console.log(66666666)
                app.globalData.usercardid=res.data.data.idNumber
                // that.setData({
                //   login:true
                // })
                that.onLoad()
              }
             console.log("###"+JSON.stringify(res))
            }

          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
})
