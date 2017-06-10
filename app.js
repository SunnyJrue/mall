//app.js
App({
    data:{
        address:'',
        userMsg:{},
        userAppName:'吴填生',
        memberId:'',
        url:'https://tobidto.cn'
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

           
        }
        
    },
    globalData:{
        userMsg:null,
    }


})

//传入后台openid
function sendOpenid(id){

}






