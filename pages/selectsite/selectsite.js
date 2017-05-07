
Page({
    data:{
        datas:'',
        userMsg:{}
    },
    onLoad:function(){
        var that = this;
        getAddressList(that);
    },
    onShow:function(){
        var that = this;
        getAddressList(that);
    },
    selectAddress:function(e){
        var id = e.currentTarget.dataset.id;
        wx.setStorage({
            key:'id',
            data:id
        })
        wx.navigateBack()
    },
    operateAdress:function(){
        wx.navigateTo({
            url:'/pages/adress/adress'
        })
    }

})


    function getAddressList(that){
        wx.showToast({
            title:'加载中...',
            icon:'loading',
            mask:true,
            duration:5000
        })
        wx.getStorage({
            key:'userMsg',
            success:function(res){
                wx.hideToast();
                console.log(res)
                var memberId = res.data.memberId;
                var userAppName = res.data.userAppName;


                wx.request({
                    url:'http://119.23.216.161:8080/address/findList.do?userAppName='+userAppName+'&memberId='+memberId,
                    method:'post',
                    success:function(res){
                        console.log(res)
                        that.setData({
                            datas:res.data.data
                        })


                    }
                })



            }
        })
    }