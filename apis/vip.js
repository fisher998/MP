import { req } from '../utils/req.js';

export default {
	//获取会员套餐列表
	getList(param) {
		return req.post("api/mingpian_vip/vipDataList", param)
	},
	//加入vip
	join(param) {
		return req.post("api/mingpian_vip/joinVip", param)
	},
	// 兑换码加入vip
	joinByCDK(param) {
		return req.post("api/mingpian_redeem/validation", param)
	},
	//获取轮播图图片列表
	getImagesList(param) {
		return req.post("api/mingpian_operate/getlist", param)
	},
	//获取运营活动详情
	getActiveInfo(param) {
		return req.post("api/mingpian_operate/info", param)
	}
}