

Page({
    data:{
        modalindex:'1',
        obj:[1,2,3,4,5,6,7],
        sublist:0

    },
    onLoad:function(){

    },
    showTap:function(e){
        var index = e.target.dataset.index;
        this.setData({
            modalindex:index,
            sublist:0
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
        
    }

    
})