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
    color: "#21bf34",
    param: {
      page: 1,
      keyword: "",
      order_type: 3,
    },
    list: {
      data: [],
      total: 0,
      per_page: 20,
      current_page: 1,
      last_page: 0
    },
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.getList();
  },
  onReady() {
    let that = this;
    const query = wx.createSelectorQuery()
    query.select('#sticky-input').boundingClientRect()
    query.exec(function (res) {
      console.log(res)
      that.setData({
        stickyTop: res[0].height
      })
    })
  },
  goUrl: function (e) {
    let { url, method } = util.getData(e)
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
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      refresh: true,
      'param.page': 1
    }, function () {
      wx.showNavigationBarLoading()
      that.getList();
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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
      }, function () {
        that.getList();
      })
    }
  },
  handerConfirm: function (e) {
    let that = this;
    let keyword = e.detail;
    this.search(keyword)
  },
  search: function (keyword) {
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


})