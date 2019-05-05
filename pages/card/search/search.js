import { cardModel } from '../../../apis/index.js';
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
      keyword: '',
      is_collect:0
    },
		searchTitle:'输入姓名或公司',
		focus:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

		let searchTitleObj={
			0:'搜索人脉广场',
			1:"搜索通讯录"
		}
    let is_collect = options.is_collect||0;
    let searchHistoryList = wx.getStorageSync('searchHistoryList')||[];
    this.setData({
      focus: true,
      searchHistoryList,
      'param.is_collect': is_collect
    })
		wx.setNavigationBarTitle({
			title: searchTitleObj[is_collect]
		})
    //this.firstLoad();
  },
  goUrl:function(e){
		let {url}=util.getData(e)
    util.goUrl(url)
  },
  //首次渲染
  async firstLoad() {
    let that = this;
		let { longitude, latitude }= await getApp().getLocationInfo()
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
		let newlist = await cardModel.getList(param);
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
	clearHistory:function(){
		this.setData({
			searchHistoryList:[]
		})
		wx.setStorageSync('searchHistoryList', '')
	},
  handerFocus:function(){
    this.setData({
      focus:true,
			show:true
    })
  },
	//选择历史记录搜索
  selectHistorySearch:function(e){
    let { keyword}=util.getData(e)
    this.search(keyword)
  },
	//点击搜索
	handerConfirm: function (e) {
		let that = this;
		let keyword = e.detail;
		let searchHistoryList = this.data.searchHistoryList;
		if (!searchHistoryList.includes(keyword) && keyword && searchHistoryList.length<30) {
			searchHistoryList.unshift(keyword);
			that.setData({
				searchHistoryList
			})
			wx.setStorageSync('searchHistoryList', searchHistoryList)
		}
		this.search(keyword)
	},
  search: function (keyword){
    let that = this;
    that.setData({
      loading: true,
      focus: false,
			show:false,
      'param.keyword': keyword,
      'param.page': 1,
      list: {
        data: []
      },
    })
		that.getList()
  }
})