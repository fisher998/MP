import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
var WxParse = require('../../../plugin/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let {
      key
    } = options;
    key = key || "info";
    let titleObj = {
      info: "信息发布准则"
    }
    wx.setNavigationBarTitle({
      title: titleObj['info']
    })
    util.showLoading()
    let configInfo = await getApp().getConfigInfo()
    let content = configInfo[`${key}_agreement`]
    let space = wx.getSystemInfoSync().windowWidth / 750 * 32
    WxParse.wxParse('content', 'html', content, this, space);
    util.hideAll();
  },
  submit: function() {
    wx.navigateBack({
      delta: 1,
    })
  }
})