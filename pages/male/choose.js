// pages/lucky-turntable.js
const app = getApp();
Page({
  data: {
    statusBarHeight: 0,
    navHeight: 0,
    status: "iOS",
    canClick: true,
    name: "请先登录",
    location: null,
    sex: "male",
    person:"person",
    latitude: null,
    longitude: null,

  },
  onLoad: function (options) {
    

  },
  onShow() {
    var avatarUrl = app.globalData.avatarUrl;
  },

  getUserName() {
    var person = Math.floor(Math.random() * 0) + 1;
    var sex = 'male';
    var name= 'tmp';

    app.globalData.person = person;

    wx.openSetting({})
    var that = this;
    wx.getUserInfo({
      // 调用成功后触发（回调函数）
      success: function(res) {
        console.log("成功：", res.userInfo.nickName);
        // 修改页面和后台数据
        // that.setData({name: res.userInfo.nickName});
        name = res.userInfo.nickName;


        console.log(name);
      },
      // 调用失败后触发
      fall: function (res) {
        console.log("失败:", res);
      }
    });

    wx.getLocation({
      type: 'wgs84',
      success (res) {
        that.setData({latitude : res.latitude});
        that.setData({longitude : res.longitude});

      }
     });
     console.log("finish");
     console.log(that.data.latitude);
     
     app.globalData.id = that.data.name;
     app.globalData.sex = that.data.sex;


    wx.request({
      url: 'http://localhost:8080/api/user', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        id: that.data.name,
        sex: that.data.sex,
        location: that.data.longitude + that.data.latitude,
        action: "inc"  
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
      }
    });


    wx.navigateTo({
      url: `/pages/result/result?person=${person}&sex=${sex}&id=${that.data.name}`,
    });

  },

  getUserName() {
    app.globalData.person = person;

    wx.openSetting({})
    var that = this;
    wx.getUserInfo({
      // 调用成功后触发（回调函数）
      success: function(res) {
        console.log("成功：", res.userInfo.nickName);
        // 修改页面和后台数据
        // that.setData({name: res.userInfo.nickName});
        name = res.userInfo.nickName;


        console.log(name);
      },
      // 调用失败后触发
      fall: function (res) {
        console.log("失败:", res);
      }
    });

    wx.navigateTo({
      url: `/pages/faceUpdate/faceVideo`,
    });

  },
})