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
        reason:'',
        orderType:0 ,
        appUrl:app.data.url,
    },
    onLoad:function(e){
        var that = this;
        console.log(e)
        var id = e.id; //商品的类型id
        var status = e.status?e.status:1;
        var goodNums = e.goodNums; //商品数量
        var orderId = e.orderId; //订单id 提交成功后删除该笔订单用
        var str = e.str;
        var orderType = e.orderType;
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
            orderId:orderId ,
            somegoodNums:str,
        })


        //获取多订单
        if(orderType==1){
            console.log(str)
            wx.request({
                  url:app.data.url+'/product/getManyProduct.do',
                  method:'post',
                  header:{
                    'content-type':'application/x-www-form-urlencoded'
                  },
                  data:{
                    productId:str
                  },
                  success:function(res){
                        console.log(res)
                    if(res.data.code == 0 ){
                        var datas = res.data.data;
                        
                        var totalPrice = 0;
                        for(var i = 0 ; i < datas.length ; i++ ){
                            totalPrice += datas[i].current_price*1*datas[i].productNumber
                        }
                        totalPrice += datas[0].freight;
                        console.log(datas)
                        that.setData({
                            goodsdatas:datas,
                            orderType:1,
                            someGoodsTotalPrice:totalPrice
                        })
                        console.log(totalPrice)


                    }
                }
            })
        }else{
                //获取单列表
                //获取商品的列表
                wx.request({
                    url:app.data.url+'/product/productList.do?id='+id+'&userAppName='+app.data.userAppName,
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
        
      
        wx.getStorage({
            key:'userMsg',
            success:function(res){
                console.log(res)
                that.setData({
                    memberId:res.data.memberId,
                })

                //获取地址列表
                wx.request({
                    url:app.data.url+'/address/findList.do?defaultFlag=1&userAppName='+app.data.userAppName+'&memberId='+res.data.memberId,
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
            key: 'id',
            success: function(res) {
                  console.log(res.data)
                  var id = res.data;
                  console.log(id)
                 
                  if(id>=0){
                    wx.request({
                        url:app.data.url+'/address/findList.do?id='+id+'&userAppName='+app.data.userAppName+'&memberId='+that.data.memberId,
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
        // if(orderType ==0){
        //     wx.request({
        //         url:app.data.url+'/product/productList.do?id='+that.data.id+'&userAppName='+app.data.userAppName,
        //         method:'post',
        //         success:function(res){
        //             if(res.data.code ==0){
        //                 console.log(res);
        //                 var data = res.data.data.product[0];
        //                 that.setData({
        //                     goodsdatas:data
        //                 })
        //             }else{
        //                 wx.showToast({
        //                     title:res.data.desc,
        //                     icon:'loading',
        //                     mask:true,
        //                     duration:1000
        //                 })
        //             }
        //         }
        //     })
            
        // }





        

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
        console.log(goodsdatas)
        //商品名字
        var productName = '',productId ='';
        if(that.data.orderType ==0){
            productName = goodsdatas.product_name;
            productId = that.data.id+'/'+that.data.goodNums*1;
        }else{
            productName = goodsdatas[0].product_name;
            productId = that.data.somegoodNums;
        }
        //商品id
        
        //商家id
        var memberId = that.data.memberId;
        //地址id
        var addrId = that.data.addressNum;
        //商品数目
        var orderNumber;
        if(that.data.orderType == 1){
            orderNumber = that.data.somegoodNums;
        }else{
            orderNumber = that.data.goodNums*1;
        }
        //计算总价
        var totalPrice = 0;
        if(that.data.orderType == 1){
            var totalPrice = that.data.someGoodsTotalPrice;
        }else{
            totalPrice = (goodsdatas.current_price*1)*(orderNumber*1)+goodsdatas.freight*1;
        }
        
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
                url:app.data.url+'/order/insert.do',
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
                          'appId': params.appid,
                          'timeStamp': params.timeStamp+'',
                           'nonceStr': params.nonceStr,
                           'package': 'prepay_id=' + params.prepay_id,
                           'signType': 'MD5',
                           'paySign': params.sign,
                           success:function(res){
                             console.log(res);
                                wx.request({
                                    url:app.data.url+'/order/wxnotify.do',
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
                             console.log(res);
                                wx.request({
                                    url:app.data.url+'/order/wxnotify.do',
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


    }
})