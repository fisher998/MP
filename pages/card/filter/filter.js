import { cardModel } from '../../../apis/index.js';
import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import areaData from '../../../utils/area.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {
      data: []
    },
    loading: true,
    refrensh: false,
    param: {
      page: 1,
      keyword: '',
			longitude:0,
			latitude:0,
      is_collect: 0,
			address:{ title: "全部区域", id: 0} ,
			order_type: { title: "最新", id: 0 },
			company_category: { title: "全部行业", id: 0 }
    },
    popup:{
      area: areaData,
      industry: [],
      order: [{ title: "最新", id:'' },{ title: "热门", id: 1 }, { title:"最近",id:2}]
    },
    popupKey:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { id, title } = options;
    this.setData({
			'param.company_category': { title: `全${title}`, id:id||0}
    })
    wx.setNavigationBarTitle({
      title: title || "信息搜索"
    })
    this.firstLoad();
  },
  onReady(){
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('.sticky-top').boundingClientRect()
    query.exec(function (res) {
      that.setData({
        top: res[0].height,
      })
    })
  },
  //首次渲染
  async firstLoad() {
    let that = this;
    let { refresh}=this.data;
    let getConfigInfo = getApp().getConfigInfo(refresh);
    let getLocation = getApp().getLocationInfo(refresh)
    let { category } = await getConfigInfo;

    let { id, title } = that.data.param.company_category;
    let industry = category["card"].find((item) => {
      return item.id == id
    })._child || [];

    let copyAreaData = util.deepCopy(areaData)
    copyAreaData.unshift({ title: "全部区域", id: 0, children: null })
    for (let i in copyAreaData) {
      let item = copyAreaData[i]
      if (util.typeOf(item.children) == "Array") {
        item.children.unshift({ title: `全${item.title}`, id: item.id })
      }
    }
    let copyIndustry = util.deepCopy(industry)
    copyIndustry.unshift({ title: title, id, children: null })
    this.setData({
      'popup.area': copyAreaData,
      'popup.industry': copyIndustry
    }) 

    let location = { longitude: 0, latitude: 0 };
    try {
      location = await getLocation
    } catch (e) {
      that.setData({
        settingShow: e.errMsg.includes('auth')
      })
    }
    let { longitude, latitude } = location;
    this.setData({
      'param.longitude': longitude,
      'param.latitude': latitude
    })
		this.getList();
  },
  goUrl: function (e) {
		let { url } = util.getData(e)
		util.goUrl(url)
  },
  //获取列表
  async getList () {

    let that = this;
    let { refresh, list, tabActiveIndex } = this.data;
    let param=util.deepCopy(this.data.param);
		param.address = param.address.title.replace(/全部区域|全/g, "")
		param.order_type = param.order_type.id;
		param.company_category = param.company_category.id;

		let oldlist = list;
		let newlist = await cardModel.getList(param);
    util.hideAll();
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
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      refresh: true,
      'param.page': 1
    }, function () {
      wx.showNavigationBarLoading()
      that.firstLoad();
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let { loading, list } = this.data;
    let { current_page, last_page } = list;
    if (current_page != last_page && !loading) {
      that.setData({
        'param.page': current_page + 1,
        loading: true
      }, function () {
        that.getList();
      })
    }
  },
  handerPopupChange:function(e){
		
    let {key}=util.getData(e);
    let {popupKey}=this.data;
    if (popupKey==key){
      this.setData({
        popupKey:''
      })
    }else{
      this.setData({
        popupKey:key
      })
    }
  },
	handerPopupHide: function (e) {
		let { key } = util.getData(e);
		let { popupKey } = this.data;
		if (popupKey == key) {
			this.setData({
				popupKey: ''
			})
		}
	},
  selectArea:function(e){
    let value=e.detail;
    this.setData({
      popupKey: '',
      'param.address':value[value.length-1],
			loading: true,
			'param.page': 1,
			list: {
				data: []
			},
    })
		this.getList();
  },
  selectIndustry: function (e) {
		let { index } = util.getData(e);
		let value = this.data.popup['industry'][index]
    this.setData({
      popupKey: '',
			'param.company_category': value,
			loading: true,
			'param.page': 1,
			list: {
				data: []
			},
    })
		this.getList();
  },
  selectOrder:function(e){
    let {index}=util.getData(e);
    let value = this.data.popup['order'][index]
    this.setData({
      popupKey: '',
			'param.order_type': value,
			loading: true,
			'param.page': 1,
			list: {
				data: []
			},
    })
		this.getList();
  },
	handerConfirm: function (e) {
		let that = this;
		let keyword = e.detail;
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
	preventD:function(){
		
	}
})