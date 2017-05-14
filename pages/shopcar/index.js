var app = getApp()
Page( {
  data: {
    cartImg: '../../images/cart-null.png',
    tipWords: '购物车空空如也',
    totalPrice:0,
    goodsSUm:0,
    arr:[false,false,false],
    eachPrice:[69,69,69],
    allChecked:false

  },
  onLoad:function(){




  },
  checkboxChange:function(e){
    console.log(e.detail)
    var sum = 0;

    for(var i = 0 ; i < e.detail.value.length ; i++){
        sum +=e.detail.value[i] -0;
    }
    this.setData({
        totalPrice:sum,
        goodsSUm: e.detail.value.length
    });
    var info ;
    
    e.detail.value.length == 3?(info = true):(info = false)
    this.setData({
        allChecked:info,
    })
  },
  selectAll:function(e){
    var that = this;
    var arrs = this.data.arr;
    if(this.data.allChecked){
        changeCheck(arrs,false,that);
        this.setData({
            allChecked:false,
            goodsSUm:0,
            totalPrice:0
        })


    }else{
        changeCheck(arrs,true,that);
        var sum = 0
        
        for(var i = 0 ; i < this.data.eachPrice.length ; i++){
            sum += this.data.eachPrice[i]
        }
        this.setData({
            allChecked:true,
            goodsSUm:3,
            totalPrice:sum,
        })



    }
  }
})

function changeCheck(arrs,para,that){
    var arrInfo = arrs;
    for( var i = 0 ; i < arrInfo.length ; i++){
        arrInfo[i] = para;
    }
    console.log(arrInfo)
    that.setData({
        arr:arrInfo
    })
}
