import {
  userModel,
  cardModel
} from '../../apis/index.js';
import util from '../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
Component({
  /**
   * 组件的属性列表
   */
	properties: {
		show: {
			type: Boolean,
			value: false
		},
    must:{
      type:Boolean,
      value:false
    }
	},

  /**
   * 组件的初始数据
   */
	data: {
		
	},

  /**
   * 组件的方法列表
   */
	methods: {
		async getUserInfo(e) {
			let that = this;
			let userInfo = e.detail.userInfo;
      that.setData({
        show:false
      })
      if (!userInfo) return;
      let { avatarUrl, nickName, gender, province, city} = userInfo;
      util.showLoading("创建中");
      let introduce = `来自${province}${city}的${gender==2?"美女":"帅哥"}`;
      
      let addCard =cardModel.add({ person_avatar: avatarUrl, name: nickName, company_logo: avatarUrl, introduce })
      let updateUserInfo=userModel.updateUserInfo({ nickName, avatarUrl, gender })
      await addCard
      await updateUserInfo
      util.hideAll();
      that.triggerEvent('success', userInfo)
		},
    formSubmit: function (e) {
      let formId = e.detail.formId;
      getApp().collectFormId(formId)
    },
    async initAddress(){
      let that = this;
      let {
        baidu_ak
      } = await getApp().getConfigInfo();
      //自动获取地址
      await util.getBmapLocation(baidu_ak).then((d) => {
        that.setData({
          location: d
        })
      }).catch(() => {
        that.setData({
          location: { name: "", address: "", latitude: 0, longitude: 0 }
        })
      })
    }
	},
	async ready() {
    // if (this.properties.show){
    //   this.initAddress()
    // }
    
	}
})
