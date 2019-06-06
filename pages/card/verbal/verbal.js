import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  cardModel,
} from '../../../apis/index.js';

Page({
  data: {
    radioItems: '',
  },
  async onLoad(options) {
    //初始化信息
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
    let data = await cardModel.getVerbalList()
    let mark = false;
    data.forEach((ele, index) => {
      if (ele.type == 2) {
        mark = true;
      }
    })
    if (!mark) {
      data.push({
        id: '',
        title: "请输入您的自定义分享话术",
        type: 2,
        checked: false
      })
    }
    console.log('A')
    console.log(data)
    that.setData({
      radioItems: data,
      'form.mine_verbal': ''
    })
    util.hideAll();
  },
  radioChange: function(e) {
    var checked = e.detail.value
    console.log('------------checked------------')
    console.log(e.detail)
    var changed = {}
    for (var i = 0; i < this.data.radioItems.length; i ++) {
      if (this.data.radioItems[i].title !== '' && checked.indexOf(this.data.radioItems[i].title) !== -1) {
        changed['radioItems['+i+'].checked'] = true
      } else {
        changed['radioItems['+i+'].checked'] = false
      }
    }
    console.log(changed)

    this.setData(changed)
    console.log(this.data)
  },
  //输入值变化
  handerInputChange: function(e) {
    let {
      key
    } = util.getData(e);
    console.log('-------------key-------------')
    console.log(key)
    let value = util.getValue(e);
    this.setFormValue(key, value)
  },
  //设置表单值
  setFormValue: function(key, value) {
    console.log('-------------index-------------')
    let verbalArr = this.data.radioItems;
    verbalArr[key].title = value;
    this.setData({
      radioItems: verbalArr
    })
    console.log('this.form.mine_verbal: ')
    console.log(this.data.radioItems)
  },

  //表单验证
  // validate: function(param) {
  //   let {
  //     name,
  //     company_logo,
  //   } = param
  //   let validate = new util.Validate();
  //   validate.add(company_logo, "isNoEmpty", "请上传头像");
  //   validate.add(name, "isNoEmpty", "请填写姓名");
  //   let message = validate.start();
  //   return message;
  // },
  //提交表单
  async submit() {
    this.data.radioItems.forEach((ele, index) => {
      var param = {
        id: ele.id,
        title: ele.title,
        type: ele.type
      };
      if (ele.checked === true) {
        if (ele.title === '') {
          util.showModal('请输入话术')
          return;
        } else {
          if (ele.type === 2) {
            util.showLoading()
            cardModel.saveVerbalDetail(param);
            this.showSuccessToast()            
          } else {
            util.showLoading()
            cardModel.saveVerbalDetail(param);
            this.showSuccessToast()
          }
        }
      }
    })
  },
  //成功提示
  showSuccessToast: function() {
    util.hideAll();
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000,
      success: function() {
        setTimeout(() => {
          getApp().getUserInfo(true).then(()=>{
          wx.navigateBack({
            delta: 1,
          })
        })
        }, 1000);
      }
    })
  }
})