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
    let that = this;
    util.showLoading()
    let {
      card: userInfo
    } = await getApp().getUserInfo()
    util.hideAll();
    that.setData({
      userInfo
    })
  },
  async save(e) {
		let that=this;
    let qrcode = this.data.userInfo.qrcode;
    util.showLoading();
    let {
      tempFilePath: filePath
    } = await wx.pro.downloadFile({
      url: qrcode
    })
    util.hideAll();
		await wx.pro.saveImageToPhotosAlbum(filePath).then((d) => {
      util.showSuccess("保存成功")
    }).catch((e) => {
			console.log(e)
			that.setData({
				settingShow: e.errMsg.includes('auth')
      })
    })
  }
})