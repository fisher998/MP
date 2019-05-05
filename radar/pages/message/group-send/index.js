import util from '../../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
	radarModel
} from '../../../../apis/index.js';
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

	},
  goUrl(e){
		let {url}=util.getData(e)
		util.goUrl(url)
	}
})