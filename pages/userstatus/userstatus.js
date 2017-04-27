
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
    }
})