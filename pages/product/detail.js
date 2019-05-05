import util from '../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  goodModel,
  radarModel
} from '../../apis/index.js';
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
    let { id,uid=""} = options;
    wx.setStorageSync('pid', uid || "")
    util.showLoading()
    let getDetail = goodModel.getDetail({ id })
    let detail = await getDetail;
    util.hideAll();
    this.setData({
      detail
    })
    radarModel.report({
      event_name: "view_goods",
      obj_uid: detail.uid
    })
  },
  goUrl: function (e) {
    let {
      url,
      method
    } = util.getData(e);
    util.goUrl(url, method)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let {id,title,cover,uid}=this.data.detail;
    return{
      title,
      path:`/pages/product/detail?id=${id}&uid=${uid}`,
      imageUrl: cover[0].path
    }
  }
})