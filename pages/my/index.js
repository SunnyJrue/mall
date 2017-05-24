var app = getApp()
Page( {
  data: {
      userInfo:''
  },
  onShareAppMessage: function () {
    return {
      title: app.data.userAppName,
      path: '/pages/index/index',
      success: function(res) {
        wx.showToast({
          title:'转发成功',
          icon:'success',
          duration:1000
        })
      },
      fail: function(res) {
        wx.showToast({
          title:'转发失败',
          icon:'loading',
          duration:1000
        })
      }
    }
  },

  onLoad: function() {
    var that = this;
    app.getUserInfo(function(userInfo){
        that.setData({
            userInfo:userInfo
        })
    })
  }
})