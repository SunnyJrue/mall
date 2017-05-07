
var app = getApp();
Page({
    data:{
        address:'1',
        userName :"", 
        postalCode :"", 
        provinceName :"",
        cityName :"",
        countyName :"", 
        detailName:"",
        detailInfo :"", 
        nationalCode :"",
        userMobile :"", 
        showSelectAdd:false,
        adrdatas:''
    },
    onLoad:function(){
        var that = this;
        wx.getStorage({
            key:'userMsg',
            success:function(res){
                console.log(res)
                that.setData({
                    userMsg:{
                        memberId:res.data.memberId,
                        userAppName:res.data.userAppName
                    }
                })

                wx.request({
                    url:'http://119.23.216.161:8080/address/findList.do?defaultFlag=1&userAppName='+res.data.userAppName+'&memberId='+res.data.memberId,
                    method:'post',
                    success:function(res){
                        console.log(res)
                        var data = res.data.data[0];
                        var adrdatas = data.provinceName+data.cityName+data.regionName;
                        that.setData({
                            address:0,
                            userName:data.userName,
                            userMobile:data.userMobile,
                            detailName:data.addres,
                            adrdatas:adrdatas
                        })
                    }
                })



            }
        })





    },
    onShow:function(){
        var that = this;
        wx.getStorage({
            key: 'id',
            success: function(res) {
                  console.log(res.data)
                  var id = res.data;
                 
                  if(id>=0){
                    wx.request({
                        url:'http://119.23.216.161:8080/address/findList.do?id='+id+'&userAppName='+that.data.userMsg.userAppName+'&memberId='+that.data.userMsg.memberId,
                        method:'post',
                        success:function(res){
                            console.log(res)

                            
                            var data = res.data.data[0];
                            var adrdatas = data.provinceName+data.cityName+data.regionName;
                            if(res.data.data.length ==0){
                                that.setData({
                                    address:1,
                                })
                            }else{
                                that.setData({
                                    address:0,
                                    userName:data.userName,
                                    userMobile:data.userMobile,
                                    detailName:data.addres,
                                    adrdatas:adrdatas

                                })
                            }
                          

                        }

                    })
                  }
                 
              } 
        });






    },
    infoAddress:function(){
        var that = this;
        

 
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

        this.setData({
            address:userMsg,
            showSelectAdd:false
        })

        

    },
    showSubPage:function(){
        wx.navigateTo({
            url:'/pages/selectsite/selectsite'
        })
    },
    submitOrder:function(){
        var address = this.data.provinceName+this.data.cityName+this.data.countyName;
        console.log(address)
    }
})