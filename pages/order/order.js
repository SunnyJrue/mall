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
        goodsdatas:'', //商品的信息
        reason:''
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
                            console.log(data)
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
    bindKeyInput:function(e){
        this.setData({
            reason: e.detail.value
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
        var goodsdatas = that.data.goodsdatas;

        //商品名字
        var productName = goodsdatas.product_name;
        //商品id
        var productId  = that.data.id;
        //商家id
        var memberId = that.data.memberId;
        //地址id
        var addrId = that.data.addressNum;
        //商品数目
        var orderNumber = that.data.goodNums*1;
        //计算总价
        var totalPrice = (goodsdatas.current_price*1)*(orderNumber*1)+goodsdatas.freight*1;
        //备注
        var reason = that.data.reason;

        
        wx.showToast({
            title:'订单提交中...',
            icon:'loading',
            mask:true,
            duration:5000
        })


        wx.getStorage({
          key: 'userMsg',
          success:function(res){
            var openid = res.data.opens;
            var datas={
               userAppName:app.data.userAppName,
               productName:productName,
               productId:productId,
               memberId:memberId,
               addrId:addrId,
               orderNumber:orderNumber,
               totalPrice:totalPrice,
               reason:reason,
               openId:openid,
            };
            console.log(datas)


            wx.request({
                url:'https://tobidto.cn/order/insert.do',
                method:'post',
                header:{
                    'content-type':'application/x-www-form-urlencoded'
                },
                data:{
                  userAppName:app.data.userAppName,
                  productName:productName,
                  productId:productId,
                  memberId:memberId,
                  addrId:addrId,
                  orderNumber:orderNumber,
                  totalPrice:totalPrice,
                  reason:reason,
                  openId:openid,
                },
                success:function(res){
                    wx.hideToast()
                    console.log(res)
                    var params = res.data.data
                    if(res.data.code == 0){
                        wx.requestPayment({
                           'timeStamp': params.timestamp+'',
                           'nonceStr': params.nonceStr,
                           'package': params.package,
                           'signType': 'MD5',
                           'paySign': params.sign,
                           success:function(res){
                                wx.request({
                                    url:'https://tobidto.cn/order/wxnotify.do',
                                    method:'post',
                                    header:{
                                        'content-type':'application/x-www-form-urlencoded'
                                    },
                                    data:{
                                        outTradeNo:params.outTradeNo,
                                        wxPayStatus:1
                                    }

                                })
                           },
                           fail:function(res){
                                wx.request({
                                    url:'https://tobidto.cn/order/wxnotify.do',
                                    method:'post',
                                    header:{
                                        'content-type':'application/x-www-form-urlencoded'
                                    },
                                    data:{
                                        outTradeNo:params.outTradeNo,
                                        wxPayStatus:3
                                    }

                                })
                           }
                        })
                    }else{
                        wx.showToast({
                            title:res.data.desc,
                            loading:'loading',
                            mask:true,
                            duration:1500
                        })
                    }
                }
            })
          }
        })




        // wx.login({
        //     success:function(res){
        //         console.log(res.code)
        //         var code = res.code;
        //         wx.request({
        //             url:'https://tobidto.cn/order/insert.do',
        //             method:'post',
        //             header:{
        //                 'content-type':'application/x-www-form-urlencoded'
        //             },
        //             data:{
        //               userAppName:app.data.userAppName,
        //               productName:productName,
        //               productId:productId,
        //               memberId:memberId,
        //               addrId:addrId,
        //               orderNumber:orderNumber,
        //               totalPrice:totalPrice,
        //               reason:reason,
        //               code:code,
        //             },
        //             success:function(res){
        //                 wx.hideToast()
        //                 console.log(res)
        //                 if(res.data.code == 0){

        //                 }else{
        //                     wx.showToast({
        //                         title:res.data.desc,
        //                         loading:'loading',
        //                         mask:true,
        //                         duration:1500
        //                     })
        //                 }
        //             }
        //         })
        //     }
        // })





    }
})