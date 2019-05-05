import { req } from '../utils/req.js';

export default {
	//获取所有配置信息
	getInfo(param) {
		return req.post("api/mingpian_category/getListByType", param)
	}
}