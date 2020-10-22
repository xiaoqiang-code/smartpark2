// pages/peopleapply/peopleapply.js
var app = getApp();
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
    companyname:'',
    cause:'',
    companyselect:'',
    companyid:'',
    companyselectid:'',
    carnum:'',
    goodsnum:'',
    cartype:'',
    goodstype:'',
    scrolllocation:0,

    peopleStartDate: '',
    peopleEndDate: '',
    cardate:'',
    goodsStartDate:'',
    goodsEndDate:'',

    index:0,
    index2:0,
    carobjuid:'',
    goodsobjuid:'',
    automobile:false,
    display:true,
    automobiletext:'添加车辆',
    goods:false,
    goodstext:'添加(限制)物品',
    objectArray: [],
    objectArray2: [],
    reason:'',
    carbgcolor:'#1380e2',
    goodsbgcolor:'#1380e2',
    dataobjuid:'',
    height:'',
    jichushuju:{},
    receiveridselectid:'',


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
    const res = wx.getSystemInfoSync()
    that.setData({
      card:app.globalData.usercardid,
      height:res.windowHeight,
      peopleStartDate:util.formatDate(new Date())+' 00:00:00',
      peopleEndDate:util.formatDate(new Date())+' 23:59:59',
      cardate:util.formatDate(new Date()),
      goodsStartDate:util.formatDate(new Date())+' 00:00:00',
      goodsEndDate:util.formatDate(new Date())+' 23:59:59',
    })
    //时间初始值
    app.globalData.peoplestarttime='',
    app.globalData.peopleendtime='',
    app.globalData.cartime='',
    app.globalData.goodsstarttime='',
    app.globalData.goodsendtime=''
    //查询基础数据
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
          that.setData({
            name:res.data.data.name,
            duty:res.data.data.businessName,
            phonenum:res.data.data.phoneNumber,
            peopleStartDate:res.data.data.personStartDate+':00',
            peopleEndDate:res.data.data.personEndDate+':59',
            companyname:res.data.data.companyName,
            receivernameselect:res.data.data.receptionist,
            receiveridselectid:res.data.data.receptionistUid,
            cause:res.data.data.resonForVisiting,
            dataobjuid:res.data.data.objuid,
          })
          if(res.data.data.plateNumber){
            that.setData({
              jichushuju:res.data.data
            })
          }
          that.selectCar()
          that.selectGoods()
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
    //车辆类型
    // wx.request({
    //   url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/car/type.do',
    //   data: {
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' 
    //   },
    //   method: 'POST',
    //   async:false,
    //   success(res) {
    //     that.setData({
    //       objectArray: res.data.data,
    //     })
    //     //判断是否带有车辆信息
    //     console.log("___车辆____"+that.data.jichushuju.plateNumber)
    //     if(that.data.jichushuju.plateNumber){
    //       var carlength=that.data.jichushuju.plateNumber.length;
    //       if(carlength==7){
    //         that.setData({
    //           switchovercarid:'切换新能源车牌',
    //           flag:true
    //         })
    //       }else{
    //         that.setData({
    //           switchovercarid:'切换普通车牌',
    //           flag:false
    //         })
    //       }
    //       var inputPlateObj = {};
    //       for(var i=0;i<carlength;i++){
    //         var key = 'index'+i;
    //         inputPlateObj[key] = that.data.jichushuju.plateNumber.charAt(i);
    //       }
    //       for(var j=0;j<that.data.objectArray.length;j++){
    //         if(that.data.objectArray[j].name==that.data.jichushuju.carTypeName){
    //           that.setData({
    //             index:[j]
    //           })
    //         }
    //       }
    //       that.setData({
    //         automobiletext:'删除车辆',
    //         automobile:true,
    //         carbgcolor:'red',
    //         carnum:that.data.jichushuju.plateNumber,
    //         cartype:that.data.jichushuju.carTypeName,
    //         inputPlates:inputPlateObj,
    //         carobjuid:that.data.jichushuju.carTypeUid,
    //         cardate:that.data.jichushuju.carAuthDate
    //       })
    //     }
    //   }
    // })
    //物品类型
    // wx.request({
    //   url: app.globalData.http+'://'+ app.globalData.ip + '/' + app.globalData.projectName + '/api/get/object/type.do',
    //   data: {
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' 
    //   },
    //   method: 'POST',
    //   success(res) {
    //     that.setData({
    //       objectArray2: res.data.data,
    //     })
    //    console.log("物品"+JSON.stringify(res))

    //    //判断是否带有物品信息
    //   if(that.data.jichushuju.objectTypeName){
    //     for(var j=0;j<that.data.objectArray2.length;j++){
    //       if(that.data.objectArray2[j].name==that.data.jichushuju.objectTypeName){
    //         that.setData({
    //           index2:[j]
    //         })
    //       }
    //     }
    //     that.setData({
    //       goodstext:'删除(限制)物品',
    //       goods:true,
    //       goodsbgcolor:'red',
    //       goodsobjuid:that.data.jichushuju.objectTypeUid,
    //       goodsnum:that.data.jichushuju.objectCount,
    //       goodsStartDate:that.data.jichushuju.objectStartDate+':00',
    //       goodsEndDate:that.data.jichushuju.objectEndDate+':59',
    //       goodstype:that.data.jichushuju.objectTypeName
    //     })
    //   }

    //   }
    // })
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
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/get/car/type.do',
      data: {
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method: 'POST',
      async:false,
      success(res) {
        that.setData({
          objectArray: res.data.data,
        })
        //判断是否带有车辆信息
        // console.log("___车辆____"+that.data.jichushuju.plateNumber)
        if(that.data.jichushuju.plateNumber){
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
            automobiletext:'删除车辆',
            automobile:true,
            carbgcolor:'red',
            carnum:that.data.jichushuju.plateNumber,
            cartype:that.data.jichushuju.carTypeName,
            inputPlates:inputPlateObj,
            carobjuid:that.data.jichushuju.carTypeUid,
            cardate:that.data.jichushuju.carAuthDate
          })
        }
      }
    })
  },
  selectGoods:function(){
    var that=this
    wx.request({
      url: app.globalData.http+'://'+ app.globalData.ip + '/' + app.globalData.projectName + '/api/get/object/type.do',
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
      //  console.log("物品"+JSON.stringify(res))

       //判断是否带有物品信息
      if(that.data.jichushuju.objectTypeName){
        for(var j=0;j<that.data.objectArray2.length;j++){
          if(that.data.objectArray2[j].name==that.data.jichushuju.objectTypeName){
            that.setData({
              index2:[j]
            })
          }
        }
        that.setData({
          goodstext:'删除(限制)物品',
          goods:true,
          goodsbgcolor:'red',
          goodsobjuid:that.data.jichushuju.objectTypeUid,
          goodsnum:that.data.jichushuju.objectCount,
          goodsStartDate:that.data.jichushuju.objectStartDate+':00',
          goodsEndDate:that.data.jichushuju.objectEndDate+':59',
          goodstype:that.data.jichushuju.objectTypeName
        })
      }

      }
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
      carobjuid:that.data.objectArray[e.detail.value].id,
      cartype:that.data.objectArray[e.detail.value].name
    })
  },
  PickerChange2(e) {
    var that=this
    this.setData({
      index2: e.detail.value,
      goodsobjuid:that.data.objectArray2[e.detail.value].id,
      goodstype:that.data.objectArray2[e.detail.value].name
    })
  },
  showModalreceiver(e) {
    this.setData({
      modalNamereceiver: e.currentTarget.dataset.target,
      display:false
    })
  },
  hideModalreceiver(e) {
    this.setData({
      display:true,
      modalNamereceiver: null
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
      modalNamereceiver: null,
      display:true
    })
  },
  radio_receiver:function(e){
    var that=this
    that.setData({
      receiverid:e.currentTarget.dataset.id,
      receivername:e.currentTarget.dataset.value
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
      companyname:e.detail.value
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
    if(that.data.automobiletext=='删除车辆'){
      that.setData({
        scrolllocation:0,
        automobiletext:'添加车辆',
        automobile:false,
        carbgcolor:'#1380e2'
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
    if(that.data.goodstext=='删除(限制)物品'){
      that.setData({
        scrolllocation:0,
        goodstext:'添加(限制)物品',
        goods:false,
        goodsbgcolor:'#1380e2'
      })
    }else{
      that.setData({
        scrolllocation:500,
        goodstext:'删除(限制)物品',
        goods:true,
        goodsbgcolor:'red'
      })
    }
  },
  // companysure:function(){
  //   var that=this
  //   that.setData({
  //     companyselect:that.data.company,
  //     companyselectid:that.data.companyid,
  //     modalName: null,
  //     display:true
  //   })
  // },
  radio_select:function(e){
    var that=this
    that.setData({
      companyid:e.currentTarget.dataset.id,
      company:e.currentTarget.dataset.value
    })
  },
  carnum:function(e){
    var that=this
    that.setData({
      carnum:e.detail.value,
    })
  },
  goodsnum:function(e){
    var that=this
    that.setData({
      goodsnum:e.detail.value,
    })
  },
  submitapply:function(){
    var that=this
    // if (that.data.name.replace(/\s*/g, "") == '' || that.data.name == null) {
    //   wx.showToast({
    //     title: '姓名不得为空!',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   setTimeout(function() {
    //     wx.hideToast()
    //   }, 2000)
    //   return
    // }
    // if (that.data.duty.replace(/\s*/g, "") == '' || that.data.duty == null) {
    //   wx.showToast({
    //     title: '职务不得为空!',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   setTimeout(function() {
    //     wx.hideToast()
    //   }, 2000)
    //   return
    // }
    // if (that.data.phonenum.replace(/\s*/g, "") == '' || that.data.phonenum == null) {
    //   wx.showToast({
    //     title: '电话号码不得为空!',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   setTimeout(function() {
    //     wx.hideToast()
    //   }, 2000)
    //   return
    // }
    // if (that.data.companyname.replace(/\s*/g, "") == '' || that.data.companyname == null) {
    //   wx.showToast({
    //     title: '所属公司不得为空!',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   setTimeout(function() {
    //     wx.hideToast()
    //   }, 2000)
    //   return
    // }
    // if(that.data.automobile){
    //   if (that.data.carnum.replace(/\s*/g, "") == '' || that.data.carnum == null) {
    //     wx.showToast({
    //       title: '车牌号不得为空!',
    //       icon: 'none',
    //       duration: 1500
    //     })
    //     setTimeout(function() {
    //       wx.hideToast()
    //     }, 2000)
    //     return
    //   }
    //   if(that.data.switchovercarid=='切换新能源车牌'){
    //     if(that.data.carnum.length<7){

    //       wx.showToast({
    //         title: '车牌号输入有误!',
    //         icon: 'none',
    //         duration: 1500
    //       })
    //       setTimeout(function() {
    //         wx.hideToast()
    //       }, 2000)
    //       return
    //     }
    //   }
    //   if(that.data.switchovercarid=='切换普通车牌'){
    //     if(that.data.carnum.length<8){
    //       wx.showToast({
    //         title: '车牌号输入有误!',
    //         icon: 'none',
    //         duration: 1500
    //       })
    //       setTimeout(function() {
    //         wx.hideToast()
    //       }, 2000)
    //       return
    //     }
    //   }
    //   if (that.data.cartype.replace(/\s*/g, "") == '' || that.data.cartype == null) {
    //     wx.showToast({
    //       title: '请选择车辆类型!',
    //       icon: 'none',
    //       duration: 1500
    //     })
    //     setTimeout(function() {
    //       wx.hideToast()
    //     }, 2000)
    //     return
    //   }
    // }
    // if(that.data.goods){
    //   if (that.data.goodstype.replace(/\s*/g, "") == '' || that.data.goodstype == null) {
    //     wx.showToast({
    //       title: '请选择(限制)物品类型!',
    //       icon: 'none',
    //       duration: 1500
    //     })
    //     setTimeout(function() {
    //       wx.hideToast()
    //     }, 2000)
    //     return
    //   }
    //   if ( that.data.goodsnum == null) {
    //     wx.showToast({
    //       title: '(限制)物品数量不得为空!',
    //       icon: 'none',
    //       duration: 1500
    //     })
    //     setTimeout(function() {
    //       wx.hideToast()
    //     }, 2000)
    //     return
    //   }
    //}



    var formlist={}
    formlist.idNumber=that.data.card
    formlist.objuid=that.data.dataobjuid
    formlist.name=that.data.name
    formlist.businessName=that.data.duty
    formlist.phoneNumber=that.data.phonenum
    if(app.globalData.peoplestarttime){
      formlist.personAuthStartDate=app.globalData.peoplestarttime
    }else{
      formlist.personAuthStartDate=that.data.peopleStartDate
    }
    if(app.globalData.peopleendtime){
      formlist.personAuthEndDate=app.globalData.peopleendtime
    }else{
      formlist.personAuthEndDate=that.data.peopleEndDate
    }
    formlist.companyName=that.data.companyname
    formlist.reasonForVisiting=that.data.cause
    formlist.receptionist=that.data.receiveridselectid
    if(that.data.automobile){
      var carInfo = {};
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
      carInfo.plateNumber=that.data.carnum
      carInfo.carTypeUid=that.data.carobjuid
      if(app.globalData.cartime){
        carInfo.carAuthDate=app.globalData.cartime
      }else{
        carInfo.carAuthDate=that.data.cardate
      }
      formlist.carInfo = carInfo;
    }
    if(that.data.goods){
      var objectInfo = {};
      objectInfo.objectTypeUid=that.data.goodsobjuid
      objectInfo.objectCount=that.data.goodsnum
      if(app.globalData.goodsstarttime){
        objectInfo.objectAuthStartDate=app.globalData.goodsstarttime
      }else{
        objectInfo.objectAuthStartDate=that.data.goodsStartDate
      }
      if(app.globalData.goodsendtime){
        objectInfo.objectAuthEndDate=app.globalData.goodsendtime
      }else{
        objectInfo.objectAuthEndDate=that.data.goodsEndDate
      }
      formlist.objectInfo=objectInfo
    }
    wx.request({
      url: app.globalData.http+'://' + app.globalData.ip + '/' + app.globalData.projectName + '/api/person/apply/modify.do',
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
            title:'提交成功' ,
            icon: 'success',
            duration: 1500
          })
          setTimeout(function() {
            wx.hideToast()
            app.globalData.peoplestarttime='',
            app.globalData.peopleendtime='',
            app.globalData.cartime='',
            app.globalData.goodsstarttime='',
            app.globalData.goodsendtime=''
            wx.reLaunch({
              url: '../index/index'
            })
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
      //  console.log("___修改返回结果_____"+JSON.stringify(res))
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