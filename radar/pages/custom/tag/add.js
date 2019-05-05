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
    selectList: [],
    selectObj: {},
    showDel: false,
    param: {
      id: 0,
      name: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let {
      index
    } = options;
    let param;
    if (index < 0) {
      param = {
        id: 0,
        name: '',
      }
    } else {
      let detail = util.getPage(-1).data.list[index];
      let {
        id,
        name
      } = detail
      param = {
        id,
        name,
      }
      let info = await customerModel.getList({
        order_type: 4,
        label_id: id
      })
      let selectList = info.data;
      let selectObj = {};
      for (let i in selectList) {
        selectObj[selectList[i].id] = true
      }
      this.setData({
        selectList,
        selectObj,
      })
      wx.setNavigationBarTitle({
        title: '编辑标签'
      })
    }

    this.setData({
      param
    })
  },
  goUrl(e) {
    let {
      url
    } = util.getData(e);
    util.goUrl(url)
  },
  handerShowDel() {
    this.setData({
      showDel: true
    })
  },
  handerHideDel() {
    this.setData({
      showDel: false
    })
  },
  delClient(e) {
    let {
      index,
      id
    } = util.getData(e)
    console.log(id)
    let {
      selectList,
      selectObj
    } = this.data;
    selectList.splice(index, 1);
    delete selectObj[id]
    this.setData({
      selectList,
      selectObj
    })
  },
  async delTag() {
    let {
      card_id,
      id
    } = this.data.param;
    let param = {
      card_id,
      id
    }
    let {
      confirm
    } = await wx.pro.showModal({
      title: '提示',
      content: '请确认是否要删除此标签',
      confirmText: "确定",
    })
    if (!confirm) return;
    await tagModel.del(param)
    util.getPage(-1).onPullDownRefresh()
    wx.navigateBack({
      delta: 1,
    })

  },
  handerInputChange(e) {
    let val = util.getValue(e);
    this.setData({
      'param.name': val
    })
  },
  async submit() {
    let {
      param,
      selectList
    } = this.data;
    let ids = util.getIds(selectList);
    param.peoples = ids
    await tagModel.edit(param);
    util.getPage(-1).onPullDownRefresh();
    wx.navigateBack({
      delta: 1,
    })
  }
})