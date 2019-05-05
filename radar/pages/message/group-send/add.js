import util from '../../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  radarModel
} from '../../../../apis/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      id: 1,
      name: "严鑫1",
      isStar: true,
      tagName: "标签1"
    }, {
      id: 2,
      name: "严鑫2",
      isStar: false,
      tagName: "标签2"
    }, {
      id: 3,
      name: "严鑫3",
      isStar: true,
      tagName: "标签3"
    }, {
      id: 4,
      name: "严鑫4",
      isStar: false,
      tagName: "标签1"
    }],
    isCheckAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
		
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
      index,
      checked
    } = util.getData(e);
    let key = `list[${index}].checked`;
    this.setData({
      [key]: !checked
    })
    this.handerCheckAllStatusChange();
  },
  //全选状态变化
  handerCheckAllStatusChange() {
    let {
      list
    } = this.data;
    let isCheckAll = list.every((item) => {
      return item.checked == true
    })
    this.setData({
      isCheckAll
    })
  },
  //根据全选操作执行全选或者全不选
  handerCheckAllChange() {
    let {
      list,
      isCheckAll
    } = this.data;
    list = list.map((item) => {
      item.checked = !isCheckAll
      return item
    })
    this.setData({
      list
    })
    this.handerCheckAllStatusChange();
  },

})