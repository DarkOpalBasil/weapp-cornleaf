//logs.js
var app = getApp();
var util = require('../../utils/util.js')
Page({
  data: {
    logs: [],
    userInfo:{
      "avatarUrl":"",
      "nickName":""
    }
  },
  onLoad: function () {
    const userInfo = getApp().globalData.userInfo
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log) {
        return util.formatTime(new Date(log))
      }),
      userInfo:{
        "avatarUrl": userInfo.avatarUrl,
        "nickName": userInfo.nickName
      }
    })
  },
  toIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})