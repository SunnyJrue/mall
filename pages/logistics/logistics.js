
var app =getApp();
Page({
    data:{
        record:''
    },
    onLoad:function(e){
        var that = this;
        wx.showToast({
            title:'加载中...',
            icon:'loading',
        })
        wx.request({
            url:"http://119.23.216.161:8080/logistics/logisticsInfo.do?orderCode=435762389879&shipperCode=ZTO",
            method:"post",
            header:{
                "content-type":"application/json"
            },
            success:function(res){

                console.log(res)
                console.log(res.data)
                var record = JSON.parse(res.data.data)
                console.log(record);
                that.setData({
                    record:record
                })
                wx.hideToast()
            }
        })
    },

})