// index.js
const app = getApp();
Page({
  data: {

  },

  handleRefuse() {
    wx.getUserInfo({
      success: function(res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        console.log(avatarUrl);
        app.globalData.avatarUrl = avatarUrl;
      }
    });
    
    wx.navigateTo({
      url: '/pages/male/choose',
    });
    
  },
  handleAnswer() {
    wx.navigateTo({
      url: '/pages/male/choose',
    });
  }
})