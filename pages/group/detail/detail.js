import {
  groupModel,
  cardModel
} from '../../../apis/index.js';
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
      is_collect: 0,
      group_id: '',
      address: {
        title: "全部区域",
        id: 0
      },
      order_type: {
        title: "最新",
        id: 0
      },
      company_category: {
        title: "全部行业",
        id: 0
      }
    },
    popup: {
      area: areaData,
      industry: [],
      order: [{
        title: "最新",
        id: ''
      }, {
        title: "热门",
        id: 1
      }, {
        title: "最近",
        id: 2
      }]
    },
    popupKey: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let {
      id,scene
    } = options;
		if(scene){
			scene = decodeURIComponent(scene)
			console.log(scene)
			let group_id = scene.split(':')[0];
			let pid = scene.split(':')[1];
			wx.setStorageSync("pid", pid)
			this.setData({
				'param.group_id': group_id,
				group_id
			})
		}else{
			this.setData({
				'param.group_id': id
			})
		}
		
		util.showLoading();
    this.firstLoad();
    this.initData();
  },
  onReady: function () {
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('.sticky-in-relative-container').boundingClientRect()
    query.exec(function (res) {
      that.setData({
        top: res[0].height,
      })
    })
  },
  //首次渲染
  async firstLoad() {
    let that = this;
    let {refrensh}=this.data
    let {
			group_id
		} = this.data.param;
    let getConfigInfo = getApp().getConfigInfo(refrensh)
    let getUserInfo = getApp().getUserInfo(refrensh)
    let getDetail = groupModel.getDetail({
      id: group_id,
      page: 1
    });


    let detail = await getDetail
    let { category } = await getConfigInfo;
    let { card } = await getUserInfo;
    let {
      people_arr,
      name
    } = detail;
    wx.setNavigationBarTitle({
      title: name || "群详情",
    })
    let showLogin = util.isEmpty(card);
    let copyIndustry = util.deepCopy(category["card"])
    copyIndustry.unshift({
      title: "全部行业",
      id: 0,
      children: null
    })
    for (let i in copyIndustry) {
      let item = copyIndustry[i]
      if (util.typeOf(item._child) == "Array") {
        item.children = [{
          title: `全${item.title}`,
          id: item.id
        }, ...item._child]
        delete item._child
      }
    }

    that.setData({
      loading: false,
      detail,
      list: people_arr,
      group_id,
      'popup.industry': copyIndustry,
      showLogin
    })
    util.hideAll();
  },
  loginSuccess(){
    this.setData({
      showLogin: false
    })
    getApp().getUserInfo(true);
  },
	async join(){
    if (this.data.showLogin) {
      this.setData({
        showLogin:true
      })
      return;
    }
    console.log(11111)
		let that=this;
		let group_id = this.data.group_id;
		if (!group_id) return;
		let { code } = await groupModel.join({ group_id: group_id });
		if (code == 1) {
			let { confirm}=await wx.pro.showModal({
				title: '提示',
				content: '创建名片后加入该群组',
			})
			if (!confirm) return;
			util.goUrl(`/pages/card/add/add?group_id=${group_id}`)
		}
		if (code == 4) {
			util.showFail("加入失败")
		}
    if (code == 3) {
      util.showFail("已加入")
    }
		if (code == 2) {
			util.showSuccess("加入成功")
			that.onPullDownRefresh();
		}
	},
  async initData() {
    let that = this;
   

    let copyAreaData = util.deepCopy(areaData)
    copyAreaData.unshift({
      title: "全部区域",
      id: 0,
      children: null
    })
    for (let i in copyAreaData) {
      let item = copyAreaData[i]
      if (util.typeOf(item.children) == "Array") {
        item.children.unshift({
          title: `全${item.title}`,
          id: item.id
        })
      }
    }


    this.setData({
      'popup.area': copyAreaData,
      
    })
  },
  
  goUrl: function(e) {
    let {
      url,method
    } = util.getData(e)
		util.goUrl(url, method)
  },
	formSubmit: function (e) {
		let formId = e.detail.formId;
		getApp().collectFormId(formId);
	},
  //获取列表
  async getList() {

    let that = this;
    let {
      refresh,
      list,
      tabActiveIndex
    } = this.data;
    let param = util.deepCopy(this.data.param);
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
  onPullDownRefresh: function() {
    let that = this;
    that.setData({
      refresh: true,
      'param.page': 1
    }, function() {
      wx.showNavigationBarLoading()
      that.firstLoad();
    })
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
    if (current_page != last_page && !loading) {
      that.setData({
        'param.page': current_page + 1,
        loading: true
      }, function() {
        that.getList();
      })
    }
  },
  handerPopupChange: function(e) {
    let {
      key
    } = util.getData(e);
    let {
      popupKey
    } = this.data;
    if (popupKey == key) {
      this.setData({
        popupKey: ''
      })
    } else {
      this.setData({
        popupKey: key
      })
			wx.pageScrollTo({
				scrollTop: 0
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
  selectArea: function(e) {
    let value = e.detail;
    this.setData({
      popupKey: '',
      'param.address': value[value.length - 1],
      loading: true,
      'param.page': 1,
      list: {
        data: []
      },
    })
    this.getList();
		
  },
  selectIndustry: function(e) {
    let value = e.detail;
    this.setData({
      popupKey: '',
      'param.company_category': value[value.length - 1],
      loading: true,
      'param.page': 1,
      list: {
        data: []
      },
    })
    this.getList();
	
  },
  selectOrder: function(e) {
    let {
      index
    } = util.getData(e);
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
  handerConfirm: function(e) {
    let that = this;
    let keyword = e.detail;
    this.search(keyword)
  },
  search: function(keyword) {
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
  preventD: function() {

  },
	onShareAppMessage:function(){
		let { name, logo, id, uid}=this.data.detail
		let path = `/pages/group/detail/detail?scene=${id}:${uid}`
		console.log(path)
		return {
			title: `【有人@你】邀请你加入(${name})名片群组`,
			path: path
		}
	},
	handerSwiperChange: function (e) {
		let {
			index
		} = util.getData(e);
		let key = `list.data[${index}].switch`;
		let val = e.detail;
		this.setData({
			[key]: val
		})
	},
	async kickout(e) {
		let that = this;
		let {
			id: card_id,
			index
		} = util.getData(e)
		let {id}=this.data.detail;
		let key = `list.data[${index}].switch`;
		let {
			confirm
		} = await wx.pro.showModal({
			title: "提示",
			content: "踢出后将不能看到Ta信息,确定踢出?"
		})
		if (!confirm) return;
		await groupModel.kickout({
			id,
			card_id
		})
		util.showSuccess("退出成功")
		that.setData({
			[key]: 'off'
		}, function () {
			that.onPullDownRefresh();
		})
	},
  async getUserInfo(e) {
    let that = this;
    let userInfo = e.detail.userInfo;
    if (!userInfo) return;
    let {
      avatarUrl,
      nickName,
    } = userInfo;
    wx.showLoading({
      title: '加载中...',
    })
    await cardModel.add({ person_avatar: avatarUrl, name: nickName, company_logo: avatarUrl })
    wx.hideLoading()
    that.join();
  },
})