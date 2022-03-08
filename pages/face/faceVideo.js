const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoSrc : '',
    imgSrc : '',
    accessToken : '',
    age : 0,
    inputAge : -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      age: 0
    });
    console.log("updating baidu-token ...");
    // 每次更新access_token
    wx.request({
      url: "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=" + app.globalData.baiduApiKey + "&client_secret=" + app.globalData.baiduSecurityKey,
      method: 'POST',
      dataType: "json",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("baidu-token: " + res.data.access_token);
        // app.globalData.access_token = res.data.access_token;
        that.setData({
          accessToken: res.data.access_token
        });
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

  /**
   * 猜测值输入响应
   */
  bindAgeInput: function (e) {
    //console.log("input = ", e.detail.value);
    this.setData({
      inputAge: e.detail.value
    })
  },

  /**
   * 打开摄像头
   */
  openFrontCamera: function(){
    var that = this
    wx.chooseVideo({
        sourceType: ['camera'],
        maxDuration:60,
        camera: 'front',
        success: function(res){
            that.setData({
                videoSrc:res.tempFilePath
            })
            console.log("the path of video: "+that.data.videoSrc)
        }
    })
  },

  /**
   * 摄像头拍照
   */
  takePhoto: function() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          imgSrc: res.tempImagePath
        })
      }
    })
  },

  /**
   * 发送年龄值到后端
   */
  sendAge: function(ageVal) {
    wx.request({
      url: 'https://springboot-g065-1599344-1309487235.ap-shanghai.run.tcloudbase.com/api/set-age', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        val: ageVal
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
      }
    });
  },

  /**
   * 发送猜测值到后端
   */
  sendGuess: function(ageVal) {
    wx.request({
      url: 'https://springboot-g065-1599344-1309487235.ap-shanghai.run.tcloudbase.com/api/guess', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        val: ageVal
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        if(res.data.data == 'lower'){
          wx.showModal({
            title: '提示',
            content: '小了',
            showCancel: false,
          })
        }else if (res.data.data == 'upper'){
          wx.showModal({
            title: '提示',
            content: '大了',
            showCancel: false,
          })
        }else if (res.data.data == 'correct'){
          wx.showModal({
            title: '提示',
            content: '正确',
            showCancel: false,
          })
        }
      }
    });
  },

  /**
   * 下一步按钮响应函数
   */
  nextStep: function() {
    var that = this
    console.log("local-img-path: "+this.data.imgSrc)
    var tmpImgPath = this.data.imgSrc
    var imgBase = wx.getFileSystemManager().readFileSync(tmpImgPath, "base64")

    console.log("sending image to baidu for results...");
    wx.request({
      url: "https://aip.baidubce.com/rest/2.0/face/v3/detect" ,
      method: 'POST',
      data:{
        image_type : 'BASE64',
        access_token : this.data.accessToken,
        face_field : 'age,beauty',
        image : imgBase
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        console.log("age: " + res.data.result.face_list[0].age);
        that.setData({
          age: res.data.result.face_list[0].age
        });
        that.sendAge(that.data.age);
      },
      // 调用失败后触发
      fall: function (res) {
        console.log("百度人脸AI失败:", res);
      }
    })
  },

  /**
   * 提交按钮响应函数
   */
  sendGuessRequest: function() {
    console.log("sending guess to backend..., val = "+this.data.inputAge);
    this.sendGuess(this.data.inputAge);
    
  },

  error(e) {
    console.log(e.detail)
  }
})