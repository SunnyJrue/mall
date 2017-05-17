
var app = getApp();
Page({
    data:{
        orderDatas:'',
        memberId:''
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
                getOrderlist(that,memberId);
                
            }
        })
   


    },
    deleteOrder:function(e){
        var that = this;
        console.log(e)
        var id = e.target.dataset.id;
        var memberId = that.data.memberId;
        console.log(id);
        wx.request({
            url:'https://i-wg.com/order/delete.do',
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
                    getOrderlist(that)
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

function getOrderlist(that,memberId){
    wx.request({
        url:'https://i-wg.com/order/findOrder.do',
        method:'post',
        header:{
            'content-type':'application/x-www-form-urlencoded'
        },
        data:{
            userAppName:app.data.userAppName,
            memberId:memberId,
          
        },
        success:function(res){
            console.log(res)
            if(res.data.code == 0 ){
                var data = res.data.data;
                that.setData({
                    orderDatas:data
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


