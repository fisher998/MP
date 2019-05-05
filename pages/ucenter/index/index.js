import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  userModel
} from '../../../apis/index.js';

let defaultPageInfo = util.getPageConfig(wx.getStorageSync('configInfo'), ["pay_switch", "open_partner", "tech_support", "qiye_switch"])
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    refresh: false,
    pageConfig: defaultPageInfo,
    userInfo: wx.getStorageSync('allUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    //不是第一次进来就刷新
    let {
      loading
    } = this.data;
    if (!loading) {
      this.onPullDownRefresh();
      return;
    }
    this.firstLoad();
    
  },
  async firstLoad() {
   
    let that = this;
    let refresh = this.data.refresh;
    let [userInfo, configInfo] = await Promise.all([getApp().getUserInfo(refresh), getApp().getConfigInfo(refresh)]);
    let pageConfig = util.getPageConfig(configInfo, ["pay_switch", "open_partner", "tech_support", "qiye_switch"])
    util.hideAll();

    that.setData({
      userInfo,
      pageConfig,
      loading: false,
      refresh: false
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.setData({
      refresh: true
    })
    this.firstLoad();
  },
  async goUrl(e) {
    let {
      url,
			must
    } = util.getData(e)
    let { card: cardInfo } = await getApp().getUserInfo()
    if (!cardInfo && must) {
      this.setData({
        showLogin: true
      })
      return;
    }
		util.goUrl(url)
  },
  formSubmit(e) {
    let formId = e.detail.formId;
    getApp().collectFormId(formId);
	}

    
})