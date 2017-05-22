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

    getOrderList(that)

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
        this.setData({
            allChecked:false,
            goodsSUm:0,
            totalPrice:0
        })


    }else{
        changeCheck(arrs,true,that);
        var sum = 0
        var orderData = that.data.orderList;
        console.log(orderData)
        for(var i = 0 ; i < orderData.length ; i++){
            sum += orderData[i].current_price*orderData[i].number+orderData[i].freight
        }
        this.setData({
            allChecked:true,
            goodsSUm:that.data.orderList.length,
            totalPrice:sum,
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

  //x修改订单数
  lessOrder:function(e){

    var that = this;
    var id = e.target.dataset.id;
    var price = e.target.dataset.price;
    alterOrder('less',id,that);

  },
  plusOrder:function(e){
    var that = this;
    var id = e.target.dataset.id;
    var price = e.target.dataset.price;

    alterOrder('update',id,that);
  },


})
function alterOrder(type,id,that){
  
  wx.request({
    url:'https://tobidto.cn/cart/'+type+'.do?id='+id,
    method:'post',
    success:function(res){
      console.log(res)
      if(res.data.code == 0){
        getOrderList(that)
       

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

function getOrderList(that){
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
