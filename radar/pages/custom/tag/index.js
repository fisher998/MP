import util from '../../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  tagModel,
  customerModel
} from '../../../../apis/index.js';
Page({

	/**
	 * 页面的初始数据
	 */
  data: {
    op: 'list'
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad(options) {
    let { op, client_id } = options;

    if (op == 'add') {
      let selectList = util.deepCopy(util.getPage(-1).data.detail.labels);
      let selectObj = {};
      for (let i in selectList) {
        selectObj[selectList[i].id] = true
      }
      this.setData({
        op,
        client_id,
        selectList,
        selectObj
      })
    } else {
      this.setData({
        op
      })
    }
    util.showLoading();
    this.getDetail()
  },
  async getDetail() {
    let list = await tagModel.getList()
    this.setData({
      list
    })
    util.hideAll()
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.getDetail();
  },
  goUrl(e) {
    let {
      url
    } = util.getData(e);
    util.goUrl(url)
  },
  //按钮选择状态变化
  handerRadioChange(e) {
    let {
      id,
      index
    } = util.getData(e);
    let {
      selectList,
      selectObj,
      list
    } = this.data;
    if (selectObj[id]) {
      delete selectObj[id]
      selectList = selectList.filter((item) => {
        return item.id != id
      })
    } else {
      selectObj[id] = true,
        selectList.push(list[index])
    }
    this.setData({
      selectObj,
      selectList
    })
  },
  async submit() {
    let { client_id, card_id, selectList } = this.data;
    let label_ids = util.getIds(selectList)
    await customerModel.editTags({ client_id, card_id, label_ids })
    util.getPage(-1).setData({
      'detail.labels': selectList
    })
    wx.navigateBack({
      delta: 1,
    })
  }
})