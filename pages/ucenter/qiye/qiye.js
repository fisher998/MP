import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  userModel
} from '../../../apis/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      company_name: '',
      tel: '',
      address: '',
      company_peoples: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.firstLoad()
  },
  async firstLoad() {
    let {
      qiye_apply_tel
    } = await getApp().getConfigInfo();
    this.setData({
      qiye_apply_tel
    })
  },
  //跳转
  goUrl: function(e) {
    let {
      url
    } = util.getData(e);
    util.goUrl(url)
  },
  //设置表单值
  setFormValue: function(key, value) {
    key = `form.${key}`;
    this.setData({
      [key]: value
    })
  },
  //输入值变化
  handerInputChange: function(e) {
    let {
      key
    } = util.getData(e);
    let value = util.getValue(e);
    this.setFormValue(key, value)
  },
  //选择地理位置
  async chooseLocation(e) {
    let {
      key
    } = util.getData(e)
    key = `form.${key}`;
    let that = this;
		let status = await util.auth("userLocation")
		this.setData({
			settingShow: !status
		})
    let {
			address
		} = await wx.pro.chooseLocation()
		that.setData({
			'form.address': address
		})
  },
  //表单验证
  validate: function(param) {
    let {
      company_name,
      tel,
      address,
      company_peoples,
    } = param

    let validate = new util.Validate();
    validate.add(company_name, "isNoEmpty", "请填写企业全称");
    validate.add(tel, "isNoEmpty", "请填写联系电话");
    validate.add(address, "isNoEmpty", "请填写地址");
    validate.add(company_peoples, "isNoEmpty", "请填写企业人数");

    let message = validate.start();
    return message;
  },
  async submit() {
    util.showLoading();
    let param = util.deepCopy(this.data.form)
    let msg = this.validate(param)
    if (msg) {
      util.hideAll();
      util.showModal(msg)
      return;
    }

    await userModel.applyCompany(param)
    util.hideAll();
    util.showModal("申请成功")
    this.setData({
      form: {
        company_name: '',
        tel: '',
        address: '',
        company_peoples: ''
      }
    })
  }
})