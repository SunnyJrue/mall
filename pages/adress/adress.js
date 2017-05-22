var app = getApp();
Page({
    data:{
        userName :"", 
        postalCode :"", 
        provinceName :"",
        cityName :"",
        countyName :"", 
        detailInfo :"", 
        nationalCode :"",
        telNumber :"", 
        datas:'',
        model:1,

    },
    onLoad:function(){
        wx.showToast({
          title: '加载中',
          icon:'loading',
        })
        var that = this;

        getAddress(that);
  


    },
    onShow:function(){
        wx.showToast({
          title: '加载中',
          icon:'loading',
        })
        var that = this;
        getAddress(that);


    },
    infoAddress:function(){

 
    },
    selectAddress:function(e){
        console.log(e)
        var city = e.currentTarget.dataset.city;
        var country = e.currentTarget.dataset.country;
        var name = e.currentTarget.dataset.name;
        var phone = e.currentTarget.dataset.phone;
        var userMsg = {
            city:city,
            country:country,
            name:name,
            phone:phone
        }
        wx.setStorage({
            key:'adress',
            data:userMsg
        })

        wx.getStorage({
            key: 'adress',
            success: function(res) {
                  console.log(res.data);
                  wx.navigateBack({
                   delta:1
                  })
              } 
            });
        

    },
    //编辑地址
    alterAddress:function(e){
        var index = e.currentTarget.dataset.list;
        console.log(this.data.datas[index])
        var datas = this.data.datas[index];
        var id = datas.id;
        var userName = datas.userName;
        var memberId = datas.memberId;

        console.log(userName);
        console.log(memberId)


        
        wx.navigateTo({
          url: '/pages/addsite/index?status=0&id='+id
        })


    },
    deleteAddress:function(e){
        var index = e.currentTarget.dataset.list;
        console.log(this.data.datas)
        var datas = this.data.datas[index];
        var id = datas.id;
        var userName = datas.userName;
        var memberId = datas.memberId;
        var that =this;
        console.log(datas)
        wx.showModal({
            title:'提示',
            content:'是否删除该地址？',
            success:function(res){
                if(res.confirm){
                    wx.request({
                        url:'https://tobidto.cn/address/delete.do?id='+id+'&userName='+userName+'&memberId='+memberId,
                        method:'post',
                        success:function(res){
                            console.log(res)
                            if(res.data.code == 0){
                                wx.showToast({
                                    title:'删除成功',
                                    icon:'success',
                                    mask:true,
                                    duration:1000,
                                    success:function(){
                                        getAddress(that)
                                    }
                                })

                            }else{
                                wx.showToast({
                                    title:'删除失败',
                                    icon:'loading',
                                    mask:true,
                                    duration:1500
                                })
                            }
                        }
                    })
                }else{

                }
            }
        })

        
    },
    //设置默认地址
    defaultFlag:function(e){
        var list = e.currentTarget.dataset.list;
        var that = this;
        var datas = that.data.datas[list];
        console.log(datas);
        wx.getStorage({
            key:'userMsg',
            success:function(res){
                console.log(res);
                var memberId = res.data.memberId;
                var userAppName = res.data.userAppName;
               
                wx.request({
                    url:'https://tobidto.cn/address/update.do?id='+datas.id+'&userAppName='+userAppName+'&memberId='+memberId+'&userName='+datas.userName+'&userMobile='+datas.userMobile+'&province='+datas.province+'&city='+datas.city+'&region='+datas.region+'&address='+datas.addres+'&defaultFlag=1',
                    method:'post',
                    success:function(res){
                        console.log(res)

                    }
                })



            }

        })


    }

})


function getAddress(that){
    wx.getStorage({
        key:'userMsg',
        success:function(res){
            console.log(res);
            var memberId = res.data.memberId;
            var userAppName = res.data.userAppName;

            wx.request({
                url:'https://tobidto.cn/address/findList.do?memberId='+memberId+'&userAppName='+userAppName,
                method:'post',
                success:function(res){
                    if(res.data.code == 0){
                        wx.hideToast();
                        console.log(res)
                        console.log(res.data.data)
                        that.setData({
                            datas:res.data.data
                        })
                    }
                    if(res.data.code == 1){
                        wx.showToast({
                            title:'获取失败',
                            icon:'loading'
                        })
                    }
                }
            })

        }
    })
    
    
}