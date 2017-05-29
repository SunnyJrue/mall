var app = getApp()
Page({
    data: {
        navLeftItems: [],
        navRightItems: [],
        curNav: -1,//商品id 用于切换tap显示判定
		curIndex: 0,
        modalindex:0,
        obj:'',
        sublist:-1,
        page:'',
        modalShow:false,
        default:'',
        windowHeight:'',
        oFilter:{
            brand:'品牌',
            classify:'综合',
            comment:'评价',
            price:'价格'
        },
        itemId:'',//传给接口的商品id,
        startPrice:'', //开始价格
        endPrice:'',//结束价格
        type:''//排序
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

        var that = this
        //获取屏幕的高度
        wx.getSystemInfo({
          success: function(res) {
            that.setData({
               windowHeight:res.windowHeight
            })
          }
        })
        

        //分类商品获取
        var userAppName = app.data.userAppName
        console.log(userAppName);
        wx.request({
            url:'https://tobidto.cn/product/productList.do?userAppName='+userAppName+'&page=1&pageSize=10',
            method:'post',
            success:function(res){
                console.log(res)
                that.setData({
                    navLeftItems:res.data.data.species,
                    obj:res.data.data.product
                })
            }

        })
        //获取总店的商品名称和id列表
        getBranList(that)





    },

    //事件处理函数
    switchRightTab: function(e) {

        var id = e.target.dataset.id,
			index = parseInt(e.target.dataset.index),
            itemId = e.target.dataset.itemid,
            that = this;

		this.setData({
			curNav: id, 
            itemId:itemId, //商品的itemid
			curIndex: index,
            modalindex:0,
            oFilter:{
                brand:'品牌',
                classify:'综合',
                comment:'评价',
                price:'价格'
            },


		});
        wx.showToast({
            title:'加载中...',
            icon:'loading',
            mask:true,
            duration:2000
        })

        getClassifyGoods(that,id,itemId)

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
        console.log(brandId)
        that.setData({
            startPrice:startPrice,
            endPrice:endPrice,
            type:type,
            page:1
        })

        wx.showToast({
            title:'加载中...',
            icon:'loading',
            mask:true,
            duration:2000
        })

        var id = that.data.curNav;
        var itemId = that.data.itemId;


        getClassifyGoods(that,id,itemId,type,startPrice,endPrice,'',brandId)



        console.log(modalindex)
            that.setData({
                oFilter:{
                    brand:modalindex==1?filter:'品牌',
                    classify:modalindex==2?filter:'综合',
                    // comment:modalindex==3?filter:'评价',
                    price:modalindex==3?filter:'价格'
                }
            })
        
        this.setData({
            sublist:index,
            modalShow:false

        })
    },
    resetOptions:function(){
        this.setData({
            sublist:0
        })
    },
    submits:function(){
        this.setData({
            modalShow:false
        })
    },
    searchGoods:function(e){
        console.log(e.detail.value)
        wx.navigateTo({
            url:'/pages/index/searchgoods?kw='+e.detail.value,
        })
    },
    //点击遮罩关闭遮罩
    closeModal:function(){
        this.setData({
            modalShow:false
        })
    },
    onPullDownRefresh:function(){
        wx.stopPullDownRefresh()

    },
    //加载更多
    onReachBottom:function(){
        var that = this;
        var id = that.data.curNav,
        itemId = that.data.itemId,
        type = that.data.type,
        startPrice = that.data.startPrice,
        endPrice = that.data.endPrice;

        getClassifyGoods(that,id,itemId,type,startPrice,endPrice,2)

    }

})


function getClassifyGoods(that,id,itemId,type,startPrice,endPrice,page,brandId){
    var url ;
    var page = page?page:1;
    console.log(that.data.page)
    console.log(brandId)
    brandId = brandId?brandId:'';


    if(id == -1){
        url = 'https://tobidto.cn/product/productList.do?userAppName='+ app.data.userAppName+'&page='+page+'&pageSize=10&'+type+'='+type+'&startPrice='+startPrice+'&endPrice='+endPrice+'&brandId='+brandId;
        
    }else{
        url = 'https://tobidto.cn/product/productList.do?userAppName='+ app.data.userAppName+'&id='+itemId+'&page='+page+'&pageSize=10&'+type+'='+type+'&startPrice='+startPrice+'&endPrice='+endPrice+'&brandId='+brandId;
    }

    wx.request({
        url: url,
        header:{
            'Accept': 'application/json'
        },
        method:'post',
        success:function(res){
            if(res.data.code == 0){

                wx.hideToast();
                console.log(res.data.data);
                var data = res.data.data;
                if(page>1){

                    that.setData({
                        obj:that.data.obj.concat(data.product),
                        page:that.data.page*1+1
                    })
                }else{
                    that.setData({
                        obj:data.product,
                    })
                }
                
            }
           
        }
    })
}

function getBranList(that){
    wx.request({
        url:'https://tobidto.cn/product/productList.do',
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