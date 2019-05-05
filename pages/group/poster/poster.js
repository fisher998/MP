import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
	formatImageUrl
} from '../../../utils/req.js'
Page({

  /**
   * 页面的初始数据
   */
	data: {

	},

  /**
   * 生命周期函数--监听页面加载
   */
	async onReady() {
		let that = this;
		util.showLoading();
		let detail=util.getPage(-1).data.detail;
		let { name, logo, poster_qrcode, peoples, category } = detail
		logo = util.isEmpty(logo) ? "" : formatImageUrl(logo[0].path);
		poster_qrcode = formatImageUrl(poster_qrcode)
		let template = {
			background: "#fff",
			width: '686rpx',
			height: '802rpx',
			views: [
				{
					type: 'image',
					url: logo,
					css: {
						top: '64rpx',
						left: '64rpx',
						width: '96rpx',
						height: '96rpx',
						borderRadius: '4rpx'
					},
				},
				{
					type: 'text',
					text: name,
					css: {
						width: '400rpx',
						maxLines: 1,
						left: '190rpx',
						top: '70rpx',
						fontSize: '32rpx',
						color: "#222222"
					}
				},
				{
					type: 'text',
					text: `${peoples}位成员，${category}`,
					css: {
						width: '440rpx',
						maxLines: 1,
						left: '190rpx',
						top: '122rpx',
						fontSize: '24rpx',
						color: "#888888"
					}
				},
				{
					type: 'text',
					text: '扫码或长按识别加入',
					css: {
						width: '686rpx',
						maxLines: 1,
						left: '343rpx',
						top: '660rpx',
						fontSize: '32rpx',
						color: "#000000",
						align: "center"
					}
				},
				{
					type: 'text',
					text: '资源共享 人脉互通 商机交换',
					css: {
						width: '686rpx',
						maxLines: 1,
						left: '343rpx',
						top: '710rpx',
						fontSize: '26rpx',
						color: "#888888",
						align:"center"
					}
				},
				{
					type: 'image',
					url: poster_qrcode,
					css: {
						top: '226rpx',
						left: '183rpx',
						width: '320rpx',
						height: '320rpx',
						borderRadius: '160rpx'
					},
				},
				{
					type: 'rect',
					css: {
						color:"#efeff5",
						top: '560rpx',
						left: '288rpx',
						width: '110rpx',
						height: '40rpx',
						borderRadius: '20rpx'
					},
				},
				{
					type: 'text',
					text: '群名片',
					css: {
						top: '564rpx',
						left: '310rpx',
						height: '40rpx',
						width: '110rpx',
						color:"#888888",
						maxLines: 1,
						fontSize: '24rpx',
					},
				},
				
			],
		}
		that.setData({
			template
		})
		
	},
	onImgOK: function (e) {
		util.hideAll();
		let imagePath = e.detail.path;
		this.setData({
			imagePath
		})
	},
	previewImage: function () {
		let imagePath = this.data.imagePath
		wx.previewImage({
			urls: [imagePath],
		})
	},
	async save(e) {
		let that=this;
		let filePath = this.data.imagePath;
		await wx.pro.saveImageToPhotosAlbum(filePath).then((d) => {
			util.showSuccess("保存成功")
		}).catch((e) => {
			that.setData({
				settingShow: e.errMsg.includes('auth')
			})
		})
	}
})