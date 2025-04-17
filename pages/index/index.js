//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '微信小程序玉米叶片分类识别',
    info:{
      title:'目前支持识别以下疾病：',
      context:'锈病、灰斑病、大斑病、叶斑病、矮花叶病（健康叶片或无叶片图像也可以识别)',
      subcontext:'使用图像分类模型：“ResNet152”；目前模型识别准确率80%'
    },
    userInfo: {},
    appInfo:{
      logoUrl:'../../image/weapplogo.png',
      title:'使用微信内置API调用相机'
    }
  },
  bindViewTap(){
    wx.switchTab({
      url: '/pages/photo/photo',
    })
  }
})
