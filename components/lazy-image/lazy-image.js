Component({
	properties: {
		src: {
			type: String,
			value: '',
		},
		mode:{
			type: String,
			value: ''
		}
	},
	data: {
		_src: "/images/icon/default.svg"
	},
	ready() {
		let that=this;
		this.observer = this.createIntersectionObserver().relativeToViewport()
		// 自己统一好observer节点的class
		this.observer.observe('.observer-picture', (res) => {
			console.log(res)
			that.setData({
				_src: that.properties.src
			})
		})
	},
	detached() {
		this.observer && this.observer.disconnect()
	}
})