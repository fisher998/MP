// pages/card/radar/radar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{
			text:"首次|查看|你的|名片|,请关注"
		}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let item=this.data.item;
		item.textArr = item.text.split("|")
		this.setData({
			item
		})
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})