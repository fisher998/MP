// pages/webview/webview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { url } = options
		url=decodeURIComponent(url)
    url =  url || "http://data.taagoo.com/pano/20170501720604.html?startscene=scene_31714&"
    this.setData({
      url
    })
  }
})