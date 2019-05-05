// components/notify/notify.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    duration:{
      type:Number,
      value:2500
    },
    show:{
      type: Boolean,
      value:false,
      observer: function observer(value) {
        if(value){
          this.show();
        }
       
      }
    },
    auto:{
      type:Boolean,
      value:true
    }

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    show:function(){
      let that=this;
      if (!that.properties.auto){
        return;
      }
      setTimeout(function () {
        that.setData({
          show: false
        })
      }, that.properties.duration)
    },
  },
  ready:function(){
    
  },
 
})
