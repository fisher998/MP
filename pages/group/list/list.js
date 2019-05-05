import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  groupModel
} from '../../../apis/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {
      data: []
    },
    loading: true,
    refresh: false,
    param: {
      page: 1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList();

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

    let newlist = await groupModel.getList(param)
    util.hideAll()
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
  goUrl: function(e) {
    let {
      url
    } = util.getData(e);
    util.goUrl(url)
  },
  async dismiss(e) {
    let that = this;
    let {
      id,
      index
    } = util.getData(e)
    let {
			confirm
    } = await wx.pro.showModal({
      title: "提示",
      content: "解散后将不能看到该群信息,确定解散?"
    })
		console.log(confirm)
		if (!confirm) return;
    await groupModel.dismiss({
      id
    })
    util.showSuccess("解散成功")
    let key = `list.data[${index}].switch`;
    that.setData({
      [key]: 'off'
    }, function() {
      that.onPullDownRefresh();
    })
  },
  async exit(e) {
    let that = this;
    let {
      id,
      index
    } = util.getData(e)
    let key = `list.data[${index}].switch`;
    let {
			confirm
    } = await wx.pro.showModal({
      title: "提示",
      content: "退出后将不能看到该群信息,确定退出?"
    })
		if (!confirm) return;
    await groupModel.exit({
      id
    })
    util.showSuccess("退出成功")
    that.setData({
      [key]: 'off'
    }, function() {
      that.onPullDownRefresh();
    })
  },
  handerSwiperChange: function(e) {
    let {
      index
    } = util.getData(e);
    let key = `list.data[${index}].switch`;
    let val = e.detail;
    this.setData({
      [key]: val
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.setData({
      refresh: true
    })
    this.getList();
  }
})