import util from '../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  goodModel,
  fileModel 
} from '../../apis/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      id:0,
      title: '',
      price: '',
      desc:'',
      imgs: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    let {id} = options;
    if(!id)return;
    util.showLoading()
    let detail = await goodModel.getDetail({ id });
    detail.imgs=[...detail.cover,...detail.imgs]
    util.hideAll();
    this.setData({
      form:detail
    })
  },
  //输入值变化
  handerInputChange: function (e) {
    let {
      key
    } = util.getData(e);
    let value = util.getValue(e);
    this.setData({
      [key]:value
    })
  },
  //选择图片
  async chooseImage(e) {
    let that = this;
    let {
      key,
      size
    } = util.getData(e);
    let imageList = that.data.form[key] || [];

    let { tempFiles}=await wx.pro.chooseImage({
      count: size - imageList.length,
    })

    // 格式化图片参数
    util.showLoading('上传中')
    for (let i = 0; i < tempFiles.length; i++) {
      let d=await fileModel.upload({
        filePath: tempFiles[i].path
      })
      imageList.push({
        id: d.id,
        path: d.src,
        path_thumb: d.src_thumb
      });
    }
    util.hideAll()
    let key1=`form.${key}`;
    this.setData({
      [key1]: imageList
    })
  },
  delImage: function (e) {
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
  //表单验证
  validate: function (param) {
    let {
      title, price, desc, cover
    } = param
    let validate = new util.Validate();
    validate.add(title, "isNoEmpty", "未填写标题");
    validate.add(price, "isNoEmpty", "未填写价格");
    validate.add(cover, "isNoEmpty", "至少上传一张图片");
    let message = validate.start();
    return message;
  },
  async submit(){
    let { id,title, price, desc, imgs } = util.deepCopy(this.data.form);
    let cover = imgs.length>0?[imgs.shift()]:[];
    cover = util.getIds(cover);
    imgs=util.getIds(imgs);
    
    let param = { id, title, price, desc, imgs, cover};
    let msg = this.validate(param)
    if (msg) {
      util.showFail(msg)
      return;
    }

    await goodModel.update(param)
    util.showSuccess("保存成功")
    util.getPage(-1).onPullDownRefresh();
    getApp().getUserInfo(true);
    setTimeout(function(){
      wx.navigateBack({
        delta: 1
      })
    },1500)
  }
})