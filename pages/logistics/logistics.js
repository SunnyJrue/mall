
var app =getApp();
Page({
    data:{
        record:''
    },
    onLoad:function(e){
        var that = this;
        var id = e.id;
        var code = e.code;
        var img_path = e.img_path;
        console.log(id)
        console.log(img_path)
        wx.showToast({
            title:'加载中...',
            icon:'loading',
        })
        that.setData({
            id:id,
            img_path:img_path
        })
        wx.request({
            url:"https://i-wg.com/logistics/logisticsInfo.do",
            method:"post",
            header:{
                'content-type':'application/x-www-form-urlencoded'
            },
            data:{
                orderCode:id,
                shipperCode:code
            },
            success:function(res){
                if(res.data.code == 0 ){
                    wx.hideToast()
                    console.log(res)
                    console.log(res.data)
                    var record = JSON.parse(res.data.data)
                    console.log(record);
                    that.setData({
                        record:record
                    })
                }else{
                    wx.hideToast()
                    wx.showToast({
                        title:res.data.desc,
                        icon:'loading',
                        mask:true,
                        duration:1000
                    })
                }
                
            }
        })
    },

})