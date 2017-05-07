

Page({
    data:{
        modalindex:'1',
        obj:[1,2,3,4,5,6,7],
        sublist:0,
        modalShow:false,
        inputInfo:'',
        inputDefault:'',
        goodContent:'',
        location:'广州',
        windowHeight:''
       
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


        var keywords = e.kw;
        var location = e.location;
        this.setData({
            location:location,
            inputInfo:e.kw
        })
        var that = this;
        wx.request({
            url:'',
            dataType:'json',
            success:function(res){
                console.log(res)
                that.setData({
                    goodContent:''
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

        wx.request({
            url:'',
            dataType:'json',
            success:function(res){

            }
        })


        this.setData({
            inputInfo:value
        })

    },
    closeModal:function(){
        this.setData({
            modalShow:false
        })
    },
    //下拉加载更多
    pullUpLoad:function(){
        console.log(2222)
    }

    
})