import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  partnerModel
} from '../../../apis/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.scene) {
      //通过分享进来的,则保存pid
      wx.setStorageSync('pid', options.scene)
    }
    let update = options.update || false;
    if (update) {
      wx.setNavigationBarTitle({
        title: '提升等级',
      })
    }
    this.setData({
      update
    })
    util.showLoading()
    this.firstLoad();
		
  },
  async firstLoad() {
    let list = await partnerModel.getMealList();
    util.hideAll();
    this.setData({
      list
    })
  },
  goUrl(e) {
    let {
      method,
      url
    } = util.getData(e)
    util.goUrl(url, method)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.setData({
      current: -1
    })
    this.firstLoad();
  },
  handerChange: function(e) {
    let {
      index
    } = util.getData(e);
    this.setData({
      current: index
    })
  },
  async formSubmit(e) {
    let formId = e.detail.formId;
    let {
      current,
      list,
      update
    } = this.data;
    if (current < 0) {
      util.showModal("请选择等级后开通!")
      return;
    }
    let idn = list[current].idn;
    util.showLoading();
    let {
      order_info
    } = await partnerModel.join({
      idn
    })
    util.hideAll();
    if (!order_info) return;
    await util.pay(order_info)
   
    if (update) {
			util.showSuccess('支付成功')
      util.getPage(-1).onPullDownRefresh()
      setTimeout(function() {
        wx.navigateBack({
          delta: 1
        })
      }, 1500)

    } else {
			wx.showModal({
				title: '提示',
				content: '你已开通推客成功,是否前往推客中心!',
				showCancel: true,
				cancelText: '回到首页',
				confirmText: '前往',
				success: function(res) {
					if(res.confirm){
						wx.redirectTo({
							url: '/pages/ucenter/partner/home',
						})
					}else{
						wx.switchTab({
							url: '/pages/card/index/index'
						})
					}
				},
			})
    }
  }
})