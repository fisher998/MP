import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  cardModel,
  fileModel,
  radarModel
} from '../../../apis/index.js';

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
      email: "",
      mini_address: "",
      address: '',
      latitude: '',
      longitude: '',
      position: '',
      company_logo: '',
      company_name: '',
      company_category: '',
      company_desc: '',
      company_imgs: [],
      introduce: '',
      person_imgs: [],
      voice_path: '',
      voice_long: '',
      link_url:'',
      link_img:[],
      is_private:'',
      is_private_tel:''
    },
    active:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    //初始化信息
    let { active=2 } = options;
    this.setData({
      active
    })
    wx.setNavigationBarTitle({
      title: ["名片资料", "个人介绍", "公司介绍"][active]
    })
    let that = this;
    util.showLoading();
    let getUserInfo = getApp().getUserInfo()
    let getConfigInfo = getApp().getConfigInfo()
    
    let {
      card: userInfo
    } = await getUserInfo;
    let {
      category,
      baidu_ak,
      link_switch
    } = await getConfigInfo;
    let {
      group_id
    } = options
    that.setData({
      company_categoryList: category['card'],
      group_id: group_id || 0,
      link_switch,
      form: util.deepCopy(userInfo) || that.data.form
    })
    util.hideAll();
 
  },
  onHide(){
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
  handerImageChange(key, d) {
    let {
      src,
      src_thumb
    } = d;
    let key1=`form.${key}`;
    let key2 = `form.${key}_thumb`;
    this.setData({
      [key1]:src,
      [key2]: src_thumb
    })
  },
  //分类值变化
  handerCategoryChange: function(key, value) {
    let key1 = `form.${key}`;
    this.setData({
      [key1]: value,
    })
  },
  handerSwitchChange(e){
    let value=e.detail.value;
    value = value?0:1;
    let {key}=util.getData(e)
    let key1 = `form.${key}`;
    this.setData({
      [key1]: value,
    })
  },
  //选择图片
  async cropperImage(e) {
    let {
      key
    } = util.getData(e);
    let res = await wx.pro.chooseImage({
      count: 1,
      sizeType: "original",
    })
    let {
      tempFilePaths
    } = res;
    wx.navigateTo({
      url: `/pages/common/cropper/cropper?key=${key}&&src=${tempFilePaths[0]}`
    })
  },
  //选择图片
  chooseImage: function (e) {
    let that = this;
    let {
      key,
      size
    } = util.getData(e);
    let imageList = that.data.form[key] || [];

    wx.chooseImage({
      count: size - imageList.length,
      success: function (res) {
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
      iv,
      uid:wx.getStorageSync('userInfo').uid
    });
    if (!tel) return;
    this.setData({
      'form.tel': tel
    })
  },
  //表单验证
  validate: function(param) {
    let {
      person_avatar,
      name,
      tel,
      wechat_number,
      email,
      company_logo,
      company_name,
      company_category,
      position,
      mini_address
    } = param
    let validate = new util.Validate();
    validate.add(company_logo, "isNoEmpty", "请上传头像");
    validate.add(name, "isNoEmpty", "请填写姓名");
    let message = validate.start();
    return message;
  },
  formSubmit(e) {
    let formId = e.detail.formId;
    getApp().collectFormId(formId);
  },
  //提交表单
  async submit() {
    let {
      person_avatar,
      name,
      tel,
      wechat_number,
      email,
      mini_address,
      address,
      latitude,
      longitude,
      introduce,
      person_imgs,
      company_logo,
      company_name,
      company_category,
      position,
      company_desc,
      company_imgs,
      voice_path,
      voice_long,
      link_url,
      link_img,
      is_private,
      is_private_tel
    } = this.data.form;

    company_category = company_category ? company_category.id : ''
    company_imgs = util.getIds(company_imgs)
    person_imgs = util.getIds(person_imgs)
    link_img = util.getIds(link_img)
    let group_id = this.data.group_id
    let param = {
      person_avatar,
      name,
      tel,
      wechat_number,
      email,
      mini_address,
      address,
      latitude,
      longitude,
      introduce,
      person_imgs,
      company_logo,
      company_name,
      company_category,
      position,
      company_desc,
      company_imgs,
      voice_path,
      voice_long,
      group_id,
      link_url,
      link_img,
      is_private,
      is_private_tel
    }
    let msg = this.validate(param)
    if (msg) {
      util.showModal(msg)
      return;
    }
    util.showLoading()
    await cardModel.add(param);
    util.hideAll();
    util.showSuccess("保存成功")
    getApp().getUserInfo(true).then(()=>{
      wx.navigateBack({
        delta: 1,
      })
    })
    
  }

})