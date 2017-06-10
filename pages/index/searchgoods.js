
var app = getApp();
Page({
    data:{
        modalindex:'1',
        sublist:0,
        modalShow:false,
        productName:'', //关键字查询
        inputDefault:'',
        goodContent:'',
        location:'',
        windowHeight:'',
        goodsDatas:'',
        page:1,
        id:'',
        type:'',
        startPrice:'',
        endPrice:'',
        brandArr:'' ,
        appUrl:app.data.url      
    },
    onLoad:function(e){
        console.log(e)
        var that = this;
        //获取系统的信息，获取屏幕高度
        wx.getSystemInfo({
          success: function(res) {
           console.log(res.windowHeight)
            that.setData({
               windowHeight:res.windowHeight
            })
          }
        });

        wx.getStorage({
            key:'location',
            success:function(res){
                console.log(res);
                var location = res.data;
                this.setData({
                    location:location
                })
            }
        })

        var id = e.id?e.id:'';
        var kw = e.kw?e.kw:'';
        var brandId = e.brandId?e.brandId:'';
        console.log(id)
        this.setData({
            location:location,
            inputInfo:e.kw,
            id:id
        })

        getBranList(that)
        getList(that,id,1,kw,'','','',brandId);
       


    },
    showTap:function(e){
        var index = e.target.dataset.index;
        this.setData({
            modalindex:index,
            sublist:0,
            modalShow:true
        })
    },
    listIndex:function(e){
        console.log(e)
        var that = this;
        var index = e.target.dataset.list || '';
        var filter = e.target.dataset.filter || '';
        var type = e.target.dataset.type || '';
        var modalindex = that.data.modalindex;
        var startPrice =  e.target.dataset.start?e.target.dataset.start:'';
        var endPrice = e.target.dataset.end?e.target.dataset.end:'';
        var brandId = e.target.dataset.brand?e.target.dataset.brand:'';
        if(brandId){
            that.setData({
                inputInfo:'',
                productName:''
            })
        }
        var productName = that.data.productName;
        that.setData({
            startPrice:startPrice,
            endPrice:endPrice,
            type:type,
            page:1,
            modalShow:false,
            sublist:index,
            brandId:brandId
        })

        wx.showToast({
            title:'加载中...',
            icon:'loading',
            mask:true,
            duration:2000
        })

        var id = that.data.id;
        console.log(productName)
        console.log(type)
        console.log(startPrice)
        console.log(endPrice)


        getList(that,id,1,productName,type,startPrice,endPrice,brandId)


    },
    resetOptions:function(){
        this.setData({
            sublist:0
        })
    },

    //搜索查询
    searchConfirm:function(e){
        var value = e.detail.value;
        var that = this;
        console.log(value)
        getList(that,'',1,value);
        getList(that,'',1,value,'','','','')
        this.setData({
            productName:value,
            page:1
        })

    },
    closeModal:function(){
        this.setData({
            modalShow:false
        })
    },
    //上拉加载更多
    onReachBottom:function(){
        var that = this;
        var id = that.data.id;
        var productName = that.data.productName;
        var type = that.data.type;
        var startPrice = that.data.startPrice;
        var endPrice = that.data.endPrice;
        var brandId = that.data.brandId;
 
        getList(that,id,2,productName,type,startPrice,endPrice,brandId)
    },
    //下拉刷新
    onPullDownRefresh:function(){
        var that = this;
        var id = that.data.id;
        var productName = that.data.productName;
        var type = that.data.type;
        var startPrice = that.data.startPrice;
        var endPrice = that.data.endPrice;
    
        getList(that,id,1,'','','','','')
        that.setData({
            page:1,
            inputInfo:'',
            productName:''
        })
    }

    
})


function getList(that,id,page,productName,type,startPrice,endPrice,brandId){
    var productName = productName?productName:'';
    if(type){
        var url=app.data.url+'/product/productList.do?'+type+'='+type+'&brandId='+brandId;
    }else{
        var url=app.data.url+'/product/productList.do?brandId='+brandId;
    }
    wx.request({
        url:url,
        method:'post',
        header:{
            'content-type':'application/x-www-form-urlencoded'
        },
        data:{
            speciesId:id,
            userAppName:app.data.userAppName,
            page:page,
            pageSize:10,
            productName:productName, 
            startPrice:startPrice,
            endPrice:endPrice,
            brandId:brandId

        },
        success:function(res){
            console.log(res)
            wx.hideToast();
            if(res.data.code == 0){
                if(page == 1){
                    wx.stopPullDownRefresh()
                    that.setData({  
                        goodsDatas:res.data.data.product
                    })
                }else{
                    console.log(that.data.page)
                    that.setData({  
                        goodsDatas:that.data.goodsDatas.concat(res.data.data.product),
                        page:that.data.page+1
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

function getBranList(that){
    wx.request({
        url:app.data.url+'/product/productList.do',
        method:'post',
        header:{
            'content-type':'application/x-www-form-urlencoded'
        },
        data:{
            userAppName:app.data.userAppName,
        },
        success:function(res){
            console.log(res);
            if(res.data.code ==0){
                var brandArr = res.data.data.brand;
                that.setData({
                    brandArr:brandArr
                })
            }
        }

    })
}