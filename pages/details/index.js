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

        ],
        goodNums:1,
        animationData:{},
        switchPay:true,
        datas:'',
        goodtap:1,
    },
    onLoad: function(e) {
        console.log(e)
        var id = e.id,
        that = this;
        wx.showToast({
            title:'加载中...',
            mask:true,
            icon:'loading',
            duration:5000
        })
        wx.request({
            url:'http://119.23.216.161:8080/product/productList.do?id='+id+'&userAppName='+app.data.userAppName,
            method:'post',
            success:function(res){
                wx.hideToast();
                console.log(res)
                console.log(res.data.data.product[0])
                that.setData({
                    datas:res.data.data,

                })

            }
        })
    },
    closeWindow:function(){
        this.setData({
            switchWindow :false
        })
       
    },
    //打开购买窗口
    openWindow:function(){
        this.setData({
            switchWindow:true,
            switchPay:true
        });
        
       
    },
    //减少数量
    reduceNum:function(){
        var redNum = this.data.goodNums;
        redNum -=1;
        if(redNum<1){
            redNum = 1
        }
        this.setData({
            goodNums:redNum
        })
    },
    //增加数量
    increaseNum:function(){
        var redNum = this.data.goodNums;
        redNum +=1;
        this.setData({
            goodNums:redNum
        })
    },
    //加入购物车
    addShopCar:function(){
        this.setData({
            switchPay:false,
            switchWindow:true,

        })
        
    },
    //添加购物车提示
    confirmAddShocar:function(){
        wx.showToast({
            title:'成功添加到购物车',
            duration:1000,

        })
    },
    //立即购买
    payForGoods:function(){
        wx.showToast({
            title:'载入中，请稍后...',
            icon:'loading',
            duration:500,
            success:function(){
                
            }
        })

        wx.navigateTo({
            url:'/pages/order/order',

        })
    },
    changeTap:function(){
        var tapnum = this.data.goodtap==1?2:1;

        this.setData({
            goodtap:tapnum,
        })
    }
})