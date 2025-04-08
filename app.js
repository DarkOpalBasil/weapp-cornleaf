//app.js
App({
  // 全局变量
  globalData: {
    userInfo: null,
  },
  // 创建事件中心，解耦
  eventBus: {
    callbacks: {},
    on: function(eventName, callback) {
      this.callbacks[eventName] = callback
    },
    emit: function(eventName, data) {
      if (this.callbacks[eventName]) {
        this.callbacks[eventName](data)
      }
    }
  },
  onLaunch: function () {
    this.checkLogin();
  },
  checkLogin: function () {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      this.showLoginDialog();
    } else {
      this.globalData.userInfo = userInfo;
    }
  },
  showLoginDialog: function () {
    wx.showModal({
      title: '登录提示',
      content: '请登录以继续使用小程序',
      showCancel: false,
      success: (res) => {
        if (res.confirm) {
          // 跳转到登录页面
          wx.redirectTo({
            url: '/pages/login/login' // 替换为你的登录页面路径
          });
        }
      }
    });
  }
});