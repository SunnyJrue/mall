var app = getApp();
Page({
    data:{
        goodsStatus:'',
        msg:'',
        status:'',
        datas:''
    },
    onLoad:function(e){

        var status = parseInt(e.status);
        var that =this;

        getData(that,status);

        
    },
    //取消订单
    cancelOrder:function(){
        wx.showModal({
            title:'提示',
            content:'是否取消订单？',
            success:function(res){
                if(res.confirm){
                    

                }else{
                    
                }
            }
        })
    },
    //确认收货
    confirmRev:function(e){
        console.log(e)
        var id = e.target.dataset.id;
        var that = this;
        wx.showModal({
            title:'提示',
            content:'是否确认收货？',
            success:function(res){
                if(res.confirm){
                    wx.request({
                        url:'https://i-wg.com/order/confirm.do?id='+id,
                        method:'post',
                        success:function(res){
                            console.log(res)
                            if(res.data.code == 0 ){
                                wx.showToast({
                                    title:'确认收货成功',
                                    icon:'success',
                                    mask:true,
                                    duration:1000
                                })
                                getData(that,that.data.status);

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
                }else{

                }
            }
        })
    }
})


    function getData(that,status){
        var msg,title;
        
        switch(status){
            case 1: 
                msg = '等待买家付款';
                title = '待付款';
                break;
            case 2:
                msg = '等待卖家发货';
                title = '待发货';
                break;
            case 3:
                msg = '卖家已发货';
                title = '待收货';
                break;
            case 4:
                msg = '交易成功';
                title = '待评价';
                break;
            case 5:
                msg = '交易成功';
                title = '售后/退换';
                break;

        }
        that.setData({
            msg:msg,
            status:status
        })
        
        wx.setNavigationBarTitle({
            title:title
        })
        wx.getStorage({
            key:'userMsg',
            success:function(res){
                console.log(res)
                var memberId = res.data.memberId;
                console.log(memberId)
                wx.request({
                    url:'https://i-wg.com/order/findOrder.do',
                    method:'post',
                    header:{
                        'content-type':'application/x-www-form-urlencoded'
                    },
                    data:{
                        userAppName:app.data.userAppName,
                        memberId:memberId,
                        orderStatus:status,
                        page:1,
                        pageSize:10
                    },
                    success:function(res){
                        if(res.data.code == 0 ){
                            console.log(res.data.data)
                            var datas = res.data.data;
                            that.setData({
                                datas:datas
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
            }

        })
        
    }