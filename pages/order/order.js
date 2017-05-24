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
        userMobile :"",  //以上都是地址
        showSelectAdd:false,
        adrdatas:'',
        id:'',//购物车商品的id
        memberId:'',
        status:1,
        goodNums:1,//商品数量
        goodsdatas:'' //商品的信息
    },
    onLoad:function(e){
        console.log(e)
        var id = e.id; //商品的类型id
        var status = e.status?e.status:1;
        var goodNums = e.goodNums; //商品数量
        var orderId = e.orderId; //订单id 提交成功后删除该笔订单用
        console.log(id)
        if(status == 2){
            wx.setNavigationBarTitle({
                title:'订单详情'
            })
        }
        this.setData({
            id:id,
            status:status,
            goodNums:goodNums,
            orderId:orderId 
        })
        var that = this;
        wx.getStorage({
            key:'userMsg',
            success:function(res){
                console.log(res)
                that.setData({
                    memberId:res.data.memberId,
                })

                //获取地址列表
                wx.request({
                    url:'https://tobidto.cn/address/findList.do?defaultFlag=1&userAppName='+app.data.userAppName+'&memberId='+res.data.memberId,
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

                //获取商品的列表
                wx.request({
                    url:'https://tobidto.cn/product/productList.do?id='+id+'&userAppName='+app.data.userAppName,
                    method:'post',
                    success:function(res){
                        console.log(res)
                        if(res.data.code ==0){
                            console.log(res);
                            var data = res.data.data.product[0];
                            that.setData({
                                goodsdatas:data
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

    },
    onShow:function(){
        var that = this;
        wx.getStorage({
            key: 'id',
            success: function(res) {
                  console.log(res.data)
                  var id = res.data;
                  console.log(id)
                 
                  if(id>=0){
                    wx.request({
                        url:'https://tobidto.cn/address/findList.do?id='+id+'&userAppName='+app.data.userAppName+'&memberId='+that.data.memberId,
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

        //获取商品的列表
        wx.request({
            url:'https://tobidto.cn/product/productList.do?id='+that.data.id+'&userAppName='+app.data.userAppName,
            method:'post',
            success:function(res){
                if(res.data.code ==0){
                    console.log(res);
                    var data = res.data.data.product[0];
                    that.setData({
                        goodsdatas:data
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
    //提交订单
    submitOrder:function(){
        var that = this;
        var productId  = that.data.id;
        var addrId = that.data.addressNum;
        var orderNumber = that.data.goodNums;
        var reason = '';


        wx.login({
            success:function(res){
                console.log(res.code)
                var code = res.code;
                wx.request({
                    url:'https://tobidto.cn/wx/prepay.do',
                    method:'post',
                    success:function(res){
                        
                    }
                })
            }
        })
        /*console.log(productId)
        wx.request({
            url:'https://tobidto.cn/order/insert.do',
            method:'post',
            header:{
                'content-type':'application/x-www-form-urlencoded'
            },
            data:{
                productId:productId,
                userAppName:app.data.userAppName,
                memberId:that.data.memberId,
                orderNumber:orderNumber,
                reason:reason,
                addrId:addrId
            },
            success:function(res){
                console.log(res)
                if(res.data.code == 0){ //success
                    wx.showToast({
                        title:res.data.desc+'加载微信支付中',
                        icon:'loading',
                        mask:true,
                        duration:0
                    })

                }else{
                    wx.showToast({
                        url:''
                    })
                }
            }
        })*/



        // wx.getStorage({
        //     key:'userMsg',
        //     success:function(res){
        //         console.log(res)
        //         var code = res.data.opens;
        //         wx.request({
        //             url:'https://tobidto.cn/order/insert.do?userAppName='+userAppName+'&memberId='+memberId+'&productId='+productId+'&reason='+reason+'&orderNumber='+orderNumber+'&page='+page+'&pageSize='+pageSize,
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