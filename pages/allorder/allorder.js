
var app = getApp();
Page({
    data:{
        orderDatas:'',
        memberId:'',
        msg:'',
        page:1
    },
    onLoad:function(){
        var that = this;
        wx.getStorage({
            key:'userMsg',
            success:function(res){
                var memberId = res.data.memberId;
                that.setData({
                    memberId:memberId
                })
                getOrderlist(that,memberId,1);
                
            }
        })
   


    },
    deleteOrder:function(e){
        var that = this;
        console.log(e)
        var id = e.target.dataset.id;
        var memberId = that.data.memberId;
        console.log(id);
        wx.showModal({
            title:'提示',
            content:'是否删除订单？',
            success:function(res){
                if(res.confirm){
                    wx.request({
                        url:'https://tobidto.cn/order/delete.do',
                        header:{
                            'content-type':'application/x-www-form-urlencoded'
                        },
                        method:'post',
                        data:{
                            id:id
                        },
                        success:function(res){
                            console.log(res)
                            if(res.data.code == 0){
                                wx.showToast({
                                    title:res.data.desc,
                                    icon:'loading',
                                    mask:true,
                                    duration:1000
                                })
                                getOrderlist(that,that.data.memberId,1)
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
        
    },
    //上拉加载
    onReachBottom:function(){
        var that = this;
        var memberId = that.data.memberId;
        var page = that.data.page;
        page = page==1?2:that.data.page;
        getOrderlist(that,memberId,page)
    }
})

function getOrderlist(that,memberId,page){
    
    wx.request({
        url:'https://tobidto.cn/order/findOrder.do',
        method:'post',
        header:{
            'content-type':'application/x-www-form-urlencoded'
        },
        data:{
            userAppName:app.data.userAppName,
            memberId:memberId,
            page:page,
            pageSize:3
        },
        success:function(res){
            console.log(res.data.data)
            if(res.data.code == 0 ){
                var data = res.data.data;
                var msg;
                var status = parseInt(data.order_status);
                console.log(status)

                switch(status){
                    case 1: 
                        msg = '等待买家付款';
                        break;
                    case 2:
                        msg = '等待卖家发货';
                        break;
                    case 3:
                        msg = '卖家已发货';
                        break;
                    case 4:
                        msg = '待评价';
                        break;
                    case 5:
                        msg = '交易成功';
                        break;
                }
                if(page == 1){
                    console.log(msg)
                    that.setData({
                        orderDatas:data,
                        msg:msg,
                        page:1
                    })
                }else {

                    that.setData({
                        orderDatas:that.data.orderDatas.concat(data),
                        page:page+1,
                    })
                }
               
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


