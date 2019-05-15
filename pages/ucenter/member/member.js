import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  vipModel
} from '../../../apis/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [],
    tabActiveIndex: 1,
		mealActiveIndex:0,
		refresh:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
		util.showLoading()
		this.firstLoad();
  },
	async firstLoad(){
		let that = this;
		let { refresh}=that.data;
		let tabList =await vipModel.getList();
		let {card:userInfo} = await getApp().getUserInfo(refresh);
    let { tech_support, vip_desc_imgs } = await getApp().getConfigInfo(refresh);
		
		that.setData({
			tabList,
			userInfo,
			tech_support,
      vip_desc_imgs,
			refresh: false
		})
		util.hideAll();
	},
  handerTabChange: function(e) {
    let {
      index
    } = util.getData(e);
    this.setData({
      tabActiveIndex: index
    })
  },
	handerMealChange: function (e) {
		let {
			index
		} = util.getData(e);
		this.setData({
			mealActiveIndex: index
		})
	},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
		this.setData({
			refresh:true
		})
		this.firstLoad();
  },
	async submit(){
		let { tabList, tabActiveIndex, mealActiveIndex} = this.data;
		let name = tabList[tabActiveIndex].name_id;
		let that=this;
		let term_id = tabList[tabActiveIndex].term_data[mealActiveIndex].id;
		util.showLoading()
		let { order_info} = await vipModel.join({ name, term_id });
		util.hideAll();
		if (order_info) {
			let status = await util.pay(order_info)
			if (!status) return;
		}
		util.showSuccess('支付成功')
		that.onPullDownRefresh();
		getApp().getUserInfo(true)
	},
  goUrl: function (e) {
		let { url }=util.getData(e)
		util.goUrl(url)
	},
})