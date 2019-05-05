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
    param: {},
    content: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let { c_uid } = util.getPage(-1).data.detail;
    let { id } = options;
    let param = {
      id,
      c_uid
    }
    let configInfo=await getApp().getConfigInfo();
    let follow_words = configInfo.radar.follow_words|| [];
    this.setData({
      param,
      follow_words
    })
  },
  //输入值变化
  handerInputChange: function (e) {
    let {
      key
    } = util.getData(e);
    let value = util.getValue(e);
    this.setData({
      [key]: value
    })
  },
  async submit() {
    let { param, content } = this.data;
    if (!content) {
      util.showModel("请输入跟进语")
      return;
    }
    param = Object.assign({}, param, { content })
    await customerModel.addFollow(param)
    util.showSuccess("添加成功");
    util.getPage(-1).onPullDownRefresh();
    wx.navigateBack({
      delta: 1,
    })
  },
  handerChange(e) {
    let index = e.detail.value;
    let { content, follow_words } = this.data;
    let word = follow_words[index].title;
    this.setData({
      content: content + word
    })
  }
})