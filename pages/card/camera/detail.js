import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
	fileModel,
	cardModel
} from '../../../apis/index.js';
import {
	formatImageUrl
} from '../../../utils/req.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		form: {
			person_avatar: '',
			name: "",
			tel: "",
			wechat_number: "",
			company_name: "",
			position: ''
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		let { scene } = options;
		scene = decodeURIComponent(scene)
		console.log(scene)
		let id = scene.split(':')[0];
		let pid = scene.split(':')[1];
		wx.setStorageSync("pid", pid)
		this.getDetail(id)
	},
	initImage: function (person_avatar, form) {
		let that = this;
		person_avatar = formatImageUrl(person_avatar)
		wx.getImageInfo({
			src: person_avatar,
			success: function (res) {
				let {
					height,
					width
				} = res;
				if (height > width) {
					let dp = res.height / res.width;
					that.setData({
						height: 750,
						width: 750 / dp,
						rotate: true,
						form
					})
				} else {
					let dp = res.height / res.width;
					that.setData({
						width: 750,
						height: 750 / dp,
						rotate: false,
						form
					})
				}
				util.hideAll();

			},
		})
	},
	async getDetail(id) {
		util.showLoading("加载中")
		let form = await cardModel.getOutDetail({
			id
		})
		this.setData({
			form
		})
		util.hideAll();
		// let {
		// 	person_avatar
		// } = form
		// this.initImage(person_avatar, form)
	},
	//跳转
	goUrl: function (e) {
		let { url, method } = util.getData(e);
		util.goUrl(url, method)
	},
	formSubmit: function (e) {

		let formId = e.detail.formId;
		getApp().collectFormId(formId);
		let { url } = e.detail.target.dataset
		util.goUrl(url)
	},
	previewImage: function (e) {
		let {
			src,
			key
		} = util.getData(e);
		wx.previewImage({
			current: src,
			urls: imgArr,
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	},
	async getPhoneNumber(e){
		let { encryptedData, sessionKey, iv, errMsg}=e.detail
		let { id } = this.data.form;
		if (!encryptedData) return;
		await cardModel.receiveOut({ id, encryptedData, iv})
		util.showSuccess("认领成功")
		getApp().getUserInfo(true).then(()=>{
			wx.switchTab({
				url: '/pages/card/index/index'
			})
		})
	},
	onShareAppMessage(){
		let { id, own_uid } = this.data.form;
		return {
			title: "【有人@你】邀你认领名片",
			path: `/pages/card/camera/detail?scene=${id}:${own_uid}`
		}
	}
})