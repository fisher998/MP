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
    color: "#21bf34",
    tabList: [{
      id: 1,
      title: "时间",
      modelMethod: "getTimeList",
      param: {
        page: 1
      },
      list: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1,
        data: []
      }
    }, {
      id: 2,
      title: "行为",
      segmentIndex: 0,
      modelMethod: "getActiveList",
      param: {
        page: 1
      },
      list: {
        total: 0,
        per_page: 20,
        current_page: 0,
        last_page: 1,
        data: []
      }
    }, {
      id: 3,
      title: "人",
      segmentIndex: 0,
      modelMethod: "getPersonList",
      param: {
        page: 1
      },
      list: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 0,
        data: []
      }
    }],
    segmentList: [{
      id: 0,
      title: "汇总"
    }, {
      id: 1,
      title: "昨日"
    }, {
      id: 2,
      title: "近七天"
    }, {
      id: 3,
      title: "近三十天"
    }],

    tabActiveIndex: 0,
    loading: true,
    refresh: false

  },
  async onLoad() {
    let that=this;
    let [configInfo, list] = await Promise.all([getApp().getConfigInfo()], that.getList())
    let pageConfig = util.getPageConfig(configInfo,["radar"]);
    this.setData({
      pageConfig,
      tabBar: getApp().globalData.radarTabBar,
    })
    that.subscribe();
  },
  onUnload() {
    getApp().websocket.unSubscribe("getAllUnRead");
  },
  async subscribe() {
    getApp().websocket.subscribe("getAllUnRead", this.onAllUnReadChange)
    
    // await getApp().websocket.login()
    getApp().websocket.login()
    
    getApp().websocket.sendMessage({
      type: "getAllUnRead"
    })

  },
  onAllUnReadChange(data) {
    this.setData({
      'tabBar.list[1].num': data.count
    })
  },
	goUrl:function(e){
		let {url,method}=util.getData(e)
		util.goUrl(url,method)
	},
  tabChange: function(e) {
    let index = e.detail.index;
    let {
      tabList
    } = this.data;
    let length = tabList[index].list.data.length;
    if (length <= 0) {
      this.setData({
        tabActiveIndex: index,
        loading: true
      })
      this.getList();
    } else {
      this.setData({
        tabActiveIndex: index
      })
    }
  },
  segmentChange: function(e) {
    let index = e.detail.index;
    let {
      tabActiveIndex
    } = this.data;
    let key = `tabList[${tabActiveIndex}].segmentIndex`
		let key1 = `tabList[${tabActiveIndex}].list.data`
		if (tabActiveIndex==2){
			this.setData({
				[key]: index,
				[key1]:[],
				loading:true
			})
		}else{
			this.setData({
				[key]: index,
				refresh: true,
			})
			wx.showNavigationBarLoading()
		}
		
		this.getList();
  },
  
  //获取列表
  async getList() {

    let that = this;
    let {
      refresh,
      tabList,
      segmentList,
      tabActiveIndex
    } = this.data;
    let oldlist = tabList[tabActiveIndex].list;
		let param = tabList[tabActiveIndex].param;
		if(tabActiveIndex!=0){
			param.day = segmentList[tabList[tabActiveIndex].segmentIndex].id
		}
		let newlist = await radarModel[tabList[tabActiveIndex].modelMethod](param);
    util.hideAll()
    //如果刷新,则不加载老数据
    if (!refresh) {
      newlist.data = [...oldlist.data, ...newlist.data];
    }

    let key = `tabList[${tabActiveIndex}].list`
    that.setData({
      [key]: newlist,
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
    }, function() {
      wx.showNavigationBarLoading()
      that.getList();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    let {
      loading,
			tabList,
			tabActiveIndex
    } = this.data;
    let {
      current_page,
      last_page
		} = tabList[tabActiveIndex].list;
    if (current_page != last_page && !loading) {
			let key = `tabList[${tabActiveIndex}].param.page`
      that.setData({
				[key]: current_page + 1,
        loading: true
      }, function() {
        that.getList();
      })
    }
  }
})