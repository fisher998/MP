import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
	partnerModel
} from '../../../apis/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
		withdrawal_count:'',
		money:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		util.showLoading();
    this.firstLoad();
  },
	async firstLoad(){
		let getUserInfo = getApp().getUserInfo()
		let getConfigInfo = getApp().getConfigInfo();
		let getDetail = partnerModel.getDetail()
		let { withdrawal_type } = await getConfigInfo;
		this.setData({
			withdrawal_type
		})
		let { card } = await getUserInfo;
		let { name, person_avatar_thumb } = card||{};
		
		let { balance, withdrawal_limit } = await getDetail;
		util.hideAll();
		this.setData({
			balance,
			withdrawal_limit,
			name,
			person_avatar_thumb
		})
	},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
		wx.showNavigationBarLoading()
		this.firstLoad();
  },
	handerMoneyChange(e){
		let val=util.getValue(e)
		this.setData({
			money:val
		})
	},
	handerAccountChange(e) {
		let account = util.getValue(e)
		this.setData({
			withdrawal_count: account
		})
	},
	withdrawAll:function(){
		let money = parseFloat(this.data.balance)
		this.setData({
			money
		})
	},
	async formSubmit(e) {
		let formId = e.detail.formId;
		let { money, withdrawal_limit, balance, withdrawal_type, withdrawal_count } = this.data;

		if (withdrawal_type == 0 && withdrawal_count==''){
			util.showModal("请输入微信号")
			return;
		}
		if (!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(money) || parseFloat(money) < 0.01) {
			util.showModal("请输入正确的金额")
			return;
		}
		if (money > balance){
			util.showModal("提现金额不能超过余额")
			return;
		}
		if (money < withdrawal_limit) {
			util.showModal("提现金额不能低于最低提现金额")
			return;
		}
		util.showLoading();
		await partnerModel.withdrawal({ money, withdrawal_count })
		if (withdrawal_type==0){
			util.showSuccess("申请提现成功")
		}else{
			util.showSuccess("提现成功")
		}
		
		this.onPullDownRefresh();
	},
})