import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  fileModel,
  cardModel
} from '../../../apis/index.js';
import {
  formatImageUrl
} from '../../../utils/req.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      person_avatar: '',
      name: "",
      tel: "",
      wechat_number: "",
      company_name: "",
      position: '',
			address:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let {
      src,
      id
    } = options;
    if (id) {
      this.getDetail(id)
      this.setData({
        id
      })
      wx.setNavigationBarTitle({
        title: '编辑纸质名片'
      })
    }
    if (src) {
      this.scan(src)
    }
  },
  initImage: function(person_avatar, form) {
    let that = this;
    person_avatar = formatImageUrl(person_avatar)
    wx.getImageInfo({
      src: person_avatar,
      success: function(res) {
        let {
          height,
          width
        } = res;
        if (height > width) {
          let dp = res.height / res.width;
          that.setData({
            height: 750,
            width: 750 / dp,
            rotate: true,
            form
          })
        } else {
          let dp = res.height / res.width;
          that.setData({
            width: 750,
            height: 750 / dp,
            rotate: false,
            form
          })
        }
        util.hideAll();

      },
    })
  },
  async getDetail(id) {
    util.showLoading("加载中")
    let form = await cardModel.getOutDetail({
      id
    })
    this.setData({
      form
    })
		util.hideAll();
  },
  async scan(src) {
    let that = this;
    util.showLoading("识别中")
    let form = await fileModel.scan({
      filePath: src
    })
		util.hideAll();
    let {
			has_card,
			card_uid
    } = form
    form.id = 0;
		this.setData({
			form
		})
		if (!has_card) return;
		let { confirm}=await wx.pro.showModal({
			title: '提示',
			content: '该手机号已注册为电子名片',
			showCancel: true,
			cancelText: '返回',
			confirmText: '去查看',
		})
		if (confirm){
			wx.redirectTo({
				url: `/pages/card/home/home?uid=${card_uid}`,
			})
		}else{
			wx.navigateBack({
				delta: 1
			})
		}
  },
  //跳转
  goUrl: function(e) {
    let {
      url,
      method
    } = util.getData(e);
    util.goUrl(url, method)
  },
  formSubmit: function(e) {

    let formId = e.detail.formId;
    getApp().collectFormId(formId);
    let {
      url
    } = e.detail.target.dataset
    util.goUrl(url)
  },
  previewImage: function(e) {
    let {
      src
    } = util.getData(e);
    wx.previewImage({
      current: src,
			urls: [src],
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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
  //表单验证
  validate: function(param) {
    let {
      person_avatar,
      name,
      tel,
      wechat_number,
      company_name,
      position
    } = param
    let validate = new util.Validate();
    validate.add(person_avatar, "isNoEmpty", "请上传形象照");
    validate.add(name, "isNoEmpty", "请填写正确的姓名");
    validate.add(tel, "isMobile", "请填写正确的手机号码");
    validate.add(company_name, "isNoEmpty", "请填写公司名称");
    validate.add(position, "isNoEmpty", "请填写职务");

    let message = validate.start();
    return message;
  },
  async save() {
    let {
      id,
      person_avatar,
      name,
      tel,
      wechat_number,
      company_name,
      position,
			address
    } = this.data.form;

    let param = {
      id,
      person_avatar,
      name,
      tel,
      wechat_number,
      company_name,
      position,
			address
    }
    let msg = this.validate(param)
    if (msg) {
      util.showModal(msg)
      return;
    }
    console.log(param)
    await cardModel.addOut(param)
    if (id > 0) {
      util.showSuccess("编辑成功")
    } else {
      util.showSuccess("放入名片夹成功")

    }

    setTimeout(function() {
      wx.navigateBack({
        delta: 1
      })
    }, 1500)

  },
	onShareAppMessage() {
		let { id, own_uid } = this.data.form;
		return {
			title: "【有人@你】邀你认领名片",
			path: `/pages/card/camera/detail?scene=${id}:${own_uid}`,
			imageUrl: ''
		}
	}
})