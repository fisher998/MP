import util from '../../../utils/index.js';
import { uploadModel } from '../../../apis/index.js';
Page({
	takePhoto() {
		const ctx = wx.createCameraContext()
		ctx.takePhoto({
			quality: 'high',
			success: (res) => {
				let src=res.tempImagePath
				wx.redirectTo({
					url: `/pages/card/camera/add?src=${src}`
				})
			}
		})
	},
	error(e) {
		this.setData({
			settingShow: e.detail.errMsg.includes('auth')
		})
	},
	//选择图片
	chooseImage(e) {
		let that=this;
		wx.chooseImage({
			count: 1,
			success: function(res) {
				console.log(res)
				let {
					tempFilePaths
				} = res;
				let src = tempFilePaths[0]
				wx.redirectTo({
					url: `/pages/card/camera/add?src=${src}`
				})
			},
		})
	
	},
	exit:function(){
		wx.navigateBack({
			delta:1
		})
	}
})