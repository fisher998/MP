import {
  req
} from '../utils/req.js';

export default {
  //获取列表
  getList(param) {
    return req.post("api/mingpian_goods/getListByParams", param)
  },
  //详情
  getDetail(param) {
    return req.post("api/mingpian_goods/goodsInfo", param)
  },
  //编辑
  update(param) {
    return req.post("api/mingpian_goods/updateGoods", param)
  },
  //删除
  del(param) {
    return req.post("api/mingpian_goods/deleteGoods", param)
  }
}