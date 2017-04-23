var app = getApp()
Page( {
  data: {
    userInfo: {},
    projectSource: 'https://github.com/liuxuanqiang/wechat-weapp-mall',
    userListInfo: [ {
     
      text: '我的订单',
      isunread: true,
      unreadNum: 2
    }, {
        text: '我的代金券',
        isunread: false,
        unreadNum: 2
      }, {
        text: '我的拼团',
        isunread: true,
        unreadNum: 1
      }, {
        text: '收货地址管理'
      }, {
        text: '联系客服'
      }, {
        text: '常见问题'
      }]
  },

  onLoad: function() {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo( function( userInfo ) {
      //更新数据
      that.setData( {
        userInfo: userInfo
      })
    })
  }
})