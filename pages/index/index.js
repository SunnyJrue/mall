//获取应用实例
var app = getApp()
Page({
    data: {
        obj:[1,2,3,4,5,6,7],
        scrollTops:0
    },

    onLoad: function() {
 
    },
    scroll:function(e){
        var scrollTop = e.detail.scrollTop;
        this.setData({
            scrollTops:scrollTop
        })
        
    }

})

function getHeight (){
}
