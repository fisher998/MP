import { req,fly } from '../utils/req.js';

export default {
	//获取合伙人套餐列表
	getMealList(param) {
		return req.post("api/mingpian_partner_level/getLevel", param)
	},
	//加入合伙人
	join(param) {
		return req.post("api/mingpian_partner_level/joinPartner", param)
	},
	//合伙人详情
	getDetail(param) {
		return req.post("api/mingpian_partner_level/partnerData", param)
	},
	//下线列表
	getDownList(param) {
		return req.post("api/mingpian_partner_level/offLineList", param)
	},
	//收益列表
	getIncomeList(param) {
		return req.post("api/mingpian_partner_level/walletLog", param)
	},
	//提现
	withdrawal(param) {
		return req.post("api/mingpian_partner_level/withdrawal", param)
	}
  
}