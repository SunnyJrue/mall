

function requestName(para,precode,nextcode,that,cb){
    var name,url;
    if(para == 0 ){
        url = 'http://119.23.216.161:8080/region/regionInfos.do'
    }else if(para == 1){
        url = 'http://119.23.216.161:8080/region/regionInfos.do?regionId='+precode
    }
    wx.request({
        url:url,
        method:'post',
        success:function(res){
            var pri_arr = res.data.data;
            for(var i = 0 ; i < pri_arr.length ; i++){
                if(nextcode == pri_arr[i].regionId){
                    name = pri_arr[i].regionNameZh;
                }
            }
            cb(name);
            console.log(name)
            
        }
    })
}


module.exports.requestName = requestName;











