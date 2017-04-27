var app = getApp()
Page({
    data:{
        switchWindow:false,
        imgs:[
            "../../images/details/details.png",
            "../../images/details/details.png",
            "../../images/details/details.png",
            "../../images/details/details.png",
            "../../images/details/details.png",

        ]
    },
    onLoad: function(options) {
      
    },
    closeWindow:function(){
        this.setData({
            switchWindow :false
        })
    },
    openWindow:function(){
        this.setData({
            switchWindow:true
        })
    }
})
