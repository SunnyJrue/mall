var app = getApp()
Page({
    data: {
        navLeftItems: [],
        navRightItems: [],
        curNav: 1,
		curIndex: 0,
        modalindex:'1',
        obj:[1,2,3,4,5,6,7],
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
        
        wx.request({
            url: 'http://huanqiuxiaozhen.com/wemall/goodstype/typebrandList',
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function(res) {
                that.setData({
                    navLeftItems: res.data,
                    navRightItems: res.data
                })
            }
        })
    },

    //事件处理函数
    switchRightTab: function(e) {
        let id = e.target.dataset.id,
			index = parseInt(e.target.dataset.index);
		this.setData({
			curNav: id,
			curIndex: index
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