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
		let { desc } = util.getPage(-1).data.form;
		this.setData({
			"form.desc":desc
		})
	},
	//设置表单值
	setFormValue: function (key, value) {
		key = `form.${key}`;
		this.setData({
			[key]: value
		})
	},
	//输入值变化
	handerInputChange: function (e) {
		let {
			key
		} = util.getData(e);
		let value = util.getValue(e);
		this.setFormValue(key, value)
	},
  submit:function(){
		let { desc } = this.data.form;
		util.getPage(-1).setFormValue("desc",desc)
		wx.navigateBack({
			delta:1
		})
	}
	
})