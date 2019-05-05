import { req,fly } from '../utils/req.js';

export default {
	//添加帖子
	add(param) {
		return req.post("api/mingpian_info/updateInfo", param)
	},
	//帖子列表
	getList(param) {
		return req.post("api/mingpian_info/getList", param)
	},
	//帖子详情
	getDetail(param) {
		return req.post("api/mingpian_info/getInfo", param)
	},
	//帖子点赞
	like(param) {
		return req.post("api/mingpian_info/likeInfo", param)
	},
	//帖子删除
	del(param) {
		return req.post("api/mingpian_info/delInfo", param)
	}

}