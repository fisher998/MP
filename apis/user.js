import { req } from '../utils/req.js';

export default {
	//获取所有配置信息
	getConfig(param) {
		return req.post("api/mingpian_config/getConfig", param)
	},
	//获取用户信息
	getUserInfo(param) {
		return req.post("api/mingpian_user/userInfo2", param)
	},
  //更新用户信息
  updateUserInfo(param) {
    return req.post("api/mingpian_user/updateUserInfo", param)
  },
	//阿里云图片转化为本地的
	getImage(param) {
		return req.post("api/base_api/getImage", param)
	},
	//申请企业版
	applyCompany(param) {
		return req.post("api/mingpian_user/applyCompany", param)
	}
}