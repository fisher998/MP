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
		list: [{
			id: 1,
			name: "严鑫1"
		}],
		isCheckAll:false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.init();
	},
	//初始化按钮选择状态
	init(){
		let totalList = util.deepCopy(util.getPage(-1).data.list);
		let list = totalList.filter((item) => item.isStar)
		this.setData({
			list
		})
		this.handerCheckAllStatusChange();
	},
	//确定后触发全部的选择客户变化
	submit(){
		let totalList = util.getPage(-1).data.list;
		let {list}=this.data;
		totalList = totalList.map((item) => {
			let resItem = list.find((e) => {
				return item.id == e.id
			})
			if (resItem){
				item.checked = resItem.checked
			}
			return item
		})
		util.getPage(-1).setData({
			list: totalList
		})
		wx.navigateBack({
			delta: 1,
		})
	},
	//按钮选择状态变化
	handerRadioChange(e) {
		let { index, checked } = util.getData(e);
		let key = `list[${index}].checked`;
		this.setData({
			[key]: !checked
		})
		this.handerCheckAllStatusChange();
	},

	//根据全选操作执行全选或者全不选
	handerCheckAllChange() {
		let { list, isCheckAll } = this.data;
		list = list.map((item) => {
			item.checked = !isCheckAll
			return item
		})
		this.setData({
			list
		})
		this.handerCheckAllStatusChange();
	},
	//全选状态变化
	handerCheckAllStatusChange() {
		let { list } = this.data;
		let isCheckAll = list.every((item) => { return item.checked == true })
		this.setData({
			isCheckAll
		})
	},
})