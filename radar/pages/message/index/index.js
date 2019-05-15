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
    tabBar: getApp().globalData.radarTabBar,
    list: {
      total: 0,
      per_page: 20,
      current_page: 1,
      last_page: 1,
      data: []
    },
    loading: true,
    param: {
      page_path: "radar/pages/message/index/index",
      page: 1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let that = this;
    await getApp().getUserInfo()
    this.subscribe();
  },
  async onShow(){
    
  },
  //页面卸载
  onUnload() {
    getApp().websocket.unSubscribe("getChatList")
    getApp().websocket.unSubscribe("getAllUnRead");
  },
  async subscribe() {
    
    getApp().websocket.subscribe("getChatList", this.onListChange)
    getApp().websocket.subscribe("getAllUnRead", this.onAllUnReadChange)

    // await getApp().websocket.login()
    getApp().websocket.login()

    getApp().websocket.sendMessage({
      type: "getChatList"
    })
    getApp().websocket.sendMessage({
      type: "getAllUnRead"
    })
  },
  onAllUnReadChange(data) {
    this.setData({
      'tabBar.list[1].num': data.count
    })
  },
  goUrl(e) {
    let {
      url
    } = util.getData(e);
    util.goUrl(url)
  },
  //添加多条到列表
  onListChange(newlist) {
    let that = this;
    this.setData({
      'list.data': newlist,
      loading: false
    })
  },
  handerSwiperChange: function(e) {
    let {
      index
    } = util.getData(e);
    let key = `list.data[${index}].switch`;
    let val = e.detail;

    this.setData({
      [key]: val
    })
  },
  async delOut(e) {
    let {
      uid: tar_uid
    } = util.getData(e)
    let that = this;
    let {
      confirm
    } = await wx.pro.showModal({
      title: '提示',
      content: '删除后将不显示之前的聊天记录,确认删除?'
    })
    let type = 'deleteMsg';
    getApp().websocket.sendMessage({
      type,
      tar_uid
    })
  }
})