import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  cardModel,
  fileModel
} from '../../../apis/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      name:"",
      company_logo:'',
      company_logo_thumb:'',
      company_name:'',
      position:'',
      company_desc: '',
      company_imgs: [],
      introduce: '',
      person_imgs: [],
      link_url: '',
      link_img: [],
    },
    key: 'company_desc'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let {
      key,
      scene,
    } = options;
    scene = scene || 2
    let form = scene == 1 ? util.getPage(-1).data.userInfo : util.getPage(-1).data.form;
    let that = this;
    that.setData({
      form,
      key,
      scene
    })
    let titleObj={
      name:"编辑姓名",
      tel:"编辑电话",
      mini_address:"编辑地址",
      wechat_number:"编辑微信号",
      email:"编辑邮箱",
      introduce:"编辑个性签名",
      company_desc:"编辑公司介绍",
      shop:"编辑广告介绍"
    }
    wx.setNavigationBarTitle({
      title: titleObj[key],
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
  handerImageChange: function (key, d) {
    let {
      src,
      src_thumb
    } = d;
    let key1 = `form.${key}`;
    let key2 = `form.${key}_thumb`;
    this.setData({
      [key1]: src,
      [key2]: src_thumb
    })
  },
  //分类值变化
  handerCategoryChange: function(key, value) {
    this.setFormValue(key, value)
  },
  //选择图片裁剪
  cropperImage: function(e) {
    let {
      key
    } = util.getData(e);
    wx.chooseImage({
      count: 1,
      success: function(res) {
        let {
          tempFiles
        } = res;
        wx.navigateTo({
          url: `/pages/common/cropper/cropper?key=${key}&&src=${tempFiles[0].path}`
        })
      }
    })
  },
  //选择图片
  chooseImage: function(e) {
    let that = this;
    let {
      key,
      size
    } = util.getData(e);
    let imageList = that.data.form[key] || [];

    wx.chooseImage({
      count: size - imageList.length,
      success: function(res) {
        let {
          tempFiles
        } = res;
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

      }
    })
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
  //授权获取手机号码
  async getPhone(e) {
    let {
      encryptedData,
      iv
    } = e.detail;
    if (!encryptedData) return;
    let {
      tel
    } = await cardModel.getPhone({
      encryptedData,
      iv
    });
    if (!tel) return;
    this.setData({
      'form.tel': tel
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
    }).catch((e) => {
      that.setData({
        settingShow: e.errMsg.includes('auth')
      })
    })

  },
  //表单验证
  validate: function (param) {
    let {
      name
    } = param
    let validate = new util.Validate();
    validate.add(name, "isNoEmpty", "请填写姓名");
    let message = validate.start();
    return message;
  },
  submit: function() {
    let {
      name,
      tel,
      mini_address,
      address,
      latitude,
      longitude,
      wechat_number,
      email,
      company_logo,
      company_name,
      position,
      company_desc,
      company_imgs,
      introduce,
      person_imgs,
      link_url,
      link_img,
     
    } = this.data.form;
    company_imgs = util.getIds(company_imgs)
    person_imgs = util.getIds(person_imgs)
    link_img = util.getIds(link_img)
    let param = {
      name,
      tel,
      mini_address,
      address,
      latitude,
      longitude,
      wechat_number,
      email,
      company_logo,
      company_name,
      position,
      company_desc,
      company_imgs,
      introduce,
      person_imgs,
      link_url,
      link_img,
    }
    let key=this.data.key;
    let newPram={};
    if (key == 'company_desc'){
      newPram={
        company_logo,
        company_name,
        position,
        company_desc,
        company_imgs
      }
    }else if(key=='shop'){
      newPram = {
        link_url,
        link_img
      }
    } else if (key =='mini_address'){
      newPram = {
        mini_address,
        address,
        latitude,
        longitude
      }
    }
    else{
      newPram[key] = param[key]
      if(key=="name"){
        let msg = this.validate(newPram)
        if (msg) {
          util.showModal(msg)
          return;
        }
      }
    }
   
    util.showLoading();
    
    cardModel.add(newPram).then((d) => {
      util.hideAll();
      util.showSuccess("保存成功")

      getApp().getUserInfo(true).then(() => {
        let form = util.deepCopy(this.data.form);
        if(this.data.scene==2){
          util.getPage(-1).setData({
            form
          })
        }
        wx.navigateBack({
          delta: 1
        })
      })
    })

  }

})