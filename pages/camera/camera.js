// pages/photo/photo.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    device: 'front',
    isFlash:"off",
    showCamera:true,
    showCanvas:'',
    windowWidth:0,
    windowHeight:0,
    step:"1",
    step2Canvas:"",
    photoPath:"", //拍的照片临时文件的地址
    urlUp:'https://www.qiguoqiang.top/image/upload', //上传地址
    showText:true,
    left:0,
    top:0,
    startX:0,
    startY:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystem()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.showCanvas = wx.CanvasContext("show");
  },
  changeDevice(){
    let data=""
    data = this.data.device=="front" ? "back" : "front"
    this.setData({
      device:data
    })
  },
  uploadImg(){
    console.log('imageUpload')
    const that = this;
    // 选择图片
    wx.chooseImage({
        count: 1, // 默认选择一张图片
        sizeType: ['original', 'compressed'], // 可以选择原图或压缩图
        sourceType: ['album', 'camera'], // 可以选择来源：相册或相机
        success(res) {
            const tempFilePaths = res.tempFilePaths; // 获取选择的图片路径
            const openId = getApp().globalData.userInfo.openId;
            // 上传图片
            wx.uploadFile({
                url: that.data.urlUp, 
                filePath: tempFilePaths[0], // 文件路径
                name: 'file', 
                formData: {
                  uploadType: 0,
                  openId: openId
                },
                success(uploadRes) {
                    // 处理服务器的响应
                    console.log('上传成功', uploadRes);
                    wx.showToast({
                      title: '上传成功'
                    });
                    setTimeout(() => {
                      app.eventBus.emit('refreshPhotos')
                    }, 500);
                },
                fail(err) {
                    console.error('上传失败', err);
                    wx.showToast({
                      title: '上传失败！',
                      icon: 'none'
                    })
                }
            });
        },
        fail(err) {
            console.error('选择图片失败', err);
            wx.showToast({
              title: '图片选择失败！',
              icon: 'none'
            })
        }
    });
  },
  uploadPhoto(){
    console.log('photo')
    const that = this;
    const photoPath = that.data.photoPath; // 获取当前拍摄的图片路径
    const openId = getApp().globalData.userInfo.openId;
    if (!photoPath) {
      wx.showToast({
        title: '请先拍照',
        icon: 'none'
      })
      return;
    }
    wx.uploadFile({
      url: that.data.urlUp,
      filePath: photoPath,
      name: 'file',
      formData: {
        uploadType: 1,
        openId: openId
      },
      success: (res) => {
        console.log(res);
        app.eventBus.emit('refreshPhotos')
        wx.showToast({
          title: '上传成功'
        })
      },
      fail: (err) => {
        console.log(err);
        wx.showToast({
          title: '上传失败！',
          icon: 'none'
        })
      }
    });
  },
  getSystem(){
    let that=this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth:res.windowWidth,
          windowHeight:res.windowHeight
        })
      },
    })
  },
  //拍照
  takePhoto(){
    const ctx = wx.createCameraContext();
    let that = this
    ctx.takePhoto({
      quality: 'normal',
      success: (res) => {
        let photoPath = res.tempImagePath
        that.setData({
          step: 2,
          photoPath: photoPath
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  drawImage(canvasId){
    if(this.data.photoPath!=''){
      canvasId.drawImage(this.data.photoPath, 0, 0, this.data.windowWidth, this.data.windowWidth);
    }
    canvasId.draw()
  },
  //返回
  back(){
    this.data.photoPath=""
    this.data.showCanvas = wx.CanvasContext("show");
    this.drawImage(this.data.showCanvas)
    this.setData({
      step:1
    })
  },
  inputStart(e) {
    let { pageX, pageY } = e.changedTouches[0];
    this.data.startX = pageX;
    this.data.startY = pageY;
  },
  inputMove(e) {
    let { pageX, pageY } = e.changedTouches[0];
    this.setData({
      left: pageX,
      top: pageY
    })
  },
  download(){
    //将像呈现在download的canvas上
    this.drawImage(wx.CanvasContext("download"))
    let that = this;
    let photoPath = this.data.photoPath
    setTimeout(() => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: that.data.canvasWidth,
        destWidth: that.data.canvasWidth * 2,
        canvasId: 'download',
        quality: 1,
        success: function (res) {
          let shareImg = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: shareImg,
            success: res => {
              wx.showToast({
                title: '保存成功'
              })
            },
            fail: function (res) {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
            }
          })
        },
      })
    }, 500)
  },
})