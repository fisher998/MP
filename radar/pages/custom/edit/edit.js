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
    sexList: ["未知", "男", "女"],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    util.showLoading()
    let form = util.getPage(-1).data.detail;
    this.setData({
      form
    })
    util.hideAll();
  },
  //设置表单值
  setFormValue: function (key, value) {
    key = `form.${key}`;
    this.setData({
      [key]: value
    })
  },
  //输入值变化
  handerInputChange: function (e) {
    let {
      key
    } = util.getData(e);
    let value = util.getValue(e);
    this.setFormValue(key, value)
  },
  handerSwitchChange(e){
    let is_shield = e.detail.value;
    is_shield = is_shield?0:1;
    this.setData({
      'form.is_shield': is_shield
    })
  },
  //选择地理位置
  async chooseLocation(e) {
    let {
      key
    } = util.getData(e)
    key = `form.${key}`;
    let that = this;

    await wx.pro.chooseLocation().then((d) => {
      let {
        name,
        address,
        latitude,
        longitude
      } = d;
      that.setData({
        'form.address': address
      })
    })
  },
  async submit() {
    let { u_card_id, id, nick_name, tel, sex, email, company_name, position, address, birthday, is_shield } = this.data.form;
    if (!nick_name) {
      util.showModal("备注不能为空");
      return;
    }
    let param = { u_card_id, id, nick_name, tel, sex, email, company_name, position, address, birthday, is_shield }
    await customerModel.edit(param)
    util.showSuccess("编辑成功")
    util.getPage(-1).onPullDownRefresh();
    wx.navigateBack({
      delta: 1,
    })
  }
})