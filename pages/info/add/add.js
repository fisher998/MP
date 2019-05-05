import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  infoModel,
  fileModel
} from '../../../apis/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      content: '',
      imgs: [],
      category: '',
      mini_address: '',
      address: '',
      longitude: 0,
      latitude: 0,
      term_id: 0
    },
    pay_switch:true,
    money:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    //初始化信息
    util.showLoading();
    
		let that=this;
    let [userInfo, configInfo] = await Promise.all([getApp().getUserInfo(),getApp().getConfigInfo()])
    
    let info_top = userInfo.card.info_top;

    let {
      category,
      rule,
      baidu_ak,
      pay_switch
    } = configInfo;

    let categoryList = category['info'];
    let ruleList = rule['info_top'];
    this.setData({
      categoryList,
      ruleList,
      pay_switch,
      info_top
    })
    util.hideAll();

    //自动获取地址
    await util.getBmapLocation(baidu_ak).then((d) => {
      let {
        name,
        address,
        latitude,
        longitude
      } = d;
			that.setData({
        'form.mini_address': name,
        'form.address': address,
        'form.latitude': latitude,
        'form.longitude': longitude,
      })
    }).catch((e) => {
			that.setData({
        settingShow: e.errMsg.includes('auth')
      })
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
  //图片值变化
  handerImageChange: function(key, d) {
    console.log(d)
    let {
      src,
      src_thumb
    } = d;
    this.setFormValue(key, src)
    this.setFormValue(`${key}_thumb`, src_thumb)
  },
  //分类值变化
  handerCategoryChange: function(key, value) {
    this.setFormValue(key, value)
  },
  //选择图片
  async chooseImage(e) {
    let that = this;
    let {
      key,
      size
    } = util.getData(e);
    let imageList = that.data.form[key] || [];
    let {
      tempFiles
    } = await wx.pro.chooseImage({
      count: size - imageList.length
    })
    // 格式化图片参数
    for (let i = 0; i < tempFiles.length; i++) {
      util.showLoading('上传中')
      fileModel.upload({
        filePath: tempFiles[i].path
      }).then((d) => { 
        imageList.push({
          id: d.id,
          path: d.src,
          path_thumb: d.src_thumb
        });
        that.setFormValue(key, imageList)
        util.hideAll()
      })
    }
  },
  delImage: function(e) {
    let {
      index,
      key
    } = util.getData(e);
    let {
      form
    } = this.data;
    let imageList = form[key];
    imageList.splice(index, 1);
    key = `form.${key}`;
    this.setData({
      [key]: imageList
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
        'form.mini_address': name,
        'form.address': address,
        'form.latitude': latitude,
        'form.longitude': longitude
      })
    }).catch((e)=>{
			that.setData({
				settingShow: e.errMsg.includes('auth')
			})
		})

  },
  handerRuleChange: function(e) {
    let {
      id,
      money
    } = util.getData(e);
    let term_id = this.data.form.term_id;
    let info_top = this.data.info_top;
    if (id == term_id) {
      this.setData({
        money:0,
        'form.term_id': 0
      })
    } else {
      money = (info_top * 0.1 * money).toFixed(2)
      this.setData({
        money: money,
        'form.term_id': id
      })
    }
  },
  //表单验证
  validate: function(param) {
    let {
      content,
      category,
      mini_address,
    } = param
    let validate = new util.Validate();
    validate.add(content, "isNoEmpty", "请输入发布内容");
    validate.add(category, "isNoEmpty", "请选择行业");
    validate.add(mini_address, "isNoEmpty", "请选择地址");


    let message = validate.start();
    return message;
  },
  //提交表单
  async submit() {
    let {
      content,
      imgs,
      category,
      mini_address,
      address,
      longitude,
      latitude,
      term_id,
    } = this.data.form;

    category = category ? category.id : ''
    imgs = util.getIds(imgs)
    let param = {
      content,
      imgs,
      category,
      mini_address,
      address,
      longitude,
      latitude,
      term_id,
    }
    let msg = this.validate(param)
    if (msg) {
      util.showModal(msg)
      return;
    }
    util.showLoading()
    let {
      order_info,
      category: categoryInfo
    } = await infoModel.add(param)
    util.hideAll();
    if (order_info) {
      let status = await util.pay(order_info)
      if (!status) return;
    }
    util.showSuccess('发布成功')
    setTimeout(function() {
      wx.redirectTo({
        url: `/pages/info/filter/filter?id=${categoryInfo.id}&title=${categoryInfo.title}`
      })
    }, 1500)
  }

})