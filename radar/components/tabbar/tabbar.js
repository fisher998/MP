Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		tabbar:{
			type:Object
		},
		nowPageIndex:{
			type:Number,
			value:0
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		isIpx:false
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
    goUrl:function(e){
			let { url, method } = e.currentTarget.dataset;
			wx[method]({
				url,
			})
		}
	},
	ready:function(){
		let model = wx.getSystemInfoSync().model
		if (model.indexOf('iPhone X') > -1) {
			this.setData({
				isIpx: true
			})
		}
		
	}
})
