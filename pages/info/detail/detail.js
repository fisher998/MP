import { infoModel, radarModel } from '../../../apis/index.js';
import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		let { id ,uid=""} = options;
    wx.setStorageSync('pid', uid)
		util.showLoading();
		let detail=await infoModel.getDetail({id})
		this.setData({
			detail
		})
    let { uid: other_uid}=detail;
    radarModel.report({
      event_name: "view_info",
      obj_uid: other_uid
    })
		util.hideAll()
	},
	goUrl(e){
		let {url,method}=util.getData(e);
		util.goUrl(url, method)
	},
	previewImage: function (e) {
		console.log(e)
		let {
			src,
			index
		} = util.getData(e);
		let imageList = this.data.detail.recommend.data[index].imgs;
		let imgArr = [];
		for (let i in imageList) {
			imgArr.push(imageList[i].path)
		}
		wx.previewImage({
			current: src,
			urls: imgArr,
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	},
	async like(e) {
    let { card } = await getApp().getUserInfo();
    if (!card) {
      this.setData({
        showLogin: true
      })
      return;
    } 
		let { index } = util.getData(e)
		let { id, like, is_like } = this.data.detail.recommend.data[index];
		if (is_like) {
			util.showFail("你已点过赞了")
			return;
		}
		let key1 = `detail.recommend.data[${index}].like`;
		let key2 = `detail.recommend.data[${index}].is_like`
		util.showLoading();
		await infoModel.like({ id })
		this.setData({
			[key1]: like + 1,
			[key2]: true
		})
		util.hideAll();
		util.showSuccess("点赞成功")
	},
	async dLike(e) {
    let { card } = await getApp().getUserInfo();
    if (!card) {
      this.setData({
        showLogin: true
      })
      return;
    } 
		let { id, like, is_like } = this.data.detail;
		if (is_like) {
			util.showFail("你已点过赞了")
			return;
		}
		let key1 = `detail.like`;
		let key2 = `detail.is_like`
		util.showLoading();
		await infoModel.like({ id })
		this.setData({
			[key1]: like + 1,
			[key2]: true
		})
		util.hideAll();
		util.showSuccess("点赞成功")
	},
	dPreviewImage: function (e) {
		let {
			src
		} = util.getData(e);
		let imageList = this.data.detail.imgs;
		let imgArr = [];
		for (let i in imageList) {
			imgArr.push(imageList[i].path)
		}
		wx.previewImage({
			current: src,
			urls: imgArr,
		})
	},
	openLocation:function(){
		let { latitude, longitude, address, mini_address:name}=this.data.detail
		wx.openLocation({
			latitude,
			longitude,
			name,
			address,
		})
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		let { id, content,uid}=this.data.detail;
    return{
			title: content,
			path:`pages/info/detail/detail?id=${id}&uid=${uid}`
		}
	},
  call(){
    let tel = this.data.detail.tel;
    if (!tel){
      util.showModal("暂无电话")
      return;
    }
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  loginSuccess(){
    getApp().getUserInfo(true)
  }
})