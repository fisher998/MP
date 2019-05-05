// radar/components/count/count.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
    list:{
			type:Array,
			value:[]
		},
		maxCount:{
			type:Number
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

	},
	ready: function () {
		// let list = this.properties.list;
		// if(list.length>0){
		// 	list.sort((a, b) => {
		// 		return a.count - b.count
		// 	})
		// 	//最大的500长度
		// 	let max = list[list.length - 1].count
		// 	let ratio = (max / 400);
		// 	console.log(ratio)
		// 	this.setData({
		// 		ratio
		// 	})
		// }
	}
})
