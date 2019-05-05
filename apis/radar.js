import {
  req
} from '../utils/req.js';

export default {
	//获取配置
	getConfig(param) {
		return req.post("common/radar/getConfig", param)
	},
	//登录
	login(param) {
		return req.post("common/radar/login", param)
	},
	//更新用户
	updateUser(param) {
		return req.post("common/radar/updateUser", param)
	},
  //上报数据
  report(param) {
		param = Object.assign({}, param, { uid: wx.getStorageSync('userInfo').id})
    return req.post("common/radar/reportData", param)
  },
	//收集formid
	collectFormId(param){
		return req.post("common/radar/getFormId", param)
	},
  //雷达时间列表
  getTimeList(param) {
		return req.post("common/radar/timeStatis", param)
  },
  //获取雷达行为列表
  getActiveList(param) {
    return req.post("common/radar/eventStatis", param).then((d) => {
      let list = {
        total: 0,
        per_page: 20,
        current_page: 0,
        last_page: 1,
        data: d
      }
      return list
    })
  },
  //雷达人列表
  getPersonList(param) {
		return req.post("common/radar/peopleStatis", param)
  }
}