import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  cardModel,
} from '../../../apis/index.js';

Page({
  data: {
    refresh: false
  },
  async onLoad(options) {
    // util.showLoading();
    

  },
  onShow: function() {
    //不是第一次进来就刷新
    let {
      loading
    } = this.data;
    if (!loading) {
      this.onPullDownRefresh();
      return;
    }
    this.firstLoad();
    
  },
  onPullDownRefresh() {
    // wx.showNavigationBarLoading()
    this.setData({
      refresh: true
    })
    this.firstLoad();
  },
  async firstLoad() {
    let {share_words} = await cardModel.getShareVerbal()
    console.log('-----------share_words-----------')
    console.log(share_words)
    let getConfigInfo=getApp().getConfigInfo();
    let { forword_words } = await getConfigInfo;
    this.setData({
      forword_words,
      share_words
    })
  },
  goUrl: function(e) {
    let {
      url
    } = util.getData(e);
    util.goUrl(url)
  },
})