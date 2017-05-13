//获取应用实例
var app = getApp();
Page({
    data: {
        obj:[1,2,3,4,5,6,7],
        scrollTops:0,
        location:'深圳',
        windowHeight:'',
        userInfo:'',
        id:'',
        data:'',
        hotgoods:'',
        page:1

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


       wx.login({
           success:function(login){
               //获取openid
               var code = login.code;
               console.log(code)

               wx.request({
                   url:"http://119.23.216.161:8080/open/getOpenId.do?code="+code,
                   method:'post',
                   success:function(res){

                       var data =JSON.parse(res.data.data) ;
                       var  open= data.openid;

                       wx.request({
                           url:"http://119.23.216.161:8080/member/insert.do?userAppName=吴填生&wxOpenId="+open,
                           method:'post',
                           header: {
                                 'content-type': 'application/json'
                             },
                           dataType:'json',
                           success:function(res){
                               console.log(res)
                               console.log(open)
                               wx.setStorage({
                                   key:'userMsg',
                                   data:{
                                       userAppName:'吴填生',
                                       memberId:res.data.data.id,
                                       opens:open
                                   }
                               });
                              
                       
                           }
                       })

                   }
               })


              
           }
       })


        

        
       //获取商品信息
       wx.request({
          url:'http://119.23.216.161:8080/product/homeInfo.do?userAppName='+app.data.userAppName+'&page=1&pageSize=6',
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
      console.log(111)
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
      wx.request({
          url:'http://119.23.216.161:8080/product/homeInfo.do?userAppName='+app.data.userAppName+'&page='+that.data.page+'&pageSize=6',
         
          header: {
                       'Content-Type': 'application/json'
          },
          method:'POST',
          success:function(res){
              wx.hideToast();
              console.log(that.data.page)
              var newData = res.data.data.product;
              var data = that.data.hotgoods.concat(newData);
              console.log(data)
              that.setData({
                page:that.data.page+1,
                hotgoods:data
              })

              
             

          }
      })

    }
    
})

