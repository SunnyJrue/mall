
var app = getApp()
Page({
    data:{
        index:-1,
        userMsg:{},
        userAppName:'',
        memberId:'',
        province:[],
        city:[],
        area:[],
        condition:false,
        provices:'',
        citys:'',
        areas:'',
        status:1,
        id:'',
        provinceName:'',
        cityName:'',
        areaName:'',
        defaultFlag:''

    },
    onLoad:function(e){
        var that = this;
        //获取省市联动
        wx.request({
            url:app.data.url+'/region/regionInfos.do',
            method:'post',
            success:function(res){
                console.log(res)
                that.setData({
                    province:res.data.data,
                })

                that.setData({
                    status:e.status,
                    id:e.id
                })

                var userAppName ;
                var memberId ;

                if(e.status == 1){
                    wx.setNavigationBarTitle({
                        title:'新增地址'
                    })
                }else if(e.status == 0) {
                    wx.setNavigationBarTitle({
                        title:'修改地址'
                    });

                    wx.getStorage({
                        key:'userMsg',
                        success:function(res){
                            var userAppName = res.data.userAppName;
                            var memberId = res.data.memberId;
                            wx.request({
                                url:app.data.url+'/address/findList.do?id='+that.data.id+'&userAppName='+userAppName+'&memberId='+memberId,
                                method:'post',
                                success:function(res){
                                    var userMsg = res.data.data[0];
                                    console.log(userMsg)
                                    
                                    var privince = userMsg.provinceName;
                                    var city = userMsg.cityName;
                                    var area = userMsg.regionName;
                                    var address=privince+city+area;
                                  
                                    that.setData({
                                        userMsg:userMsg,
                                        provices:userMsg.province,
                                        citys:userMsg.city,
                                        areas:userMsg.region,
                                        address:address,
                                        defaultFlag:userMsg.defaultFlag
                                    })

                                  
                                }
                            })

                        
                        }
                    })
                 

                }






                wx.request({
                    url:app.data.url+'/region/regionInfos.do?regionId=110000',
                    method:'post',
                    success:function(res){
                        that.setData({
                            city:res.data.data
                        })
                        wx.request({
                            url:app.data.url+'/region/regionInfos.do?regionId=110100',
                            method:'post',
                            success:function(res){
                                that.setData({
                                    area:res.data.data
                                })

                            }
                        });
                    }
                });

            }
        })
       

    },
    //提交表单
    formSubmit:function(e){
        var status = this.data.status;

        //status = 1为新增地址列表
        if(status == 1){

            
           var data = e.detail.value
           console.log(data)
           var username = data.username;
           var phonenum = data.phonenum;
           var address_det = data.address_det;
           var that = this;
          console.log(4444444444444);


          if(username==''){
              showMsg('用户名不能为空');
              return;
          }else if(phonenum == ''){
              showMsg('电话号码不能为空');
              return;
          }else if(that.data.provices =='' || that.data.citys ==''||that.data.areas=='' ){
              showMsg('请选择地区');
              return;
          }else if(address_det==''){
              showMsg('请填写详细地址');
              return;
          }

           wx.getStorage({
               key:'userMsg',
               success:function(res){
                   that.setData({
                       userAppName: res.data.userAppName,
                       memberId: res.data.memberId
                   })
                   var userAppName = that.data.userAppName;
                   var memberId = that.data.memberId;
                   console.log(memberId);
                   console.log(userAppName)
                
                       wx.request({
                           url:app.data.url+'/address/insert.do?userAppName='+userAppName+'&memberId='+memberId+'&userName='+username+'&userMobile='+phonenum+'&province='+that.data.provices+'&city='+that.data.citys+'&region='+that.data.areas+'&address='+address_det,
                           method:'post',
                           success:function(res){
                               if(res.data.code == 1){
                                   wx.showToast({
                                       title:'保存失败',
                                       icon:'loading',
                                       mask:true,
                                       duration:1500
                                   })
                               }else if(res.data.code == 0){
                                  wx.showModal({
                                      title:'保存成功',
                                      content:'是否返回地址列表',
                                      cancelText:'确定',
                                      confirmText:'返回',
                                      success:function(res){
                                          if(res.confirm){
                                              wx.navigateBack();
                                          }else if(res.cancel){

                                          }
                                      }
                                  })


                               }


                           }
                       })
                   
               }
           })

        }else if(status == 0 ){ //status=0 为修改地址

            var data = e.detail.value
            console.log(data)
            var username = data.username;
            var phonenum = data.phonenum;
            var address_det = data.address_det;
            var that = this;

            wx.getStorage({
                key:'userMsg',
                success:function(res){
                    console.log(res); 
                    that.setData({
                        userAppName: res.data.userAppName,
                        memberId: res.data.memberId
                    })
                    var userAppName = that.data.userAppName;
                    var memberId = that.data.memberId;
                    console.log(memberId)

                    var url = app.data.url+'/address/update.do?id='+that.data.id+'&userAppName='+userAppName+'&memberId='+memberId+'&userName='+username+'&userMobile='+phonenum+'&province='+that.data.provices+'&city='+that.data.citys+'&region='+that.data.areas+'&address='+address_det+'&defaultFlag='+that.data.defaultFlag;
                    console.log(url)


                    if(username==''){
                        showMsg('用户名不能为空');
                        return;
                    }else if(phonenum == ''){
                        showMsg('电话号码不能为空');
                        return;
                    }else if(that.data.address =='' ){
                        showMsg('请选择地区');
                        return;
                    }else if(address_det=='' ){
                        showMsg('请填写详细地址');
                        return;
                    }else{
                        wx.request({
                            url:app.data.url+'/address/update.do?id='+that.data.id+'&userAppName='+userAppName+'&memberId='+memberId+'&userName='+username+'&userMobile='+phonenum+'&province='+that.data.provices+'&city='+that.data.citys+'&region='+that.data.areas+'&address='+address_det+'&defaultFlag='+that.data.defaultFlag,
                            method:'post',
                            success:function(res){
                                console.log(res)
                                if(res.data.code == 1){
                                    wx.showToast({
                                        title:'保存失败',
                                        icon:'loading',
                                        mask:true,
                                        duration:1500
                                    })
                                }else if(res.data.code == 0){
                                   wx.showModal({
                                       title:'保存成功',
                                       content:'是否返回地址列表',
                                       confirmText:'返回',
                                       success:function(res){
                                           if(res.confirm){
                                               wx.navigateBack();
                                           }else if(res.cancel){

                                           }
                                       }
                                   })


                                }


                            }
                        })
                    }
                }
            })



        }
        

    },
    bindPickerChange:function(e){
        this.setData({
            index:e.detail.value
        })
    },
    selectRegion:function(){
        console.log(111)

    },
    open:function(){
        this.setData({
            condition:false
        })
    },
    showCitys:function(){
        this.setData({
            condition:true
        })
    },
    bindchange:function(e){
        var val = e.detail.value;
        var province_code = this.data.province[val[0]].regionId;
        
        var that = this;
        wx.request({
            url:app.data.url+'/region/regionInfos.do?regionId='+province_code,
            method:'post',
            success:function(res){
                that.setData({
                    city:res.data.data
                })


                var city_code = that.data.city[val[1]].regionId;
                wx.request({
                    url:app.data.url+'/region/regionInfos.do?regionId='+city_code,
                    method:'post',
                    success:function(res){
                        that.setData({
                            area:res.data.data
                        })


                        var area_code = that.data.area[val[2]].regionId;

                        var province = that.data.province[val[0]].regionNameZh;
                        var city = that.data.city[val[1]].regionNameZh;
                        var area = that.data.area[val[2]].regionNameZh;
                        console.log(province);
                        console.log(city);
                        console.log(area)
                        var address = province+city+area;
                        that.setData({
                            address: address,
                            provices:province_code,
                            citys:city_code,
                            areas:area_code
                        })
                    }
                });
               
            }
        });

        

        
    }

})

function showMsg(msg){
    wx.showToast({
        title:msg,
        icon:'loading',
        duration:1000,
        mask:true
    })
}

function   getAdress(num1,num2,num3,that){
    wx.request({
        url:app.data.url+'/region/regionInfos.do?regionId='+num1,
        method:'post',
        success:function(res){
            that.setData({
                provinceName:res.data.data
            });

            wx.request({
                url:app.data.url+'/region/regionInfos.do?regionId='+num2,
                method:'post',
                success:function(res){
                    that.setData({
                        cityName:res.data.data
                    });
                    
                }
            });

        }
    });
}


