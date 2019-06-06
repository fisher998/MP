import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  cardModel,
  radarModel,
  userModel
} from '../../../apis/index.js'
var WxParse = require('../../../plugin/wxParse/wxParse.js');
var innerAudioContext = null;
let defaultcardInfo = wx.getStorageSync('allUserInfo') ? wx.getStorageSync('allUserInfo').card:false;
let defaultPageInfo = util.getPageConfig(wx.getStorageSync('configInfo'), ["pay_switch", "open_partner", "forword_words", "tech_support", "radar", "link_switch"])
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: defaultcardInfo,
    pageConfig: defaultPageInfo,
    refresh: false,
    loading: true,
    showMessage: false
  },
  onLoad() {
    util.showLoading();
  },
  onShow() {
    innerAudioContext = wx.createInnerAudioContext();
    this.firstLoad();
  },
  onHide: function() {
    getApp().websocket.unSubscribe("getAllUnRead")
    innerAudioContext.destroy()
  },
  async firstLoad() {
    
    let that = this;
    let refresh = this.data.refresh;
    let [allUserInfo, configInfo] = await Promise.all([getApp().getUserInfo(refresh), getApp().getConfigInfo(refresh)]);
    let {share_words} = await cardModel.getShareVerbal()
    util.hideAll();
    let pageConfig = util.getPageConfig(configInfo, ["pay_switch", "open_partner", "forword_words", "tech_support", "radar","link_switch"])
    let userInfo = allUserInfo.card;
    let partner_level = allUserInfo.partner_level
    that.setData({
      userInfo,
      pageConfig,
      partner_level,
      loading: false,
      refresh: false,
      share_words
    })
   
    if (!userInfo) {
      let space = wx.getSystemInfoSync().windowWidth / 750 * 32
      WxParse.wxParse('content', 'html', configInfo.index_text, this, space);
    }else{
      this.initVoice(userInfo.voice_path)
    }

    this.subscribe();
    
  },
  async subscribe() {
    getApp().websocket.subscribe("getAllUnRead", this.onAllUnReadChange)
    
    // await getApp().websocket.login();
    getApp().websocket.login();
    
    getApp().websocket.sendMessage({
      type: "getAllUnRead"
    })
  },
  onAllUnReadChange(data) {
    let that = this;
    let count = data.count;
    this.setData({
      'all_unreaad': count
    })
    if (count <= 0) return;
    setTimeout(function () {
      that.setData({
        showMessage: true
      })
    }, 500)
    setTimeout(function () {
      that.setData({
        showMessage: false
      })
    }, 3000)
  },
  initVoice(voice_path) {
    let that = this;
    if (!voice_path) return;
    innerAudioContext.src = voice_path;
    //开始播放
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.setData({
        play: true
      })
    })
    //结束播放
    innerAudioContext.onStop((res) => {
      console.log('结束播放')
      that.setData({
        play: false
      })
    })
    //自然结束播放
    innerAudioContext.onEnded((res) => {
      console.log('结束播放')
      that.setData({
        play: false
      })
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.setData({
      refresh: true
    })
    this.firstLoad();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let {
      name,
      uid,
      person_avatar
    } = this.data.userInfo;
    let forword_words = this.data.share_words || this.data.pageConfig.forword_words || "你好,我是&&name&&,邀你30秒免费做名片,相互收藏";
    forword_words = forword_words.replace(/&&name&&/g, name);

    return {
      title: forword_words,
      path: `/pages/card/home/home?scene=${uid}`,
      imageUrl: person_avatar
    }
  },
  async share(){
    let { id, mingpian_send}=this.data.userInfo;
    if (mingpian_send<=0){
      let { confirm } = await wx.pro.showModal({
        title: '权限不足',
        content: "今日发名片数量已达上限,升级会员可提升上限",
        confirmText: "去开通"
      })
      if (confirm) util.goUrl('/pages/ucenter/member/member');
      return;
    }
    await cardModel.operateCard({
      type: 4,
      mode: 1,
      card_id: id,
    })
    this.onPullDownRefresh();
  },
  goUrl: function(e) {
    let {
      url
    } = util.getData(e);
    util.goUrl(url)
  },
  formSubmit(e) {
    let formId = e.detail.formId;
    getApp().collectFormId(formId);
  },
  //开始播放
  play: function() {
    let {
      play
    } = this.data
    if (play) {
      innerAudioContext.stop()
    } else {
      innerAudioContext.play()
    }

  },
  previewImage(e) {
    let {
      src,
      key
    } = util.getData(e);
    let imageList = this.data.userInfo[key];
    let imgArr = [];
    for (let i in imageList) {
      imgArr.push(imageList[i].path)
    }
    wx.previewImage({
      current: src,
      urls: imgArr
    })
  },
  async copy(e) {
    let {
      str
    } = util.getData(e)
    await pro.wx.setClipboardData({
      data: str
    })
    util.showSuccess("复制成功")
  },
  async openLocation() {
    let {
      latitude,
      longitude,
      mini_address: name,
      address
    } = this.data.userInfo
    await wx.pro.openLocation({
      latitude,
      longitude,
      name,
      address
    })
  },
  
  async getUserInfo (e) {
    let that = this;
    let userInfo = e.detail.userInfo;
    if (!userInfo) return;
    let { avatarUrl, nickName, gender, province, city } = userInfo;
    wx.showLoading({
      title: '创建中...',
    })
    let introduce = `来自${province}${city}的${gender == 2 ? "美女" : "帅哥"}`;
    let addCard = cardModel.add({ person_avatar: avatarUrl, name: nickName, company_logo: avatarUrl, introduce })
    let updateUserInfo = userModel.updateUserInfo({ nickName, avatarUrl, gender })
    await addCard
    await updateUserInfo
    util.hideAll();
    that.onPullDownRefresh();
  },
})