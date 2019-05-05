import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  cardModel
} from '../../../apis/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [],
    tabActiveIndex: 0,
    tpIndex: 0,
    tpStatus: {
      0: "购买",
      1: "使用",
      2: "已使用"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    util.showLoading();
    this.firstLoad();
  },
  async onShow() {
    let {
      card
    } = await getApp().getUserInfo();
   
    this.setData({
      vip_level: card.vip_level
    })
  },
  async firstLoad() {

    let tabList = await cardModel.getTpList();
    if (util.isEmpty(tabList)) {
      util.showModal("管理员还未配置")
      util.hideAll();
      return;
    }
    let {
      tabActiveIndex,
      tpIndex
    } = this.data;
    util.hideAll();
    this.setData({
      tabList,
      currentTp: tabList[tabActiveIndex].data[tpIndex]
    })
  },
  tabChange() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.setData({
      tabActiveIndex: 0,
      tpIndex: 0
    })
    this.firstLoad();
  },
  handerSwiperChange: function(e) {
    let tpIndex = e.detail.current;
    let {
      tabActiveIndex,
      tabList
    } = this.data;
    let currentTp = tabList[tabActiveIndex].data[tpIndex]
    this.setData({
      tpIndex,
      currentTp
    })
  },
  handerChange(e){
    let { index: tpIndex}=util.getData(e)
    let {
      tabActiveIndex,
      tabList
    } = this.data;
    let currentTp = tabList[tabActiveIndex].data[tpIndex]
    this.setData({
      tpIndex,
      currentTp
    })
  },
  goUrl(e) {
    let {
      url
    } = util.getData(e)
    util.goUrl(url)
  },
  formSubmit: function(e) {
    console.log(e)
    let {
      use_status
    } = this.data.currentTp;
    if (use_status == 0) {
      this.buy()
    }
    if (use_status == 1) {
      this.use()
    }
  },
  async buy() {
    let {
      id
    } = this.data.currentTp;
    util.showLoading();
    let {
      order_info
    } = await cardModel.buyTp({
      temp_id: id
    })
    util.hideAll();
    if (order_info) {
      let status = await util.pay(order_info)
      if (!status) return;
    }
    util.showSuccess("支付成功");
    this.firstLoad();
  },
  async use() {
    let {
      id
    } = this.data.currentTp;
    util.showLoading();
    await cardModel.useTp({
      temp_id: id
    })
    util.showSuccess("使用成功");
    this.firstLoad();
    getApp().getUserInfo(true);
    
  }

})