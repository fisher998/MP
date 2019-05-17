import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  vipModel
} from '../../../apis/index.js'

Page({
  data: {
		refresh:false,
		keyword: '', 
  },
  onLoad: function(options) {
    util.showLoading()
		this.firstLoad();
  },
  async firstLoad(){
		let that = this;
		let { refresh }=that.data;
		// let tabList =await vipModel.getList();
		let {card: userInfo} = await getApp().getUserInfo(refresh);
    let { tech_support, vip_desc_imgs } = await getApp().getConfigInfo(refresh);
		
		that.setData({
			// tabList,
			userInfo,
			tech_support,
      vip_desc_imgs,
			refresh: false
		})
		util.hideAll();
	},
	setValue:function(e){
		let that = this;
		let value=e.detail.value;
		that.setData({
			keyword:value
		})
	},
	async sendCDK() {
		let {status} = await vipModel.joinByCDK({redeem_code: this.data.keyword})
		if (status == 1) { 
			wx.showToast({
				title: '兑换成功',
				icon: 'success',
				duration: 2000,
				success: function () {
					setTimeout(() => {
						wx.navigateTo({
							url: '/pages/ucenter/index/index',
						})
					}, 2000);
				}
			})
		}
	}
})