import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import { formatImageUrl } from '../../../utils/req.js'
import {
	partnerModel
} from '../../../apis/index.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		util.showLoading();
    this.firstLoad();
	},
	async firstLoad(){
		let getDetail = partnerModel.getDetail()
		let getConfigInfo=getApp().getConfigInfo();
		let detail = await getDetail;
		await getConfigInfo
		let { partner_poster, partner_qrcode } = detail;
		let partner_poster_path = util.isEmpty(partner_poster) ? "" : partner_poster[0].path
		partner_poster_path = formatImageUrl(partner_poster_path)
		util.hideAll();
    this.setData({
			detail,
			partner_poster_path,
			partner_qrcode
		})
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		wx.showNavigationBarLoading()
		this.firstLoad();
	},
	goUrl:function(e){
		let {url,method}=util.getData(e);
		util.goUrl(url, method)
	},
	formSubmit: function (e) {

		let formId = e.detail.formId;
		let { url } = e.detail.target.dataset
		util.goUrl(url)
	},
	handerPopupHide:function(){
		this.setData({
			show:false
		})
	},
	handerPopupShow:function(){
	
	
		this.setData({
			show: true
		})
		let { imagePath}=this.data;
		if (imagePath) return;
		this.draw();
	},
	draw:function(){
		util.showLoading();
		let { partner_poster_path, partner_qrcode } = this.data;
		let template = {
			background: partner_poster_path,
			width: '750rpx',
			height: '1334rpx',
			views: [

				{
					type: 'image',
					url: partner_qrcode,
					css: {
						top: '883rpx',
						left: '236rpx',
						width: '280rpx',
						height: '280rpx',
					},
				},
			]
		}
		this.setData({
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
		let filePath = this.data.imagePath
		await wx.pro.saveImageToPhotosAlbum(filePath).then((d) => {
			util.showSuccess("保存成功")
		}).catch((e) => {
			that.setData({
				settingShow: e.errMsg.includes('auth')
			})
		})
	}
})