//app.js
App({
    data:{
        address:'111111',
        userMsg:{},
        userAppName:'吴填生',
        memberId:'',
    },
    onLoad:function(){
        

        
    },
    getUserInfo:function(cb){
        var that = this;
        if(this.globalData.userMsg){
            typeof cb == 'function' && cb(this.globalData.userMsg);
        }else{
            wx.getUserInfo({
                success:function(res){
                    var userInfo = res.userInfo;
                    that.globalData.userMsg = userInfo;
                    typeof cb == 'function' && cb(that.globalData.userMsg);
                  
                }
            })



            // wx.login({
            //     success:function(login){
            //         //获取openid
            //         var code = login.code;
            //         console.log(code)

            //         wx.request({
            //             url:"http://119.23.216.161:8080/open/getOpenId.do?code="+code,
            //             method:'post',
            //             success:function(res){

            //                 var data =JSON.parse(res.data.data) ;
            //                 var  open= data.openid;
                           

            //                 wx.request({
            //                     url:"http://119.23.216.161:8080/member/insert.do?userAppName=吴填生&wxOpenId="+open,
            //                     method:'post',
            //                     header: {
            //                           'content-type': 'application/json'
            //                       },
            //                     dataType:'json',
            //                     success:function(res){
            //                         console.log(res)
            //                         wx.setStorage({
            //                             key:'userMsg',
            //                             data:{
            //                                 userAppName:'吴填生',
            //                                 memberId:res.data.data.id
            //                             }
            //                         });
                            
            //                     }
            //                 })

            //             }
            //         })


                   
            //     }
            // })
            




           
        }
        
    },
    globalData:{
        userMsg:null,
    }


})

//传入后台openid
function sendOpenid(id){

}






