var app = getApp()
Page( {
  data: {
    cartImg: '../../images/cart-null.png',
    tipWords: '购物车空空如也',
    totalPrice:0,
    goodsSUm:0,
    allChecked:false,
    windowHeight:'',
    page:1,//分页,
    orderList:'',
    arr:false,
    arrCheck:[],//列表保存checkbox是否选择
    arrIndex:[] //保存index


  },
  onLoad:function(){
    //获取窗口的高度
    var that = this;

    wx.getSystemInfo({
      success: function(res) {
       console.log(res.windowHeight)
        that.setData({
           windowHeight:res.windowHeight
        })
      }
    })
  


    getOrderList(that,'onload')





  },
  onShareAppMessage: function () {
    return {
      title: app.data.userAppName,
      path: '/pages/index/index',
      success: function(res) {
        wx.showToast({
          title:'转发成功',
          icon:'success',
          duration:1000
        })
      },
      fail: function(res) {
        wx.showToast({
          title:'转发失败',
          icon:'loading',
          duration:1000
        })
      }
    }
  },
  onShow:function(){
    var that = this;
    wx.showToast({
      title:'加载中',
      icon:'loading',
      duration:1000
    })
    getOrderList(that)

  },
  checkboxChange:function(e){

    console.log(e)
    var sum = 0;

    for(var i = 0 ; i < e.detail.value.length ; i++){
        sum +=e.detail.value[i] -0;
    }
    this.setData({
        totalPrice:sum,
        goodsSUm: e.detail.value.length
    });
    var info ;
    
    e.detail.value.length == this.data.orderList.length?(info = true):(info = false)
    this.setData({
        allChecked:info,
    })




  },
  selectAll:function(e){
    var that = this;
    var arrs = this.data.arr;



    if(this.data.allChecked){
        changeCheck(arrs,false,that);
        var arrCheck = that.data.arrCheck
        for(var i = 0 ; i < arrCheck.length ; i++){
          arrCheck[i] = false;
        }
        this.setData({
            allChecked:false,
            goodsSUm:0,
            totalPrice:0,
            arrCheck:arrCheck
        })


    }else{
        changeCheck(arrs,true,that);
        var sum = 0
        var orderData = that.data.orderList;
        var arrCheck = that.data.arrCheck
        for(var i = 0 ; i < arrCheck.length ; i++){
          arrCheck[i] = true;
        }
        for(var i = 0 ; i < orderData.length ; i++){
            sum += orderData[i].current_price*orderData[i].number+orderData[i].freight
        }
        this.setData({
            allChecked:true,
            goodsSUm:that.data.orderList.length,
            totalPrice:sum,
            arrCheck:arrCheck
        })



    }
  },
  //下拉刷新
  onPullDownRefresh:function(){
    wx.showToast({
        title:'加载中...',
        icon:'loading',
        duration:1000
    })
    var that = this;
    that.setData({
      page:1,
    })
    getOrderList(that)

  },

  //上拉加载
  // onReachBottom:function(){
  //   wx.showToast({
  //       title:'加载中...',
  //       icon:'loading',
  //       duration:1000
  //   })
  //   var that = this;
  //   var page = this.data.page+1;


  //   getOrderList(that,page)


  // },
  //删除订单
  deleteOrder:function(e){

      var id = e.target.dataset.id;
      console.log(e.target.dataset.id);
      var that = this;
      wx.showModal({
        title:'提示',
        content:'确定删除该商品吗？',
        success:function(res){
          if(res.confirm){
              wx.request({
                url:'https://tobidto.cn/cart/delete.do?id='+id,
                method:'post',
                success:function(res){
                  console.log(res)
                  if(res.data.code == 0){

                    wx.showToast({
                      title:'删除成功',
                      icon:'success',
                      duration:1000,
                      mask:true
                    })
                    getOrderList(that)
                    that.setData({
                      totalPrice:0,
                      goodsSUm:0,
                      allChecked:false,
                      arr:false

                    })
                  }else{
                    wx.showToast({
                      title:'删除失败',
                      icon:'success',
                      duration:1000,
                      mask:true
                    })
                  }
                }
              })

          }else{
            
          }
        }
      })
  },
  //提交订单
  payOrder:function(e){
/*      var productId = parseInt(e.target.dataset.id);
      var orderNumber = e.target.dataset.num;
      console.log(productId)
      console.log(orderNumber)
      wx.getStorage({
          key:'userMsg',
          success:function(res){
              console.log(res)
              var memberId = res.data.memberId;

              wx.request({
                  url:'https://tobidto.cn/order/insert.do',
                  method:'post',
                  header:{
                      'content-type':'application/x-www-form-urlencoded'
                  },
                  data:{
                      userAppName:app.data.userAppName,
                      memberId:memberId,
                      productId:productId,
                      orderNumber:orderNumber

                  },
                  success:function(res){
                      console.log(res)
                  }
              })
          }
      })*/


    //   wx.login({
    //        success:function(login){
    //           var code = login.code;
    //           console.log(code)
    //           console.log('https://tobidto.cn/wx/prepay.do?code='+code)
    //           wx.request({
    //             // url:'https://tobidto.cn/wx/prepay.do?code='+code,
    //             url:'https://api.weixin.qq.com/sns/jscode2session?appid=wx230817054925923e&secret=dc0a266b44da135b99b39de620dfc751&js_code='+code+'&grant_type=authorization_code',
    //             method:'post',
    //             success:function(res){
    //               console.log(res)
    //             }
    //           })
    //       }
    // })

  },

  //x修改订单数
  lessOrder:function(e){
    console.log(e)
    var that = this;
    var id = e.target.dataset.id;

    alterOrder('less',id,that,e);


  },
  plusOrder:function(e){
    console.log(e)
    var that = this;
    var id = e.target.dataset.id;
    var price = e.target.dataset.price;

    alterOrder('update',id,that,e);
  },
  //点击checkbox 是否选中 改变总价和生成缓存到订单信息
  getIndex:function(e){
    console.log(e)
    var index = e.target.dataset.index;
    var goodsNums = e.target.dataset.num;
    var id = e.target.dataset.id;

    var that = this;

    var arrCheck = that.data.arrCheck;
    arrCheck[index] = !arrCheck[index];

    console.log(arrCheck[index])

    that.setData({
      arrCheck:arrCheck
    });

    //点击多个订单生成缓存
    var arr = that.data.arrIndex;

    if(arrCheck[index]){
      arr[index] = index;
    }else{
      arr[index] = null;
    }
    console.log(arr)
    that.setData({
      arrIndex:arr
    })

    wx.setStorage({
      key:'goodsIndex',
      data:arr
    })
   
  },
  turnToOrder:function(){
    var num = this.data.goodsSUm;
    if(num>0){
      wx.navigateTo({
        url:'/pages/order/order?status=1'
      })
    }else{
      wx.showToast({
        title:'请选择要下单的商品',
        icon:'loading',
        mask:true,
        duration:1500
      })
    }
    
  }


})
function alterOrder(type,id,that,e){
  
  wx.request({
    url:'https://tobidto.cn/cart/'+type+'.do?id='+id,
    method:'post',
    success:function(res){
      console.log(res)
      if(res.data.code == 0){
        getOrderList(that)
        var price = e.target.dataset.price;
        var index = e.target.dataset.index;
        var arrCheck = that.data.arrCheck;
        var totalPrice = that.data.totalPrice;
        if(arrCheck[index]){
          if(type == 'less'){
            totalPrice -= price;
          }else{
            totalPrice += price;
          }
          that.setData({
            totalPrice:totalPrice
          })
        }
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


function changeCheck(arrs,para,that){
    that.setData({
        arr:para
    })

}
//type判别是否是onload
function getOrderList(that,type){
  wx.getStorage({
      key:'userMsg',
      success:function(res){
          var memberId = res.data.memberId;
          wx.request({
              url:'https://tobidto.cn/cart/findCart.do?userAppName='+app.data.userAppName+'&memberId='+memberId,
              method:'post',
              success:function(res){
                  wx.hideToast();
                  console.log(res);

                  if(res.data.code == 0){
                    wx.setStorage({
                      key:'goodsList',
                      data:res
                    })
                    if(type=='onload'){
                      var length = res.data.data.length; //获取订单数
                      var arrCheck = new Array(length); //保存订单是否勾选状态
                      var arrIndex = new Array(length);
                      for(var i = 0 ; i < length ; i++){
                        arrCheck[i] = false;
                      }
                      console.log(arrCheck)
                      that.setData({
                        arrCheck:arrCheck,
                        arrIndex:arrIndex,
                      })
                    }
                    
                    wx.stopPullDownRefresh();
                    var data = res.data.data;
                      that.setData({
                        orderList:data,
                     });

                  }else{
                    wx.showToast({
                      title:'获取订单列表失败',
                      icon:'loading',
                      duration:1000
                    })
                  } 
              }
          })
      }
  })

}
