// pages/photo/photo.js
const app = getApp();
Page( {
  data: {
    image: {},
    timers: {},
    urlSel: 'https://www.qiguoqiang.top/image/selectByUser',
    urlDel: 'https://www.qiguoqiang.top/image/deleteById',
    diseaseMap: {
      0: '未分类',
      1: '锈病',
      2: '灰斑病',
      3: '叶斑病',
      4: '矮花叶病',
      5: '健康',
      6: '未识别到叶片'
    },
    uploadTypeMap: {
      0: '相册上传',
      1: '手动拍照',
      2: '后台录入'
    }
  },
  loadPhotoData: function(){
    const openId = getApp().globalData.userInfo.openId
    const that = this
    wx.request({
      url: that.data.urlSel,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        openId: openId
      },
      success: (res) => {
        // console.log(res)
        if (res.data.code == 0) {
          this.setData ({
            image: res.data.data
          }),
          // console.log(this.data)
          wx.showToast({
            title: '获取图片成功！',
            icon: 'success'
          })
        } else {
          wx.showModal({
            title: '信息错误',
            content: '请上传图片或清空缓存后重试！',
            showCancel: false,
            confirmText: '我已了解',
            success: (res) => {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/index/index',
                  success: (res) => console.log(res),
                  fail: (err) => console.log(err)
                })
              }
            }
          });
        }
      },
      fail: (err) => {
        console.log(err)
        wx.showToast({
          title: '获取图片失败',
          icon: 'error'
        })
      }
    })
  },
  onLoad: function() {
    this.loadPhotoData()
    // 绑定事件监听
    app.eventBus.on('refreshPhotos', () => {
      this.loadPhotoData()
    })
  },
  toggleDetail(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      [`image[${index}].expand`]: !this.data.image[index].expand
    });
  },
  showOpenId(e) {
    const index = e.currentTarget.dataset.index;
    const timerKey = `timers[${index}]`;
    const stateKey = `image[${index}].showOpenId`;
    // 清除旧定时器
    if (this.data.timers[index]) {
      clearTimeout(this.data.timers[index]);
    }
    // 更新状态（仅修改showOpenId）
    this.setData({
      [stateKey]: true
    });
    // 设置新定时器
    this.setData({
      [timerKey]: setTimeout(() => {
        this.setData({ [stateKey]: false });
        this.setData({ [timerKey]: null });
      }, 6000)
    });
  },
  deleteById: function(event) {
    const id = event.currentTarget.dataset.id
    const that = this
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这张图片吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: that.data.urlDel,
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              id: id
            },
            success: (res) => {
              if (res.data.code == 0) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success'
                })
                setTimeout(() => {
                  that.loadPhotoData();
                }, 500);
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none'
                })
              }
            },
            fail: (err) => {
              console.log('删除失败: ' + err)
            }
          })
        }
      }
    })
  },
  onUnload() {
    // 页面卸载时清除所有定时器
    Object.values(this.data.timers).forEach(clearTimeout);
  }
})