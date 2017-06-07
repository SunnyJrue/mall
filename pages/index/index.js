//获取应用实例
var app = getApp();
Page({
    data: {
        obj:[1,2,3,4,5,6,7],
        scrollTops:0,
        windowHeight:'',
        userInfo:'',
        id:'',
        data:'',
        hotgoods:'',
        page:1,
        payOrder:'',
        openid:'',
        location:''



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
    onLoad: function() {
      var userAppName = app.data.userAppName

       var that = this;

       wx.getSystemInfo({
         success: function(res) {
           that.setData({
              windowHeight:res.windowHeight
           })
         }

       });


       app.getUserInfo(function(userInfo){
         that.setData({
           userInfo:userInfo
         })
       })

       //获取地理位置
       var that = this;
       wx.getLocation({
         type: 'wgs84',
         success: function(res) {
           var latitude = res.latitude
           var longitude = res.longitude
           // var speed = res.speed
           // var accuracy = res.accuracy
           console.log('latitude='+latitude)
           console.log('longitude='+longitude)
           wx.request({
              url:'https://tobidto.cn/region/getLocation.do',
              method:'post',
              header:{
                'content-type':'application/x-www-form-urlencoded'
              },
              data:{
                location:longitude+','+latitude,
                /*location:'113.27599,23.117'*/
              },
              success:function(res){
                console.log(res)
                if(res.data.code == 0){
                  wx.setStorage({
                    key:'location',
                    data:res.data.data
                  })
                }else{
                  wx.showToast({
                    title:res.data.desc,
                    icon:'loading',
                    mask:true,
                    duration:1500
                  })
                }
              }
           })

         }
       })
      
     wx.getStorage({
         key:'location',
         success:function(res){
             console.log(res);
         }
     })


       wx.login({
           success:function(login){
               //获取openid
               var code = login.code;
               console.log(code)
               wx.request({
                   url:"https://tobidto.cn/open/getOpenId.do?code="+code,
                   // url:"https://tobidto.cn/wx/getOpenId.do?code="+code,
                   method:'post',
                   success:function(res){
                      console.log(res)
                       var data =JSON.parse(res.data.data) ;
                       var  open= data.openid;
                       console.log(data)
                       console.log(open)
                       console.log(app.data.userAppName)
                       wx.request({
                           url:"https://tobidto.cn/member/insert.do?userAppName="+app.data.userAppName+"&wxOpenId="+open,
                           method:'post',
                           header: {
                                'content-type':'application/x-www-form-urlencoded'
                             },
                           dataType:'json',
                           success:function(res){
                              console.log(res)
                              console.log(open)
                              if(res.data.code == 0){

                                wx.setStorage({
                                    key:'userMsg',
                                    data:{
                                        userAppName:app.data.userAppName,
                                        memberId:res.data.data.id, 
                                        opens:open
                                    }
                                });
                              }else{
                                wx.showToast({
                                  title:res.data.desc,
                                  icon:'loading',
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




        

        
       //获取商品信息
       wx.request({
          url:'https://tobidto.cn/product/homeInfo.do?userAppName='+app.data.userAppName+'&page=1&pageSize=6',
          method:'post',
          success:function(res){
            console.log(res)
            var data = res.data.data
            that.setData({
                data:data,
                hotgoods:data.product  
            })
          }
       })





      
    },
    onShow:function(){
      var id = '11';
      console.log(id);
    },
    onReady:function(){
      var id= '22';
      console.log(id)
    },
    searchConfirm:function(e){
        var value = e.detail.value;
        console.log(value);
        var location = this.data.location;
        if(e.detail.value){
            wx.navigateTo({
              url:'/pages/index/searchgoods?kw='+value+'&location='+location
            })
        }else{
          wx.showToast({
            title:'请填入搜索内容',
            icon:'loading',
            duration:1000
          })
        }
        
    },
    //下拉刷新
    onPullDownRefresh:function(){
      var that = this;
      getGoodsList(that,1)
      
    },
    //上拉加载
    onReachBottom:function(){
      var that = this;
      wx.showToast({
        title:'加载中',
        icon:'loading',
        mask:true,
        duration:2000
      })
      getGoodsList(that,2)
      

    }
    
})


function getGoodsList(that,page){
  
    wx.request({
        url:'https://tobidto.cn/product/homeInfo.do?',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
          userAppName:app.data.userAppName,
          page:page==1?1:that.data.page+1,
          pageSize:10
        },
        method:'POST',
        success:function(res){
          if(res.data.code == 0){
            if(page==1){
              wx.stopPullDownRefresh()
            }
            wx.hideToast();
            console.log(that.data.page)
            var newData = res.data.data.product;
            if(page == 1){
              var data = newData;
              that.setData({
                page:1,
                hotgoods:data
              })
            }else{
              var data = that.data.hotgoods.concat(newData);
              that.setData({
                page:that.data.page+1,
                hotgoods:data
              })
            }
            
            console.log(data)
            
          }else{
            wx.showToast({
              title:res.code.desc,
              icon:'loading',
              mask:true,
              duration:1000
            })
          }
          

        }
    })
}

