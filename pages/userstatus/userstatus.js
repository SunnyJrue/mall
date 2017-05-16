var app = getApp();
Page({
    data:{
        goodsStatus:'',
        msg:'1111',
        status:'',
        datas:''
    },
    onLoad:function(e){

        var status = parseInt(e.status);
        var that =this;
        var msg,title;
        status = 3
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
        wx.getStorage({
            key:'userMsg',
            success:function(res){
                console.log(res)
                var memberId = res.data.memberId;
                console.log(memberId)
                wx.request({
                    url:'http://119.23.216.161:8080/order/findOrder.do',
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
        


        this.setData({
            msg:msg,
            status:status
        })
        wx.setNavigationBarTitle({
            title:title

        })
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
    confirmRev:function(){
        wx.showModal({
            title:'提示',
            content:'是否确认收货？',
            success:function(res){
                if(res.confirm){
                    
                }else{

                }
            }
        })
    }
})