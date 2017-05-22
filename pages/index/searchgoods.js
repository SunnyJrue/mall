
var app = getApp();
Page({
    data:{
        modalindex:'1',
        obj:[1,2,3,4,5,6,7],
        sublist:0,
        modalShow:false,
        productName:'', //关键字查询
        inputDefault:'',
        goodContent:'',
        location:'深圳',
        windowHeight:'',
        goodsDatas:'',
        page:1,
        id:''
       
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

        var id = e.id;
        this.setData({
            location:location,
            inputInfo:e.kw,
            id:id
        })

        getList(that,id,1,'');


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
        var index = e.target.dataset.list;
        console.log(index)

        this.setData({
            sublist:index,

        })
    },
    resetOptions:function(){
        this.setData({
            sublist:0
        })
    },
    //筛选排序等
    submits:function(e){
        var modalindex = this.data.modalindex;
        var listcontent = this.data.sublist;
        var inputInfo = this.data.inputInfo;
        var location = this.data.location;
        console.log(listcontent);
        console.log(modalindex);
        console.log(inputInfo);
        var that =this;

        wx.request({
            url:'',
            dataType:'json',
            success:function(res){
                that.setData({
                    goodContent:res
                })
            }
        })
        this.setData({
            modalShow:false,
        })






    },
    //搜索查询
    searchConfirm:function(e){
        var value = e.detail.value;
        var that = this;
        getList(that,'',1,value);
        


        this.setData({
            productName:value
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
        var page = that.data.page;
        var id = that.data.id;
        var productName = that.data.productName;

        getList(that,id,2,productName)



    }

    
})



function getList(that,id,page,productName){
    var page = page?page:1;
    console.log(page)
    var productName = productName?productName:'';
    wx.request({
        url:'https://tobidto.cn/product/productList.do',
        method:'post',
        header:{
            'content-type':'application/x-www-form-urlencoded'
        },
        data:{
            id:id,
            userAppName:app.data.userAppName,
            page:page,
            pageSize:10,
            productName:productName,
           
        },
        success:function(res){

            console.log(res)
            if(res.data.code == 0){
                if(page == 1){
                    that.setData({  
                        goodsDatas:res.data.data.product
                    })
                }else{
                    that.setData({  
                        goodsDatas:that.data.goodsDatas.concat(res.data.data.product),
                        page:page+1
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