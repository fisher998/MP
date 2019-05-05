import util from '../../../utils/index.js';
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
		let desc = util.getPage(-1).data.detail.desc;
		this.setData({
			desc
		})
	},
})