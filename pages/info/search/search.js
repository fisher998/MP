import { infoModel } from '../../../apis/index.js';
import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
Page({

  /**
   * 页面的初始数据
   */
	data: {
		list: {
			data: []
		},
		loading: false,
		refrensh: false,
		param: {
			page: 1,
			keyword: ''
		},
		searchTitle: '输入姓名或内容',
		focus: true
	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {

		let searchHistoryList = wx.getStorageSync('searchHistoryList') || [];
		this.setData({
			focus: true,
			searchHistoryList
		})
		this.firstLoad();
	},
	goUrl: function (e) {
		let { url } = util.getData(e)
		util.goUrl(url)
	},
	//首次渲染
	async firstLoad() {
		let that = this;
		let { longitude, latitude } = await getApp().getLocationInfo()
		that.setData({
			'param.longitude': longitude,
			'param.latitude': latitude,
		})
	},
	//获取列表
	async getList() {

		let that = this;
		let { refresh, param, list, tabActiveIndex } = this.data;
		let oldlist = list;
		let newlist = await infoModel.getList(param);
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
	clearHistory: function () {
		this.setData({
			searchHistoryList: []
		})
		wx.setStorageSync('searchHistoryList', '')
	},
	handerFocus: function () {
		this.setData({
			focus: true,
			show: true
		})
	},
	//选择历史记录搜索
	selectHistorySearch: function (e) {
		let { keyword } = util.getData(e)
		this.search(keyword)
	},
	//点击搜索
	handerConfirm: function (e) {
		let that = this;
		let keyword = e.detail;
		let searchHistoryList = this.data.searchHistoryList;
		if (!searchHistoryList.includes(keyword) && keyword && searchHistoryList.length < 30) {
			searchHistoryList.unshift(keyword);
			that.setData({
				searchHistoryList
			})
			wx.setStorageSync('searchHistoryList', searchHistoryList)
		}
		this.search(keyword)
	},
	search: function (keyword) {
		let that = this;
		that.setData({
			loading: true,
			focus: false,
			show: false,
			'param.keyword': keyword,
			'param.page': 1,
			list: {
				data: []
			},
		})
		that.getList()
	},
	previewImage: function (e) {
		console.log(e)
		let {
			src,
			index
		} = util.getData(e);
		let imageList = this.data.list.data[index].imgs;
		let imgArr = [];
		for (let i in imageList) {
			imgArr.push(imageList[i].path)
		}
		wx.previewImage({
			current: src,
			urls: imgArr,
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	},
	async like(e) {
		let { index } = util.getData(e)
		let { id, like, is_like } = this.data.list.data[index];
		if (is_like) {
			util.showFail("你已点过赞了")
			return;
		}
		let key1 = `list.data[${index}].like`;
		let key2 = `list.data[${index}].is_like`
		util.showLoading();
		await infoModel.like({ id })
		this.setData({
			[key1]: like + 1,
			[key2]: true
		})
		util.hideAll();
		util.showSuccess("点赞成功")
	}
})