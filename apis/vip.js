import { req } from '../utils/req.js';

export default {
	//获取会员套餐列表
	getList(param) {
		return req.post("api/mingpian_vip/vipDataList", param)
	},
	//加入vip
	join(param) {
		return req.post("api/mingpian_vip/joinVip", param)
	}

}