// pages/login.js
const app = getApp();
Page({
  data: {
    userInfo: {
      "avatarUrl": "/image/QAUlogo.png",
      "nickName": "Qingdao Agricultural University",
      "openId": ''
    },
    motto: '欢迎登录！',
    urlLogin: 'https://www.qiguoqiang.top/user/login',
    urlRegister: 'https://www.qiguoqiang.top/user/register'
  },
  onLoad: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //检查用户信息是否已存在
    const cachedUserInfo = wx.getStorageSync('userInfo');
    if (cachedUserInfo) {
      //存在缓存则跳转首页
      wx.switchTab({
        url: '/pages/index/index',
        success: () => {
          wx.showToast({
            title: '缓存登录成功！',
            icon:'success'
          })
        },
        fail: err => console.error('跳转失败', err)
      });
    } else {
      //无缓存则执行登录流程
      this.loginAndFetchUserInfo();
    }
  },
  // 登录并获取用户信息
  loginAndFetchUserInfo: function () {
    var that = this;
    wx.login({
      success: function (loginRes) {
        if (loginRes.code) {
          // 登录成功，将 loginRes.code 发送到后端
          wx.request({
            url: that.data.urlLogin,
            method: 'POST',
            header: {
              'Content-Type': 'text/plain'
            },
            data: loginRes.code, // 发送用户登录凭证
            success: function (response) {
              console.log("loginRes:",loginRes)
              console.log('response:', response);
              if (response.data.code == 0) {
                // 处理成功返回的用户数据
                getApp().globalData.userInfo = response.data.data; // 保存用户信息到 globalData
                wx.setStorageSync('userInfo', response.data.data); // 保存到本地存储
                wx.switchTab({
                  url: '/pages/index/index',
                  success: () => {
                    wx.showToast({
                      title: '登录成功！',
                      icon:'success'
                    })
                  },
                  fail: err => console.error('跳转失败', err)
                });
              } else if (response.data.code == 3) {
                console.error('暂无用户：', response.data);
                const userInfoTemp = that.data.userInfo
                userInfoTemp.openId = response.data.data
                that.setData({
                  userInfo: userInfoTemp
                })
                console.log(that.data)
                wx.showToast({
                  title: '请授权登录~',
                  icon: 'none'
                })
              } else if (response.data.code == 4) {
                console.error('用户被禁用', response.data);
                wx.showToast({
                  title: '账号已被禁用！',
                  icon: 'error'
                })
              } else {
                console.error('登录出错', response.data);
                wx.showToast({
                  title: '~请退出重试~',
                  icon: 'loading'
                })
              }
            },
            fail: function (err) {
              console.err('请求失败', err);
              wx.showToast({
                title: '~请退出重试~',
                icon: 'loading'
              })
            }
          });
        } else {
          console.error('登录失败！' + loginRes.errMsg);
        }
      },
      fail: function (err) {
        console.error('wx.login 调用失败', err);
      }
    });
  },
  // 获取用户信息
  getUserProfile: function () {
    wx.getUserProfile({
      desc: '需要获取您的用户信息',
      success: (res) => {
        // 合并用户信息
        const userInfoTemp = this.data.userInfo || {};  //确保 userInfo 不为 undefined
        userInfoTemp.nickName = res.userInfo.nickName;
        userInfoTemp.avatarUrl = res.userInfo.avatarUrl;
  
        this.setData({
          userInfo: userInfoTemp
        });
  
        app.globalData.userInfo = userInfoTemp;
        console.log('用户信息已更新:', userInfoTemp);
  
        const that = this;
  
        //等待注册成功后再跳转页面
        wx.request({
          url: that.data.urlRegister,
          method: 'POST',
          header: {
            'Content-Type': 'application/json'
          },
          data: userInfoTemp,
          success: (res) => {
            console.log('注册返回:', res);
  
            if (res.data.code === 0) {
              wx.showToast({
                title: '注册成功！',
                icon: 'success'
              });
  
              //注册成功后跳转
              wx.switchTab({
                url: '/pages/index/index',
                fail: (err) => console.error('跳转失败:', err)
              });
            } else {
              wx.showToast({
                title: res.data.msg || '注册失败',
                icon: 'error'
              });
            }
          },
          fail: (err) => {
            console.error('注册请求失败:', err);
            wx.showToast({
              title: '网络异常',
              icon: 'error'
            });
          }
        });
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        wx.showToast({
          title: '用户拒绝授权',
          icon: 'error'
        });
      }
    });
  }
})