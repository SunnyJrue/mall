var app = getApp()
Page({
    data: {
        navLeftItems: [],
        navRightItems: [],
        curNav: -1,
		curIndex: 0,
        modalindex:'1',
        obj:'',
        sublist:-1,
        modalShow:false,
        default:'',
        windowHeight:''
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
        
        // wx.request({
        //     url: 'http://huanqiuxiaozhen.com/wemall/goodstype/typebrandList',
        //     method: 'GET',
        //     data: {},
        //     header: {
        //         'Accept': 'application/json'
        //     },
        //     success: function(res) {
        //         that.setData({
        //             navLeftItems: res.data,
        //             navRightItems: res.data
        //         })
        //     }
        // })

        //分类商品获取
        var userAppName = app.data.userAppName
        console.log(userAppName);
        wx.request({
            url:'http://119.23.216.161:8080/product/productList.do?userAppName='+userAppName,
            method:'post',
            data:{},
            header: {
                'Accept': 'application/json'
            },
            success:function(res){
                console.log(res)
                that.setData({
                    navLeftItems:res.data.data.species,
                    obj:res.data.data.product
                })
            }

        })





    },

    //事件处理函数
    switchRightTab: function(e) {

        var id = e.target.dataset.id,
			index = parseInt(e.target.dataset.index),
            itemId = e.target.dataset.itemid,
            that = this;

		this.setData({
			curNav: id,
			curIndex: index
		});
        var url ;

        if(id == -1){
            url = 'http://119.23.216.161:8080/product/productList.do?userAppName='+ app.data.userAppName;
            
        }else{
            url = 'http://119.23.216.161:8080/product/productList.do?userAppName='+ app.data.userAppName+'&id='+itemId+'&page=1&pageSize=10'
        }

        wx.request({
            url: url,
            data:{
                'page':1,
                'pageSize':10
            },
            header:{
                'Accept': 'application/json'
            },
            method:'post',
            success:function(res){
                console.log(res.data.data);
                var data = res.data.data;
                that.setData({
                    obj:data.product,
                })
            }
        })
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
        this.setData({
            sublist:index
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
        e.detail.value = ''
        this.setData({
            default:''
        })
    },
    //点击遮罩关闭遮罩
    closeModal:function(){
        this.setData({
            modalShow:false
        })
    },
    //加载更多
    pullUpLoad:function(){
        console.log(22222)
    }

})