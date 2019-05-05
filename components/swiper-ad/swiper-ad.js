import util from '../../utils/index.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type:Array,
      value: [],
    },
    height:{
      type: Number,
      value: 350
    },
    indicatorDots:{
      type:Boolean,
      value:true
    },
    autoplay:{
      type: Boolean,
      value: true
    },
    interval:{
      type:Number,
      value: 5000
    },
    duration: {
      type: Number,
      value: 500
    },
    indicatorColor:{
      type:String,
      value:"rgba(248,248,248,0.6)"
    },
    indicatorActiveColor:{
      type: String,
      value: "#fff"
    },
    circular:{
      type:Boolean,
      value:true
    },
    previousMargin:{
      type: Number,
      value: 0
    },
    nextMargin: {
      type: Number,
      value: 0
    },
    space: {
      type: Number,
      value: 0
    },
    borderRadius:{
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeIndex:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handerChange:function(e){
      let activeIndex = e.detail.current;
      this.setData({
        activeIndex
      })
    },
    goUrl:function(e){
      let {url}=util.getData(e)
			util.goUrl(url)
    }
  }
})
