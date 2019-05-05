import {
  req
} from '../utils/req.js';

export default {
  //获取列表
  getList(param) {
    return req.post("api/radar_label/getList", param)
  },
  //编辑
  edit(param) {
    return req.post("api/radar_label/updateLabel", param)
  },
  //删除
  del(param) {
    return req.post("api/radar_label/deleteLabel", param)
  }
}