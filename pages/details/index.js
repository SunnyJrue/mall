var app = getApp()
Page({
    data:{
        switchWindow:false,
        goodNums:1,
        animationData:{},
        switchPay:true,
        datas:'',
        goodtap:1,
        id:'', //商品的id
        appUrl:app.data.url
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
            url:app.data.url+'/product/productList.do?id='+id+'&userAppName='+app.data.userAppName,
            method:'post',
            success:function(res){
                console.log(res)
                if(res.data.code == 0 ){
                    wx.hideToast();
                    console.log(res)
                    console.log(res.data.data.product[0])
                    that.setData({
                        datas:res.data.data,
                        id:id
                    })
                }else{
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
        var id = this.data.datas.product[0].id;
        var that = this;
        console.log(that.data.goodNums)

        console.log(id)
        wx.getStorage({
            key:'userMsg',
            success:function(res){
                console.log(res)
                var memberId = res.data.memberId;
                var number = that.data.goodNums;
                var url = app.data.url+'/cart/insert.do?userAppName='+app.data.userAppName+'&memberId='+memberId+'&id='+id+'&number='+number;
                console.log(url)
                wx.request({
                    url:app.data.url+'/cart/insert.do?userAppName='+app.data.userAppName+'&memberId='+memberId+'&id='+id+'&number='+number,
                    method:'post',
                    success:function(res){
                        console.log(res)
                        if(res.data.code == 0 ){
                            wx.showToast({
                                title:'成功添加到购物车',
                                duration:1000,
                                mask:true

                            })
                        }else{
                            wx.showToast({
                                title:'添加到购物车失败',
                                duration:1000,
                                mask:true
                            })
                        }
                        
                    }
                })
            }
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
        console.log(this.data.goodNums)

        wx.navigateTo({
            url:'/pages/order/order?id='+this.data.id+'&goodNums='+this.data.goodNums,
        })
    },
    changeTap:function(){
        var tapnum = this.data.goodtap==1?2:1;

        this.setData({
            goodtap:tapnum,
        })
    },
    
    turnToShopCar:function(){//跳转购物车
        wx.switchTab({
            url:'/pages/cart/index'
        })
    }
})
