var app = getApp();
Page({
  data: {
    motto: 'Hello Corn Leaf',
    userInfo: {
      "avatarUrl":"/image/QAUlogo.png",
      "nickName":"Qingdao Agricultural University"
    }
  },
  onLoad() {
    const userInfo = getApp().globalData.userInfo
    console.log('User Info:', userInfo);
    if (userInfo != null){
      this.setData({ 
      userInfo: {
        "avatarUrl": userInfo.avatarUrl,
        "nickName": userInfo.nickName,
      },
      motto: 'Welcome back!'
    });
    }
  },
  onButtonTap: function() {
    console.log("logs");
    wx.navigateTo({
      url: '/pages/logs/logs'
    });
  }
})