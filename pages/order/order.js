var common = require('../../utils/md5.min.js');

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
        adrdatas:'',
        id:'',//购物车商品的id
        memberId:'',
    },
    onLoad:function(e){
        var id=e.id;
        this.setData({
            id:id
        })
        var that = this;
        wx.getStorage({
            key:'userMsg',
            success:function(res){
                console.log(res)
                that.setData({
                    memberId:res.data.memberId,
                })

                wx.request({
                    url:'http://119.23.216.161:8080/address/findList.do?defaultFlag=1&userAppName='+app.data.userAppName+'&memberId='+res.data.memberId,
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
                            adrdatas:adrdatas,
                            addressNum:data.id
                        })
                    }
                })



            }
        })





    },
    onShow:function(){
        var that = this;
        wx.getStorage({
            key: 'userMsg',
            success: function(res) {
                  console.log(res.data)
                  var id = res.data;

                 
                  if(id>=0){
                    wx.request({
                        url:'http://119.23.216.161:8080/address/findList.do?id='+id+'&userAppName='+app.data.userAppName+'&memberId='+that.data.memberId,
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
                                    adrdatas:adrdatas,
                                    addressNum:data.id

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
        var that = this;
        var productId  = that.data.id;
        var addrId = that.data.addressNum;
        var orderNumber = 1;
        var reason = '';
        //测试用 先生成订单
        console.log(that.data.memberId)
        console.log('http://119.23.216.161:8080/order/insert.do?productId='+4+'&userAppName='+app.data.userAppName+'&memberId='+that.data.memberId+'&orderNumber='+orderNumber+'&reason='+reason+'&addrId='+addrId)
        wx.request({
            url:'http://119.23.216.161:8080/order/insert.do?productId='+4+'&userAppName='+app.data.userAppName+'&memberId='+that.data.memberId+'&orderNumber='+orderNumber+'&reason='+reason+'&addrId='+addrId,
            method:'post',
            success:function(res){
                console.log(res)
                if(res.data.code == 0){ //success

                }else{
                    wx.showToast({
                        url:''
                    })
                }
            }
        })



        // wx.getStorage({
        //     key:'userMsg',
        //     success:function(res){
        //         console.log(res)
        //         var code = res.data.opens;
        //         wx.request({
        //             url:'http://119.23.216.161:8080/order/insert.do?userAppName='+userAppName+'&memberId='+memberId+'&productId='+productId+'&reason='+reason+'&orderNumber='+orderNumber+'&page='+page+'&pageSize='+pageSize,
        //             method:'post',
        //             success:function(res){
        //                 console.log(res);
        //                 var data = res.data;

        //             }
        //         })
        //     }
        // })
        
        

    }
})