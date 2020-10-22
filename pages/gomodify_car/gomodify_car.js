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
    objuid1:'',
    plateNumber:'',
    carTypeName:'',
    carAuthDate:'',
    busType:'',
    objectArray: [], 
    jichushuju:{},
    height:'',

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
    const res = wx.getSystemInfoSync()
    that.setData({
      height:res.windowHeight
    })
    app.globalData.cartime='',
    //基础信息
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/person/info.do',
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
      //  console.log("____基础信息____"+JSON.stringify(res))
      }
    })
    //修改基础信息
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/to/modify/form.do',
      data: {
        busType:options.bustype,
        objuid:options.objuid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        if(res.data.status == 200) {
          // console.log("___修改基础信息____"+JSON.stringify(res.data.data))
          that.setData({
            receivernameselect:res.data.data.receptionist,
            receiveridselectid:res.data.data.receptionistUid,
            objuid1:res.data.data.objuid,
          })
          if(res.data.data.plateNumber){
            that.setData({
              jichushuju:res.data.data
            })
            that.selectCar()
          }
        }else{
          wx.showToast({
            title:res.data.message ,
            icon: 'none',
            duration: 5000
          })
          setTimeout(function() {
            wx.hideToast()
            wx.navigateBack({})
          }, 5000)
          return
        }
      }
    })
    
    //查询接待人数据
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/receptionist/list.do',
      data: {
        idNumber:app.globalData.usercardid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        that.setData({
          peoplelist:res.data.data
        })
      //  console.log("___所有接待人__"+JSON.stringify(res))
      }
    })
  },
  selectCar:function(){
    var that=this
    //车辆类型
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/car/type.do',
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
        var carlength=that.data.jichushuju.plateNumber.length;
        if(carlength==7){
          that.setData({
            switchovercarid:'切换新能源车牌',
            flag:true
          })
        }else{
          that.setData({
            switchovercarid:'切换普通车牌',
            flag:false
          })
        }
        var inputPlateObj = {};
        for(var i=0;i<carlength;i++){
          var key = 'index'+i;
          inputPlateObj[key] = that.data.jichushuju.plateNumber.charAt(i);
        }
        for(var j=0;j<that.data.objectArray.length;j++){
          if(that.data.objectArray[j].name==that.data.jichushuju.carTypeName){
            that.setData({
              index:[j]
            })
          }
        }

        that.setData({
          inputPlates:inputPlateObj,
          cardtype:that.data.jichushuju.carTypeName,
          objuid:that.data.jichushuju.carTypeUid,
          start_date:that.data.jichushuju.carAuthDate,
          carnum:that.data.jichushuju.plateNumber,
        })
      //  console.log("____车辆类型______"+JSON.stringify(res))
      }
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
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  radio_receiver:function(e){
    var that=this
    that.setData({
      receiverid:e.currentTarget.dataset.id,
      receivername:e.currentTarget.dataset.value
    })
  },
  receiversure:function(){
    var that=this
    if(that.data.receiverid==null||that.data.receiverid==''){
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
      receivernameselect:that.data.receivername,
      receiveridselectid:that.data.receiverid,
      modalName: null
    })
  },
  bfdwss(e){
    this.setData({
      bfdwss:e.detail.value
    })
  },
  comsearch:function(e){
    var that=this
    
    //接待人
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/receptionist/list.do',
      data: {
        name:that.data.bfdwss
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      success(res) {
        that.setData({
          peoplelist: res.data.data,
        })
      //  console.log("____搜索接待人_____"+JSON.stringify(res))
      }
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
    var formList = {};
    formList.idNumber=app.globalData.usercardid
    formList.plateNumber=that.data.carnum
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
    formList.carTypeUid=that.data.objuid
    if(app.globalData.cartime){
      formList.carAuthDate=app.globalData.cartime
    }else{
      formList.carAuthDate=that.data.start_date
    }
    formList.objuid=that.data.objuid1
    formList.receptionist=that.data.receiveridselectid
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/car/apply/modify.do',
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
            title:'提交成功' ,
            icon: 'success',
            duration: 1500
          })
          setTimeout(function() {
            wx.hideToast()
            app.globalData.cartime=''
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
      //  console.log("_____临时车辆申请______"+JSON.stringify(res))
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
      cardnum:'',
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
      cardnum:'',
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
    // console.log('输入框:', t)
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
    // console.log('键盘:',a)
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
    // console.log('车牌号:',n)
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