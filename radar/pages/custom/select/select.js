import util from '../../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  customerModel,
  tagModel
} from '../../../../apis/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
      id: 0,
      title: "全部客户",
      label_id: 0,
    }, {
      id: 3,
      title: "星标客户",
      label_id: 0,
    }, {
      id: 4,
      title: "标签客户",
      label_id: 0,
    }],
    tabActiveIndex: 0,
    selectList: [],
    selectObj: {},
    list: {
      data: [],
      total: 0,
      per_page: 20,
      current_page: 1,
      last_page: 0
    },
    loading: true,
    refresh: false,
    focus: false,
    param: {
      page: 1,
      keyword: "",
      order_type: 0
    },
    tagList: [],
    tagActiveIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let {
      selectList,
      selectObj
    } = util.getPage(-1).data;

    let tagList = await tagModel.getList()
    this.setData({
      tagList,
      preSelectList: selectList,
      preSelectObj: selectObj,
      'param.label_id': tagList[0] ? tagList[0].id : 0
    })
    this.getList();
  },
  goUrl(e) {
    let {
      url
    } = util.getData(e);
    util.goUrl(url)
  },
  tabChange: function (e) {
    let index = e.detail.index;
    let {
      tabList,
      tagList
    } = this.data;
    this.setData({
      tabActiveIndex: index,
      loading: true,
      'list.data': [],
      'param.order_type': tabList[index].id,
    })
    this.getList();
  },
  handerTagIndexChange(e) {
    let {
      index
    } = util.getData(e);
    let {
      tagList
    } = this.data;
    this.setData({
      tagActiveIndex: index,
      loading: true,
      'list.data': [],
      'param.label_id': tagList[index].id,
      show: false
    })
    this.getList();
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
        selectList.push(list.data[index])
    }
    this.setData({
      selectObj,
      selectList
    })
  },
  //点击头像变化
  handerAvatarChange(e) {
    console.log(e)
    let {
      id,
      index
    } = util.getData(e);
    let {
      selectList,
      selectObj,
    } = this.data;
    delete selectObj[id]
    selectList = selectList.filter((item) => {
      return item.id != id
    })
    this.setData({
      selectObj,
      selectList
    })
  },
  submit() {
    let {
      selectList,
      preSelectList,
      selectObj,
      preSelectObj
    } = this.data;
    selectList = [...preSelectList, ...selectList]
    selectObj = {
      ...preSelectObj,
      ...selectObj
    }
    util.getPage(-1).setData({
      selectList,
      selectObj
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  handerFilterSelect(e) {
    let {
      key,
      val
    } = util.getData(e);
    key = `param.${key}`
    this.setData({
      [key]: val,
      loading: true,
      focus: false,
      "list.data": []
    })
    this.getList();
  },
  //获取列表
  async getList() {

    let that = this;
    let {
      refresh,
      param,
      list
    } = this.data;
    let newlist;
    try {
      newlist = await customerModel.getList(param)
    } catch (e) {
      newlist = that.data.list
    }
    let oldlist = list;
    //如果刷新,则不加载老数据
    if (!refresh) {
      newlist.data = [...oldlist.data, ...newlist.data];
    }
    util.hideAll();
    that.setData({
      list: newlist,
      loading: false,
      refresh: false,
    })

  },

  //刷新
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      refresh: true,
      'param.page': 1
    }, function () {
      wx.showNavigationBarLoading()
      that.getList();
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let {
      loading,
      list,
      tabActiveIndex
    } = this.data;
    let {
      current_page,
      last_page
    } = list;
    if (current_page != last_page && !loading) {
      that.setData({
        'param.page': current_page + 1,
        loading: true
      }, function () {
        that.getList();
      })
    }
  },
  handerConfirm: function (e) {
    let that = this;
    let keyword = e.detail.value;
    this.search(keyword)
  },
  search: function (keyword) {
    let that = this;
    that.setData({
      loading: true,
      focus: false,
      'param.keyword': keyword,
      'param.page': 1,
      list: {
        data: []
      },
    })
    that.getList()
  },
  showMask() {
    this.setData({
      show: true
    })
  },
  hideMask() {
    this.setData({
      show: false
    })
  }
})