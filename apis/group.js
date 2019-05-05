import { req,fly } from '../utils/req.js';

export default {
	//添加编辑名片
	add(param) {
		return req.post("api/mingpian_group/updateGroup", param)
	},
	//我加入的群列表
	getList(param) {
		return req.post("api/mingpian_group/myGroupList", param)
	},
	//群详情
	getDetail(param) {
		return req.post("api/mingpian_group/groupInfo", param)
	},
	//加入群
	join(param) {
		return req.post("api/mingpian_group/joinGroup", param)
	},
	//解散群
	dismiss(param) {
		return req.post("api/mingpian_group/dismissGroup", param)
	},
	//解散群
	exit(param) {
		return req.post("api/mingpian_group/exitGroup", param)
	},
	//踢出群
	kickout(param) {
		return req.post("api/mingpian_group/kickoutGroup", param)
	}


}