import util from '../../../utils/index.js';

Page({
  data: {
    name: '校长'
  },
  onLoad: function(options) {
    util.showLoading()
		this.firstLoad();
  },
  async firstLoad(){
		let that = this;
		let { refresh }=that.data;
		// let tabList =await vipModel.getList();
		let {card:userInfo} = await getApp().getUserInfo(refresh);
    let { tech_support, vip_desc_imgs } = await getApp().getConfigInfo(refresh);
		
		that.setData({
			tabList,
			userInfo,
			tech_support,
      vip_desc_imgs,
			refresh: false
		})
		util.hideAll();
	},
})