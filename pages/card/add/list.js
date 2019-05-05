import util from '../../../utils/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = getApp().globalData.userInfo;
    this.setData({
      userInfo
    })
  },
  //跳转
  goUrl: function (e) {
    let {
      url
    } = util.getData(e);
    util.goUrl(url)
  }
})