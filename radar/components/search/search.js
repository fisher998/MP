// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
		placeholder:{
      type:String,
      value:"搜索"
    },
    url:{
      type:String,
      value:''
    },
    focus:{
      type:Boolean,
      value:false
    },
		keyword:{
			type:String,
			value:''
		}
  },

  /**
   * 组件的初始数据
   */
  data: {
    keyword:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    setValue:function(e){
      let that = this;
      let value=e.detail.value;
      that.setData({
        keyword:value
      })
    },
    clear:function(){
      this.setData({
        keyword: ''
      })
    },
		confirm:function(e){
			let keyword = this.data.keyword
			this.triggerEvent('confirm', keyword);
    },
		back:function(){
     wx.navigateBack({
			 delta: 1,
		 })
		},
    focus:function(){
      this.triggerEvent('focus');
    },
		blur: function () {
			this.triggerEvent('blur');
		},
    goUrl:function(){
      let url = this.properties.url;
			wx.navigateTo({
				url,
			})
    }
  }
})
