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
		console.log(userInfo)
		let isDisabled = this.dateformat(activeInfo.start_time, activeInfo.end_time)
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
			isDisabled,
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
	//时间处理函数
	dateformat:(start_time, end_time, type = 'yy-mm-dd') => {
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var min = date.getMinutes();
		var formatDate = '';
		switch (type) {
			case 'yy-mm-dd':
				formatDate = `${year}-${ month < 10 ? '0' + month : month }-${ day < 10 ? '0' + day : day }`;
				break;
			case 'yy-mm-dd-hh':
				formatDate = `${year}-${ month < 10 ? '0' + month : month }-${ day < 10 ? '0' + day : day }-${ hour < 10 ? '0' + hour : hour }`;
				break;
			case 'yy-mm-dd-hh-ff':
				formatDate = `${year}-${ month < 10 ? '0' + month : month }-${ day < 10 ? '0' + day : day } ${ hour < 10 ? '0' + hour : hour }:${ min < 10 ? '0' + min : min }`;
				break;
			default:
				break;
		}
		if (formatDate < start_time) {
			return 1;
		} else if (formatDate > end_time) {
			return 2;
		} else {
			return false;
		}
	},
	//运营活动开通会员
	async sendActive() {
		let that = this;
		util.showLoading()
		let { order_info} = await vipModel.joinByActive({id: this.data.activeInfo.id,username:this.data.userInfo.name,name: this.data.activeInfo.name});
		util.hideAll();
		if (order_info) {
			let status = await util.pay(order_info)
			if (!status) return;
		}
		wx.showToast({
			title: '支付成功',
			success: function() {
				setTimeout(() => {
					that.onPullDownRefresh();
					getApp().getUserInfo(true)
				}, 2000);
			}
    })
	},
	onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.firstLoad();
  },
})