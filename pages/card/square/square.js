import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  cardModel,
  infoModel
} from '../../../apis/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
      id: 1,
      title: "人脉集市",
      tabActiveIndex: 0,
      tabList: [{
        id: 1,
        title: "热门名片"
      }, {
        id: 2,
        title: "附近名片"
      }]
    }, {
      id: 2,
      title: "信息广场",
      tabActiveIndex: 0,
      tabList: [{
        id: 4,
        title: "推荐信息"
      }, {
        id: 2,
        title: "附近信息"
      }]
    }],
    tabActiveIndex: 0,
    list: {
      data: [],
      total: 0,
      per_page: 20,
      current_page: 1,
      last_page: 1
    },
    loading: true,
    refresh: false,
    param: {
      page: 1,
      keyword: '',
      longitude: 0,
      latitude: 0,
      order_type: 1
    },
    scrollTop: 0,
    info_switch:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    util.showLoading()
    this.firstLoad();
  },

  initStickyTop() {
    let that = this;
    const query = wx.createSelectorQuery()
    query.select('#sticky-tab').boundingClientRect()
    query.exec(function(res) {
      that.setData({
        stickyTop: res[0].top + 1
      })
    })
  },
  async goUrl(e) {
    let {
      url,
      must
    } = util.getData(e);
    let { card: cardInfo } = await getApp().getUserInfo();
    if (!cardInfo && must) {
      this.setData({
        showLogin: true
      })
      return;
    }

    util.goUrl(url)
  },
  formSubmit(e) {
    let formId = e.detail.formId;
    getApp().collectFormId(formId);
  },
  //首次渲染
  async firstLoad() {
    let that = this;
    let {
      refresh
    } = this.data;
    let {
      category,
      ad,
      info_switch
    } = await getApp().getConfigInfo(refresh)

    this.setData({
      adList: ad['card'],
      cardCategoryList: category['card'],
      infoCategoryList: category['info'],
      info_switch // 附近两组tab选项卡的 标识
    })
    console.log("==============ad['card']==============")
    console.log(ad['card'])
    util.hideAll()
    
    this.getList();
    this.initStickyTop();
  },
  //tab切换
  tabChange(e) {
    let that = this;
    
    let index = e.detail.index;
    let {
      tabList
    } = this.data;

    // 切换tab后改变活动tab索引,以及初始化页面page
    that.setData({
      tabActiveIndex: index,
      loading: true,
      'list.data': [],
      'param.page': 1,
      'param.order_type': tabList[index].tabList[tabList[index].tabActiveIndex].id
    })
    that.getList();

  },
  tab2Change() {
    let that=this;
    let {
      scrollTop,
      stickyTop
    } = that.data;
    if (scrollTop > stickyTop) {
      wx.pageScrollTo({
        scrollTop: that.data.stickyTop,
        duration: 0,
      })
    }
    let index = this.data.tabList[this.data.tabActiveIndex].tabActiveIndex+1;
    index = index > this.data.tabList[this.data.tabActiveIndex].tabList.length-1?0:index;
    let key = `tabList[${this.data.tabActiveIndex}].tabActiveIndex`;
    this.setData({
      [key]:index,
      loading: true,
      'list.data': [],
      'param.page': 1,
      'param.order_type': this.data.tabList[this.data.tabActiveIndex].tabList[index].id
    })
    this.getList();
  },
  //获取列表
  async getList() {
    let that = this;
    let {
      refresh,
      param,
      list,
      tabActiveIndex
    } = this.data;
    if (param.order_type==2){
      let location = {
        longitude: 0,
        latitude: 0
      };
      try {
        location = await getApp().getLocationInfo(refresh)
      } catch (e) {
        console.log(e)
        that.setData({
          settingShow: e.errMsg.includes('auth')
        })
      }
      param.longitude = location.longitude;
      param.latitude = location.latitude
    }
    
    
    let method = tabActiveIndex == 0 ? cardModel.getList(param) : infoModel.getList(param)
    let newlist = await method;

    let oldlist = list;
    //如果刷新,则不加载老数据
    if (!refresh) {
      newlist.data = [...oldlist.data, ...newlist.data];
    }
    that.setData({
      list: newlist,
      loading: false,
      refresh: false,
    })
  },
  //刷新
  onPullDownRefresh: function() {
    let that = this;
    that.setData({
      refresh: true,
      'param.page': 1
    })
    wx.showNavigationBarLoading()
    that.firstLoad();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    let {
      loading,
      list
    } = this.data;
    let {
      current_page,
      last_page
    } = list;
    if (current_page == last_page || loading) return;
    that.setData({
      'param.page': current_page + 1,
      loading: true
    })
    that.getList();
  },
  //滚动
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  previewImage: function(e) {
    console.log(e)
    let {
      src,
      index
    } = util.getData(e);
    let imageList = this.data.list.data[index].imgs;
    let imgArr = [];
    for (let i in imageList) {
      imgArr.push(imageList[i].path)
    }
    wx.previewImage({
      current: src,
      urls: imgArr
    })
  },
  async like(e) {
    let {
      index
    } = util.getData(e)
    let {
      id,
      like,
      is_like
    } = this.data.list.data[index];
    if (is_like) {
      util.showFail("你已点过赞了")
      return;
    }
    let key1 = `list.data[${index}].like`;
    let key2 = `list.data[${index}].is_like`
    util.showLoading();
    await infoModel.like({
      id
    })
    this.setData({
      [key1]: like + 1,
      [key2]: true
    })
    util.hideAll();
    util.showSuccess("点赞成功")
  },
  loginSuccess() {
    getApp().getUserInfo(true);
  }
})