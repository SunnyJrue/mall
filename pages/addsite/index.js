
var app = getApp()
Page({
    data:{
        array: ['美国', '中国', '巴西', '日本'],
        index:-1
    },
    formSubmit:function(e){
        console.log(e)
    },
    bindPickerChange:function(e){
        this.setData({
            index:e.detail.value
        })
    }
})
