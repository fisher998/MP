import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import { cardModel,radarModel } from '../../../apis/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
		currentIndex:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.showLoading();
  },
	onShow:function(){
		wx.showNavigationBarLoading()
		this.firstLoad();
	},
  //首次加载
  async firstLoad(){
    let that=this;
		let getConfigInfo=getApp().getConfigInfo();
		let getCollectList = cardModel.getCollectList();
	
   
    let { ad, my_collect_list, recommend } = await getCollectList;
		util.hideAll()
		that.setData({
			ad,
			my_collect_list: my_collect_list||[],
			recommend,
		})
    let { shibie_type, radar, android_pay_switch, tab_name4 } = await getConfigInfo
    that.setData({
      shibie_type,
      radar
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.firstLoad();
  },
  async goUrl(e){
		let { url, must } = util.getData(e);
    let {card:cardInfo} = await getApp().getUserInfo()
    if (!cardInfo && must){
		  this.setData({
        showLogin:true
      })
			return;
		}
		util.goUrl(url)
  },
	formSubmit: function (e) {
		let formId = e.detail.formId;
		getApp().collectFormId(formId)
	},
  getUserInfo(e){
    console.log(e)
  },
	selectTouchStartHandler:function(e){
		
		let fingerY = e.touches[0].clientY;
		let offsetTop = e.currentTarget.offsetTop;
		let itemIndex = Math.floor((fingerY - offsetTop) / 16);
		let my_collect_list = this.data.my_collect_list;
		let currentIndex;

		if (itemIndex<=-1){
			itemIndex=0
		}
		if (itemIndex >= my_collect_list.length-1){
			itemIndex = my_collect_list.length - 1
		}
		this.setData({
			currentIndex: my_collect_list[itemIndex].zimu
		})
	},
	selectTouchMoveHandler:function(e){
		let fingerY = e.touches[0].clientY;
		let offsetTop = e.currentTarget.offsetTop;
		let itemIndex = Math.floor((fingerY - offsetTop) / 16);
		let my_collect_list = this.data.my_collect_list;
		let currentIndex;
		if (itemIndex <= -1) {
			itemIndex = 0
		}
		if (itemIndex >= my_collect_list.length - 1) {
			itemIndex = my_collect_list.length - 1
		}
		this.setData({
			currentIndex: my_collect_list[itemIndex].zimu
		})
	},
	selectTouchEndHandler:function(e){
		this.setData({
			currentIndex:''
		})
	},
	async collect(e) {

		let that = this;
		let { pindex, index, type:mType, mode, card_id } = util.getData(e);
		let res=await wx.pro.showModal({
			title: '提示',
			content: '确定取消收藏?'
		})
		if(!res.confirm) return

		await cardModel.operateCard({ type: mType, mode, card_id })
		util.showSuccess("取消成功")
		let key = `my_collect_list[${pindex}].data[${index}].switch`;
		that.setData({
			[key]:'off'
		},function(){
			that.onPullDownRefresh();
		})
	},
	async delOut(e){
		let that = this;
		let { pindex, index, id } = util.getData(e);
		let res = await wx.pro.showModal({
			title: '提示',
			content: '确定取消收藏?'
		})
		if (!res.confirm) return

		await cardModel.delOut({ id })
		util.showSuccess("取消成功")
		let key = `my_collect_list[${pindex}].data[${index}].switch`;
		that.setData({
			[key]: 'off'
		}, function () {
			that.onPullDownRefresh();
		})
	},
	handerSwiperChange:function(e){
		let { pindex, index } = util.getData(e);
		let key = `my_collect_list[${pindex}].data[${index}].switch`;
		let val=e.detail;
		this.setData({
			[key]:val
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
    that.onPullDownRefresh();
  },
  loginSuccess(){
    getApp().getUserInfo(true)
  }
})