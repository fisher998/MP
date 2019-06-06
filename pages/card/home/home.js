import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  cardModel,
  radarModel
} from '../../../apis/index.js'
import {
  formatImageUrl
} from '../../../utils/req.js'
var innerAudioContext;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBar:getApp().globalData.tabBar,
    play: false,
    refresh: false,
    hasCard: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    //uid列表进入的用户id，scene分享进入的用户id,operate_id统计时小红点
    let { uid="", scene="", operate_id="" } = options
    util.showLoading()
    let that = this;

    wx.setStorageSync('pid', scene||"")
   
    that.setData({
      other_uid: uid || scene,
      operate_id,
      share: scene?true:false
    })
    that.firstLoad();

    innerAudioContext = wx.createInnerAudioContext()
    
  },
  onUnload: function() {
    innerAudioContext.destroy()
    getApp().websocket.unSubscribe("getUnreadOnePerson")
  },
  async subscribe() {
    
    getApp().websocket.subscribe("getUnreadOnePerson", this.onUnreadOnePerson)
    // await getApp().websocket.login()
    getApp().websocket.login()
    let {
      other_uid
    } = this.data;
    getApp().websocket.sendMessage({
      tar_uid: other_uid,
      type: "getUnreadOnePerson"
    })

  },
  onUnreadOnePerson(data) {
    let that=this;
    let count = data.count
    this.setData({
      'UnreadOnePerson': count
    })
  },
  
  
  async firstLoad() {
    let that = this;
    let {
      other_uid,
      operate_id,
      refresh
    } = that.data;

    let [otherUserInfo,configInfo,userInfo] = await Promise.all([cardModel.getInfo({
      other_uid,
      operate_id
    }), getApp().getConfigInfo(refresh), getApp().getUserInfo(refresh)])
    let {share_words} = await cardModel.getShareVerbal()
  
    otherUserInfo.tel = otherUserInfo.is_private_tel?otherUserInfo.tel:"互相收藏后可见";
    
    let pageConfig = util.getPageConfig(configInfo, ["forword_words", "radar","link_switch"])
    let showLogin = util.isEmpty(userInfo.card) ? true : false;

    that.setData({
      otherUserInfo,
      pageConfig,
      showLogin,
      uid: wx.getStorageSync('userInfo').id,
      refresh: false,
      share_words
    })
    util.hideAll();

    that.initVoice(otherUserInfo.voice_path)
    
    that.subscribe();
    radarModel.report({
      event_name: "view_card",
      obj_uid: other_uid
    })
  },
  initVoice: function(voice_path) {
    if (!voice_path) return;
    let that = this;
    innerAudioContext.src = voice_path || "";
    //开始播放
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.setData({
        play: true
      })
    })
    //结束播放f
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
    } = this.data.otherUserInfo;

    let forword_words = this.data.forword_words || "你好,我是&&name&&,邀你30秒免费做名片,相互收藏"
    forword_words = forword_words.replace(/&&name&&/g, name)
    radarModel.report({
      event_name: "share_card",
      obj_uid: uid
    })
    return {
      title: forword_words,
      path: `/pages/card/home/home?scene=${uid}`
    }

  },
  goUrl: function(e) {
    let {
      url
    } = util.getData(e)
    util.goUrl(url)
  },
  formSubmit: function(e) {
    let formId = e.detail.formId;
    getApp().collectFormId(formId)
  },
  //开始播放
  play: function() {
    let {
      play,
      otherUserInfo,
      other_uid
    } = this.data
    if (!otherUserInfo.voice_path) {
      wx.showToast({
        title: '还没有语音!',
        icon: "none"
      })
      return;
    }
    if (play) {
      innerAudioContext.stop()
    } else {
      innerAudioContext.play()
      radarModel.report({
        event_name: "play_voice",
        obj_uid: other_uid
      })
    }

  },
  async thumb(e) {

    let that = this;
    let { card } = await getApp().getUserInfo();
    if (!card) {
      this.setData({
        showLogin: true
      })
      return;
    } 
    let {
      type,
      mode,
      card_id
    } = util.getData(e);
    let {
      like,
      uid
    } = this.data.otherUserInfo;
    util.showLoading()
    await cardModel.operateCard({
      type,
      mode,
      card_id
    })
    util.hideAll();
    let msg = mode == 1 ? '点赞成功' : "取消成功"
    util.showFail(msg)
    that.setData({
      'otherUserInfo.like': like + mode,
      'otherUserInfo.is_like': mode == 1 ? true : false
    })
    if (mode == 1) {
      radarModel.report({
        event_name: "like_card",
        obj_uid: uid
      })
    }
  },
  async collect(e) {
    let { card } = await getApp().getUserInfo();
    if (!card) {
      this.setData({
        showLogin: true
      })
      return;
    } 
    let that = this;
    let {
      type,
      mode,
      card_id
    } = util.getData(e);
    let {
      collect,
      uid
    } = this.data.otherUserInfo;
    util.showLoading()
    await cardModel.operateCard({
      type,
      mode,
      card_id
    })
    util.hideAll();
    let msg = mode == 1 ? '收藏成功' : "取消成功"
    util.showFail(msg)
    that.setData({
      'otherUserInfo.is_collect': mode == 1 ? true : false,
      'otherUserInfo.collect': collect + mode
    })
    if (mode == 1) {
      radarModel.report({
        event_name: "collect_card",
        obj_uid: uid
      })
      getApp().websocket.sendMessage({
        type:"sendMsg",
        tar_uid: uid,
        msg_type:3,
        content:''
      })
    }
  },
  async copy(e) {
    let {
      str,
      key
    } = util.getData(e)
    let {
      other_uid
    } = this.data;
    await wx.pro.setClipboardData({
      data: str,
    })
    util.showFail("复制成功")
    radarModel.report({
      event_name: key,
      obj_uid: other_uid
    })
  },
  async openLocation() {
    let {
      latitude,
      longitude,
      mini_address: name,
      address,
      uid
    } = this.data.otherUserInfo
    await wx.pro.openLocation({
      latitude,
      longitude,
      name,
      address
    })
    radarModel.report({
      event_name: 'navigate_address',
      obj_uid: uid
    })
  },
  async previewImage(e) {
    let {
      src,
      key
    } = util.getData(e);
    let imageList = this.data.otherUserInfo[key];
    let imgArr = [];
    for (let i in imageList) {
      imgArr.push(imageList[i].path)
    }
    await wx.pro.previewImage({
      current: src,
      urls: imgArr
    })
  },
  async call(e) {
    let {
      tel,
      uid
    } = this.data.otherUserInfo
    await wx.pro.makePhoneCall({
      phoneNumber: tel
    })
    radarModel.report({
      event_name: 'call_tel',
      obj_uid: uid
    })
  },
  async addPhoneContact() {
    let {
      name,
      tel,
      address,
      company_name,
      position,
      person_avatar,
      uid
    } = this.data.otherUserInfo;
    await wx.pro.addPhoneContact({
      firstName: name,
      mobilePhoneNumber: tel,
      workAddressStreet: address,
      organization: company_name,
      title: position
    })
    radarModel.report({
      event_name: 'add_cardbook',
      obj_uid: uid
    })
  },
  loginSuccess(){
    getApp().getUserInfo(true)
    this.setData({
      showLogin: false
    })
  },
  async goCradIndex(){
    let {card}=await getApp().getUserInfo();
    if(!card){
      this.setData({
        showLogin:true
      })
    }else{
      wx.switchTab({
        url: '/pages/card/index/index',
      })
    }
  }
})