import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  cardModel,
} from '../../../apis/index.js';

Page({
  data: {
    radioItems: [
      {name: 'USA', value: '美国'},
      {name: 'CHN', value: '中国'},
      {name: 'BRA', value: '巴西'},
      {name: '自定义自定义自定义', value: '自定义自定义自定义'}
    ],
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
    let A = cardModel.getVerbalList()
    console.log('A')
    console.log(A)
    that.setData({
      company_categoryList: category['card'],
      group_id: group_id || 0,
      link_switch,
      form: util.deepCopy(userInfo) || that.data.form
    })
    util.hideAll();

  },
  radioChange: function(e) {
    var checked = e.detail.value
    console.log('------------checked------------')
    console.log(checked)
    var changed = {}
    for (var i = 0; i < this.data.radioItems.length; i ++) {
      if (checked.indexOf(this.data.radioItems[i].name) !== -1) {
        changed['radioItems['+i+'].checked'] = true
      } else {
        changed['radioItems['+i+'].checked'] = false
      }
    }
    this.setData(changed)
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
    key = `form.${key}`;
    this.setData({
      [key]: value
    })
    console.log('this.form.mine_verbal: ' + this.data.form.mine_verbal)
  },
})