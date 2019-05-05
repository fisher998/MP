// radar/components/segment/segment.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
    activeIndex:{
			type:Number,
			value:0
		},
		list:{
			type:Object,
			value:[]
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
		handerIndexChange(e){
			let index = e.currentTarget.dataset.index
			this.triggerEvent('change', {index})
		}
	}
})
