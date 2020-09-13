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
    start_date:'',
    carnum:'',
    goodsnum:'',
    cardtype:'',
    index:0,
    objuid:'',
    objectArray: [], 

    switchovercarid:'切换新能源车牌',
    switchovercartext:'changeplate',
    isKeyboard: !1,
    isNumberKB: !1,
    tapNum: !1,
    disableKey: "1234567890港澳学",
    keyboardNumber: "1234567890ABCDEFGHJKLMNPQRSTUVWXYZ港澳学",
    keyboard1: "京沪粤津冀晋蒙辽吉黑苏浙皖闽赣鲁豫鄂湘桂琼渝川贵云藏陕甘青宁新",
    inputPlates: {
      index0: "",
      index1: "",
      index2: "",
      index3: "",
      index4: "",
      index5: "",
      index6: "",
      index7: ""
    },
    inputOnFocusIndex: "",
    flag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var time = util.formatDate(new Date());
    //基础信息
    wx.request({
      url: 'https://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/person/info.do',
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
       console.log("____基础信息____"+JSON.stringify(res))
      }
    })
    //车辆类型
    wx.request({
      url: 'https://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/car/type.do',
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
       console.log("____车辆类型______"+JSON.stringify(res))
      }
    })
    that.setData({
      start_date:time
    })
  },
  DateChange(e) {
    this.setData({
      start_date: e.detail.value
    })
  },
  PickerChange(e) {
    var that=this
    that.setData({
      index: e.detail.value,
      objuid:that.data.objectArray[e.detail.value].id,
      cardtype:that.data.objectArray[e.detail.value].name
    })
  },
  carnum(e){
    this.setData({
      carnum:e.detail.value
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
    console.log("*&*^*&"+that.data.card)
    if (that.data.carnum.replace(/\s*/g, "") == '' || that.data.carnum == null) {
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
    if(that.data.switchovercarid=='切换新能源车牌'){
      if(that.data.carnum.length<7){

        wx.showToast({
          title: '车牌号输入有误!',
          icon: 'none',
          duration: 1500
        })
        setTimeout(function() {
          wx.hideToast()
        }, 2000)
        return
      }
    }
    if(that.data.switchovercarid=='切换普通车牌'){
      if(that.data.carnum.length<8){
        wx.showToast({
          title: '车牌号输入有误!',
          icon: 'none',
          duration: 1500
        })
        setTimeout(function() {
          wx.hideToast()
        }, 2000)
        return
      }
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
return
    var formList = {};
    formList.idNumber=app.globalData.usercardid
    formList.plateNumber=that.data.carnum
    formList.carTypeUid=that.data.objuid
    formList.carAuthDate=that.data.start_date
    wx.request({
      url: 'https://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/car/apply/create.do',
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
            wx.reLaunch({
              url: '../index/index'
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
       console.log("_____临时车辆申请______"+JSON.stringify(res))
      }
    })

  },
  //车牌号输入法


  //切换车牌
  changeplate:function(){
    var that = this;
    that.setData({
      flag:false,
      switchovercarid:'切换普通车牌',
      switchovercartext:'changeplate1',
      carnum:'',
      inputPlates: {
        index0: "",
        index1: "",
        index2: "",
        index3: "",
        index4: "",
        index5: "",
        index6: "",
        index7: ""
      },
    })
  },
  //切换车牌
  changeplate1: function () {
    var that = this;
    that.setData({
      flag: true,
      switchovercarid:'切换新能源车牌',
      switchovercartext:'changeplate',
      carnum:'',
      inputPlates: {
        index0: "",
        index1: "",
        index2: "",
        index3: "",
        index4: "",
        index5: "",
        index6: "",
        index7: ""
      },
    })
  },


  //打开输入法
  inputClick:function(t){
    var that = this;
    console.log('输入框:', t)
    that.setData({
      inputOnFocusIndex : t.target.dataset.id,
      isKeyboard: !0
    })
    "0" == this.data.inputOnFocusIndex ? that.setData({
      tapNum: !1,
      isNumberKB: !1
    }) : "1" == this.data.inputOnFocusIndex ? that.setData({
      tapNum: !1,
      isNumberKB: !0
    }) : that.setData({
      tapNum: !0,
      isNumberKB: !0
    });
 
  },

  //键盘点击事件
  tapKeyboard: function (t) {
    t.target.dataset.index;
    var a = t.target.dataset.val;
    console.log('键盘:',a)
    switch (this.data.inputOnFocusIndex) {
      case "0":
        this.setData({
          "inputPlates.index0": a,
          inputOnFocusIndex: "1"
        });
        break;
 
      case "1":
        this.setData({
          "inputPlates.index1": a,
          inputOnFocusIndex: "2"
        });
        break;
 
      case "2":
        this.setData({
          "inputPlates.index2": a,
          inputOnFocusIndex: "3"
        });
        break;
 
      case "3":
        this.setData({
          "inputPlates.index3": a,
          inputOnFocusIndex: "4"
        });
        break;
 
      case "4":
        this.setData({
          "inputPlates.index4": a,
          inputOnFocusIndex: "5"
        });
        break;
 
      case "5":
        this.setData({
          "inputPlates.index5": a,
          inputOnFocusIndex: "6"
        });
        break;
 
      case "6":
        this.setData({
          "inputPlates.index6": a,
          inputOnFocusIndex: "7"
        });
        break;
 
      case "7":
        this.setData({
          "inputPlates.index7": a,
          inputOnFocusIndex: "7"
        });
 
    }
    var n = this.data.inputPlates.index0 + this.data.inputPlates.index1 + this.data.inputPlates.index2 + this.data.inputPlates.index3 + this.data.inputPlates.index4 + this.data.inputPlates.index5 + this.data.inputPlates.index6 + this.data.inputPlates.index7
    console.log('车牌号:',n)
    this.setData({
      carnum:n
    })
    this.checkedSubmitButtonEnabled();
  },
  //键盘关闭按钮点击事件
  tapSpecBtn: function (t) {
    var a = this, e = t.target.dataset.index;
    if (0 == e) {
      switch (parseInt(this.data.inputOnFocusIndex)) {
        case 0:
          this.setData({
            "inputPlates.index0": "",
            inputOnFocusIndex: "0"
          });
          break;
 
        case 1:
          this.setData({
            "inputPlates.index1": "",
            inputOnFocusIndex: "0"
          });
          break;
 
        case 2:
          this.setData({
            "inputPlates.index2": "",
            inputOnFocusIndex: "1"
          });
          break;
 
        case 3:
          this.setData({
            "inputPlates.index3": "",
            inputOnFocusIndex: "2"
          });
          break;
 
        case 4:
          this.setData({
            "inputPlates.index4": "",
            inputOnFocusIndex: "3"
          });
          break;
 
        case 5:
          this.setData({
            "inputPlates.index5": "",
            inputOnFocusIndex: "4"
          });
          break;
 
        case 6:
          this.setData({
            "inputPlates.index6": "",
            inputOnFocusIndex: "5"
          });
          break;
 
        case 7:
          this.setData({
            "inputPlates.index7": "",
            inputOnFocusIndex: "6"
          });
      }
      this.checkedSubmitButtonEnabled();
    } else 1 == e && a.setData({
      isKeyboard: !1,
      isNumberKB: !1,
      inputOnFocusIndex: ""
    });
  },
  //键盘切换
  checkedKeyboard: function () {
    var t = this;
    "0" == this.data.inputOnFocusIndex ? t.setData({
      tapNum: !1,
      isNumberKB: !1
    }) : "1" == this.data.inputOnFocusIndex ? t.setData({
      tapNum: !1,
      isNumberKB: !0
    }) : this.data.inputOnFocusIndex.length > 0 && t.setData({
      tapNum: !0,
      isNumberKB: !0
    });
  },
  checkedSubmitButtonEnabled: function () {
    this.checkedKeyboard();
    var t = !0;
    for (var a in this.data.inputPlates) if ("index7" != a && this.data.inputPlates[a].length < 1) {
      t = !1;
      break;
    }
  },
})