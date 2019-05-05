import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import { partnerModel } from '../../../apis/index.js';
Page({

  /**
   * 页面的初始数据
   */
	data: {
		list: {
			data: []
		},
		loading: true,
		refrensh: false,
		param: {
			page: 1,
		},
		oplist:{
			"1":"加入vip",
			"2": "购买模板",
			"3": "加入合伙人",
			"4":"信息置顶",
			"-1": "提现"
		}
	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		this.firstLoad();
	},
	goUrl: function (e) {
		let { url } = util.getData(e);
		util.goUrl(url)
	},
	//首次渲染
	firstLoad: function () {
		let that = this;
		that.getList();
	},
	//获取列表
	async getList() {

		let that = this;
		let { refresh, param, list, tabActiveIndex } = this.data;

		let oldlist = list;
		let newlist = await partnerModel.getIncomeList(param);
		util.hideAll();
		//如果刷新,则不加载老数据
		if (!refresh) {
			newlist.data = [...oldlist.data, ...newlist.data];
		}
		that.setData({
			list: newlist,
			loading: false,
			refresh: false,
		})

	},
	//刷新
	onPullDownRefresh: function () {
		let that = this;
		that.setData({
			refresh: true,
			'param.page': 1
		}, function () {
			wx.showNavigationBarLoading()
			that.firstLoad();
		})
	},
  /**
   * 页面上拉触底事件的处理函数
   */
	onReachBottom: function () {
		let that = this;
		let { loading, list } = this.data;
		let { current_page, last_page } = list;
		if (current_page != last_page && !loading) {
			that.setData({
				'param.page': current_page + 1,
				loading: true
			}, function () {
				that.getList();
			})
		}
	},
})