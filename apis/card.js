import { req,fly } from '../utils/req.js';

export default {
	//添加编辑名片
	add(param) {
		return req.post("api/mingpian_card/updateCard", param)
	},
	

	//添加编辑名片
	changePrivte(param) {
		return req.post("api/mingpian_card/updateCard", param)
	},
	//通讯录首页
	getCollectList(param) {
		return req.post("api/mingpian_card/myCollectList", param)
	},
	//操作名片
	operateCard(param) {
		return req.post("api/mingpian_card/cardOperate", param)
	},
	//他人名片首页
	getInfo(param) {
		return req.post("api/mingpian_card/getCardByUid", param)
	},
	//人脉集市首页
	getMarketInfo(param) {
		return req.post("api/mingpian_card/market", param)
	},
	//名片列表
	getList(param) {
		return req.post("api/mingpian_card/getList", param)
	},
	//名片统计列表
	getOperateList(param) {
		return req.post("api/mingpian_card/operateList", param)
	},
	//名片模板列表
	getTpList(param) {
		return req.post("api/mingpian_template/getList", param)
	},
	//购买名片模板
	buyTp(param) {
		return req.post("api/mingpian_template/buyTemplate", param)
	},
	//使用名片模板
	useTp(param) {
		return req.post("api/mingpian_template/useTemplate", param)
	},
	//添加外部纸质名片
	addOut(param) {
		return req.post("api/mingpian_card_outside/updateCardOutside", param)
	},
	//获取纸质名片详情
	getOutDetail(param) {
		return req.post("api/mingpian_card_outside/infoCard", param)
	},
	//认领纸质名片
	receiveOut(param) {
		return req.post("api/mingpian_card_outside/receiveCard", param)
	},
	//认领纸质名片
	delOut(param) {
		return req.post("api/mingpian_card_outside/delCollect", param)
	},
	//认领纸质名片
	getPhone(param) {
		return req.post("api/mingpian_card/getPhone", param)
	},
	//获取分享话术列表
	getVerbalList(param) {
		return req.post("api/mingpian_sharewords/dataList", param)
	},
	//提交自定义话术
	saveVerbalDetail(param) {
		return req.post("api/mingpian_sharewords/updateShare", param)
	},
	//获取所选分享话术
	getShareVerbal(param) {
		return req.post("api/mingpian_sharewords/info", param)
	}
}