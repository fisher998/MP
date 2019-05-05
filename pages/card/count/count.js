import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import { cardModel } from '../../../apis/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
      id: 1,
      title: "看过我"
    }, {
      id: 3,
      title: "收藏我"
    }, {
      id: 2,
      title: "赞过我"
    }, {
      id: 4,
      title: "我看过"
    }],
    tabActiveIndex: 0,
    list: {
      data: []
    },
    loading: true,
    refrensh: false,
    param: {
      page: 1,
			data_type:1
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		let { index } = options;
		index=index||0;
		let tabList = this.data.tabList;
		this.setData({
			tabActiveIndex:index,
			'param.data_type': tabList[index].id
		})
  },
	onShow:function(){
		this.onPullDownRefresh();
	},
  onReady() {
    let that = this;
    const query = wx.createSelectorQuery()
    query.select('#sticky-tab').boundingClientRect()
    query.exec(function (res) {
      that.setData({
        stickyTop: res[0].height
      })
    })
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
  //tab切换
  tabChange(e) {
    let that = this;
    let index = e.detail.index;
    let { tabList } = this.data;

    // 切换tab后改变活动tab索引,以及初始化页面page
    that.setData({
      tabActiveIndex: index,
      loading: true,
      'list.data': [],
      'param.page': 1,
      'param.data_type': tabList[index].id
    }, function () {
      that.getList();
    })

  },
  //获取列表
  async getList () {

    let that = this;
    let { refresh, param, list, tabActiveIndex } = this.data;
		
		let oldlist = list;
		let newlist = await cardModel.getOperateList(param);
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