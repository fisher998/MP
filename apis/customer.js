import {
  req
} from '../utils/req.js';

export default {
	//获取列表
	getList(param) {
    return req.post("api/radar_user/clientList", param)
	},
  //获取详情
  getDetail(param) {
    return req.post("api/radar_user/info", param)
  },
  //获取标签列表
  getLabelList(param) {
    return req.post("api/radar_label/getList", param)
  },
  //获取标签列表
  editLabel(param) {
    return req.post("api/radar_label/updateLabel", param)
  },
  //获取跟进记录列表
  getFollowList(param) {
    return req.post("api/radar_user/followList", param)
  },
  //获取浏览记录列表
  getTimeList(param) {
    return req.post("common/radar/timeStatis", param)
  },
  //编辑客户信息
  edit(param) {
    return req.post("api/radar_user/updateInfo", param)
  },
  //添加跟进
  addFollow(param) {
    return req.post("api/radar_user/addFollow", param)
  },
  //编辑客户标签
  editTags(param) {
    return req.post("api/radar_label/updateClientLabel", param)
  },
  //获取ai报表
  getAiReport(param) {
    return req.post("api/radar_user/aiReport", param)
  },
}