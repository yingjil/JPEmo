// pages/result/result.js
const app = getApp();
var that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: 123,
    id:123
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var sex =  app.globalData.sex;
    var person = app.globalData.person;
    var id = app.globalData.id;

    

    var bgsrc = '/images/cover' + '1' + '.png';

    if(sex=='male'){
      var bgsrc = '/images/cover' + person + '.png';
      console.log(bgsrc);
      that.setData({'bgsrc':bgsrc})
    }
  },
  saveEmotion(src){
    console.log(app.globalData.id);
    console.log(src);
    wx.request({
      url: 'http://localhost:8080/api/emotion?id=' + app.globalData.id + '&src=' + src, //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        id: app.globalData.id,
        src: src
      },
      success (res) {

        var Msg = JSON.stringify(res.data.errorMsg);
        console.log(Msg)

        if(!Msg){
          wx.showModal({
            title: '心情已上传',
            content: '您的心情已经记录：' + Msg,
            success (res) {
            }
          })
        } else{
          wx.showModal({
            title: '出错啦',
            content: '出问题啦：' + Msg,
            success (res) {
            }
          })
        }

        

      },
      fall (res) {
        wx.showModal({
          title: '出错',
          content: '出错啦：' + res.errorMsg,
          success (res) {
          }
        })
      }
    })
  },
  getEmotion(){

    var that = this;
    // wx.chooseImage({
    //   count: 1,
    //   sizeType: ['original', 'compressed'],
    //   sourceType: ['album', 'camera'],
    //   success (res) {
    //     // tempFilePath可以作为img标签的src属性显示图片
    //     // this.setData({tempFilePaths: res.tempFilePaths});
    //     console.log(res.tempFilePaths[0]);
    //     that.saveEmotion(res.tempFilePaths[0]);
    //   }
    // });

    var avatarUrl = app.globalData.avatarUrl;
    that.saveEmotion(avatarUrl);

  }
})


  


