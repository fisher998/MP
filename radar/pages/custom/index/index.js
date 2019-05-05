import util from '../../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  customerModel
} from '../../../../apis/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBar: getApp().globalData.radarTabBar,
    tabList: [{
      id: 0,
      title: "全部"
    }, {
      id: 1,
      title: "跟进"
    }, {
      id: 2,
      title: "成交"
    }],
    list: {
      data: [],
      total: 0,
      per_page: 20,
      current_page: 1,
      last_page: 0
    },
    param: {
      page: 1,
      keyword: "",
      order_type: 0
    },
    refresh: false,
    loading: true,
    tabActiveIndex: 0,
    scrollTop: 0,
    nowPageIndex: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let that = this;

    that.getList();
    that.subscribe();
  },
  //页面卸载
  onUnload() {
    getApp().websocket.unSubscribe("getAllUnRead");
  },
  async subscribe() {
    getApp().websocket.subscribe("getAllUnRead", this.onAllUnReadChange)
    await getApp().websocket.login()
    getApp().websocket.sendMessage({
      type: "getAllUnRead"
    })
  },
  onAllUnReadChange(data) {
    this.setData({
      'tabBar.list[1].num': data.count
    })
  },
  tabChange: function(e) {
    let index = e.detail.index;
    let {
      tabList
    } = this.data;
    this.setData({
      tabActiveIndex: index,
      loading: true,
      'list.data': [],
      'param.order_type': tabList[index].id
    })
    this.getList();
  },
  goUrl: function(e) {
    let {
      url,
      method
    } = util.getData(e)
    util.goUrl(url, method)
  },
  //获取列表
  async getList() {
    let that = this;
    let {
      refresh,
      param,
      list,
      tabActiveIndex
    } = this.data;
    let newlist;
    try {
      newlist = await customerModel.getList(param)
    } catch (e) {
      newlist = that.data.list
    }
    util.hideAll();
    let oldlist = list;
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
  onPullDownRefresh: function() {
    let that = this;
    that.setData({
      refresh: true,
      'param.page': 1
    }, function() {
      wx.showNavigationBarLoading()
      that.getList();
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    let {
      loading,
      list
    } = this.data;
    let {
      current_page,
      last_page
    } = list;
    if (current_page != last_page && !loading) {
      that.setData({
        'param.page': current_page + 1,
        loading: true
      }, function() {
        that.getList();
      })
    }
  },
  handerConfirm: function(e) {
    let that = this;
    let keyword = e.detail;
    this.search(keyword)
  },
  search: function(keyword) {
    let that = this;
    that.setData({
      loading: true,
      focus: false,
      'param.keyword': keyword,
      'param.page': 1,
      list: {
        data: []
      },
    })
    that.getList()
  },
  //滚动
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  }
})