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
  onLoad: function(options) {
		let {index} = options;
		let list=util.getPage(-1).data.list[index].arr;
		this.setData({
			list,
			index
		})
		this.handerCheckAllStatusChange();
  },
	submit() {
		let { list, index, isCheckAll } = this.data;
		let totalList = util.getPage(-1).data.list[index].arr;
		totalList = totalList.map((item) => {
			let resItem = list.find((e) => {
				return item.id == e.id
			})
			if (resItem) {
				item.checked = resItem.checked
			}
			return item
		})
		let key=`list[${index}].arr`
		let key1 = `list[${index}].checked`
		util.getPage(-1).setData({
			[key]: totalList,
			[key1]: isCheckAll
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