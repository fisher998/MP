import util from '../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  goodModel
} from '../../apis/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {
      data: [],
      total: 0,
      per_page: 20,
      current_page: 1,
      last_page: 1
    },
    param: {
    },
    loading: true,
    refresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let {
      myself = 0, card_id=0
    } = options;
    this.setData({
      myself,
      'param.card_id': card_id
    })
    this.getList();
  },
  goUrl: function(e) {
    let {
      url
    } = util.getData(e);
    this.closeAction();
    util.goUrl(url)
  },
  //获取列表
  async getList() {
    let that = this;
    let {
      refresh,
      param,
      list
    } = this.data;
    let newlist = await goodModel.getList(param);

    let oldlist = list;
    //如果刷新,则不加载老数据
    if (!refresh) {
      newlist.data = [...oldlist.data, ...newlist.data];
    }
    util.hideAll();
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
    })
    wx.showNavigationBarLoading()
    that.getList();
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
    if (current_page == last_page || loading) return;
    that.setData({
      'param.page': current_page + 1,
      loading: true
    })
    that.getList();
  },
  handerClickGood(e) {
    let {
      id,
      index
    } = util.getData(e);
    this.setData({
      id,
      index,
      show: true
    })
  },
  closeAction() {
    this.setData({
      show: false
    })
  },
  async del() {
    let {
      confirm
    } = await wx.pro.showModal({
      title: '提示',
      content: '确定删除?',
    })
    if (!confirm) return;
    let {
      id
    } = this.data;
    util.showLoading("加载中")
    await goodModel.del({
      id
    })
    util.hideAll();
    this.setData({
      show: false
    })
    this.onPullDownRefresh();
  },
  async moveToFirst(){
    let {
      id
    } = this.data;
    let priority_time = parseInt(+new Date() / 1000)
    util.showLoading("加载中")
    await goodModel.update({
      id,
      priority_time
    })
    this.setData({
      show: false
    })
    util.hideAll();
    this.onPullDownRefresh();
  }
})