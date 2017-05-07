var app = getApp()
Page({
    data: {
        
    },
    onLoad: function(options) {

        var that = this
        
        wx.request({
            url: 'http://www.huanqiuxiaozhen.com/wemall/goods/inqGoodsByTypeBrand?brand=' + options.brand + "&typeid=" + options.typeid,
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function(res) {
                that.setData({
                    list: res.data.data
                });
            }
        })
    },
    getLocation:function(){//获取地址
        wx.getLocation({
          type: 'wgs84',
          success: function(res) {
            var latitude = res.latitude//纬度
            var longitude = res.longitude//经度
            var speed = res.speed
            var accuracy = res.accuracy
            console.log('latitude:'+latitude);
            console.log('longitude'+longitude);
          }
        });

    }

})