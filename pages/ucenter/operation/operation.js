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
		let {id} = options;
		console.log('-----------------------id-----------------------')
		console.log(id)
		this.setData({
			id
		});
    util.showLoading()
		this.firstLoad();
  },
  async firstLoad(){
		let that = this;
		let { refresh }=that.data;
		// let tabList =await vipModel.getList();
		let {card: userInfo} = await getApp().getUserInfo(refresh);
    let { tech_support, vip_desc_imgs } = await getApp().getConfigInfo(refresh);
		let activeInfo = await vipModel.getActiveInfo({id: this.data.id});
		console.log('---------------------info---------------------')
		console.log(activeInfo)
		/*
			create_time: "2019-06-10 12:35:30"
			days: "12"
			desc: "1、本活动有效日截止到2019年6月31日↵2、所体验会员与同等级会员具有同等权益↵3、本次活动人群为新注册的人群↵4、本活动最终解释权归本公司所有"
			end_time: "2019-06-29"
			id: 1
			member_amount: "1"
			name: "2"
			operate_num: 1
			path: "4701"
			start_time: "2019-06-11"
			status: "1"
			title: "新手运营活动"
			type: "1"
			uid: 0
			uniacid: 999
			update_time: "2019-06-10 14:58:16"
		*/
		that.setData({
			// tabList,
			activeInfo,
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
				mask: true,
				duration: 2000,
				success: function () {
					setTimeout(() => {
						// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
						wx.switchTab({
							url: '/pages/ucenter/index/index',
						})
					}, 2000);
				}
			})
		}
	}
})