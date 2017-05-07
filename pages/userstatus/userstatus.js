
Page({
    data:{
        goodsStatus:'',
        msg:'1111',
        status:''
    },
    onLoad:function(e){

        var status = e.status;
        var that =this;
        var msg,title;
        console.log(e);
        switch(status){
            case '1': 
                msg = '等待买家付款';
                title = '待付款';
                break;
            case '2':
                msg = '等待卖家发货';
                title = '待发货';
                break;
            case '3':
                msg = '卖家已发货';
                title = '待收货';
                break;
            case '4':
                msg = '交易成功';
                title = '待评价';
                break;
            case '5':
                msg = '交易成功';
                title = '售后/退换';
                break;

        }
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
                    console.log(111);

                }else{
                    console.log(22)
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