// components/auth/auth.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name:{
      type:String,
			value:"userLocation"
    },
    show:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
     contentList:{
			 phone: "授权获取手机号",
			 userLocation:"你的地理位置",
			 address:"你的通讯地址",
			 invoiceTitle:"发票抬头",
			 invoice:"获取发票",
			 werun:"微信运动步数",
			 record:"你的录音功能",
			 writePhotosAlbum:"你的保存到相册功能",
			 camera:"摄像头"
     }
  },

  /**
   * 组件的方法列表
   */
  methods: {
		success:function(e){
			let authSetting = e.detail.authSetting;
			let name = this.properties.name
			if (authSetting[`scope.${name}`]){
				wx.showToast({
					title: '已开启相应权限！',
					icon:"none"
				})
        this.triggerEvent('success')
			}else{
				wx.showToast({
					title: '未开启相应权限！',
					icon: "none"
				})
			}
			this.setData({
				show:false
			})
    },
		cancel(){
      wx.showToast({
				title: '未开启相应权限！',
				icon: "none"
			})
			this.setData({
				show: false
			})
		}
  },
	ready(){
		
	}
})
