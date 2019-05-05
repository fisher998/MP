import util from '../../../../utils/index.js';
import {
  radarModel,
  messageModel,
  fileModel,
  cardModel
} from '../../../../apis/index.js'
const regeneratorRuntime = util.regeneratorRuntime

Page({



  /**
   * 页面的初始数据
   */
  data: {
    showMore: false,
    showEmoji:false,
    scrollTop: 1000,
    text: '',
    list: {
      data: [],
      total: 0,
      per_page: 20,
      current_page: 1,
      last_page: 0
    },
    param: {
      tar_uid: '',
      page: 1
    },
    loading: true,
    changeObj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let that = this;
    let {
      nickName,
      uid,
      is_share
    } = options;
    wx.setNavigationBarTitle({
      title: nickName || "聊天"
    })
    this.setData({
      'param.tar_uid': uid,
      is_share: is_share||""
    })
    await getApp().getUserInfo()
    //初始化信息
    that.subscribe();
    that.initEmoji();
  },
  goUrl(e){
    let {url,method}=util.getData(e);
    util.goUrl(url, method)
  },
  async subscribe() {
    await getApp().websocket.login()
    console.log("登陆了")
    getApp().websocket.subscribe("getChatInfo", this.addMoreToList)
    getApp().websocket.subscribe("sendMsg", this.addOneToList)
    getApp().websocket.subscribe("readMsg", this.onReadMsg)
    this.getList();
    let {
      tar_uid
    } = this.data.param
  },
  //页面卸载
  onUnload: function() {
    getApp().websocket.unSubscribe("getChatInfo")
    getApp().websocket.unSubscribe("sendMsg", this.addOneToList)
    getApp().websocket.unSubscribe("readMsg", this.onReadMsg)
  },
  onReadMsg: function(obj) {
    let changeObj = this.data.changeObj;
    this.setData({
      changeObj: { ...changeObj,
        ...obj
      }
    })
  },
  //输入框值变化
  handerInputChange: function(e) {
    let val = e.detail.value
    this.setData({
      text: val
    })
  },

  comfirmText: function() {
    let type = 1;
    let tar_uid = 412;
    let msg_type = 1;
    let content = this.data.text;
    this.send({
      msg_type,
      content
    });
  },
  //选择图片
  async chooseImage(e) {
    let {
      type
    } = util.getData(e)
    let {
      tempFiles
    } = await wx.pro.chooseImage({
      count: 1,
      sourceType: type === 0 ? ['album'] : ['camera']
    })
    util.showLoading();
    let {
      src
    } = await fileModel.upload({
      filePath: tempFiles[0].path
    })
    util.hideAll();
    let msg_type = 2;
    let content = src;
    this.send({
      msg_type,
      content
    });
    this.setData({
      showMore: false,
      showEmoji:false
    })
  },
  //发送
  send(param) {
    let that = this;
    let {
      tar_uid
    } = this.data.param;
    let type = 'sendMsg';
    param = Object.assign({}, param, {
      tar_uid,
      type
    })
    getApp().websocket.sendMessage(param)
  },
  getList() {
    let {
      page,
      tar_uid
    } = this.data.param
    getApp().websocket.sendMessage({
      type: "getChatInfo",
      tar_uid,
      page
    })

  },
  //添加单条到列表
  addOneToList(obj) {
    console.log(obj)
    let {
      is_self,
      uid
    } = obj;
    if (!is_self) {
      //触发已读
      let {
        tar_uid
      } = this.data.param
      if (uid != tar_uid){
        return;
      }
      getApp().websocket.sendMessage({
        tar_uid,
        type: "readMsg"
      })

    }

    let that = this;
    let list = this.data.list;

    list.data.push(obj)
    console.log(list)
    that.setData({
      list,
      text: ""
    }, function() {
      that.pageScrollToBottom();
    })
  },
  //添加多条到列表
  addMoreToList(newlist) {

    let {
      tar_uid,
      page
    } = this.data.param
    if (page == 1) {
      //触发已读
      getApp().websocket.sendMessage({
        tar_uid,
        type: "readMsg"
      })
    }

    let that = this;
    let oldlist = this.data.list;
    newlist.data.reverse()
    newlist.data = [...newlist.data, ...oldlist.data, ];
    this.setData({
      list: newlist,
      loading: false
    }, function() {
      let {
        current_page
      } = newlist;
      if (current_page == 1) {
        that.pageScrollToBottom();
      }
    })

  },
  //重发
  reSend: function(e) {
    console.log(e)
    let {
      index
    } = e.currentTarget.dataset;
    let item = this.data.list[index];
    let text = item.text;
    // let key=`list[${index}]`
    getApp().websocket.sendMessage(text).then(() => {
      console.log("发送成功")

    }).catch(() => {
      console.log("发送失败")

    })
  },
  //上拉触顶
  handerUpper(e) {
    console.log("触顶")
    let that = this;
    let {
      loading,
      list
    } = this.data;
    let {
      current_page,
      last_page
    } = list;
    if (loading || current_page >= last_page) return;
    that.setData({
      'param.page': current_page + 1,
      loading: true
    })
    that.getList();
  },
  // 使页面滚动到底部
  pageScrollToBottom: function() {
    let that = this;
    setTimeout(function() {
      wx.createSelectorQuery().select('#container').boundingClientRect(function(rect) {
        that.setData({
          scrollTop: rect.height
        })
      }).exec()
    }, 300)
  },
  //预览图片
  previewImage(e) {

    let {
      src
    } = util.getData(e);
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
  handerLineChange(e) {
    console.log(e)
    let {
      lineCount,
      heightRpx
    } = e.detail;
    this.setData({
      heightRpx,
      lineCount
    })
  },
  formSubmit(e) {
    let formId = e.detail.formId;
    getApp().collectFormId(formId);
  },
  focus(e) {
    let height = e.detail.height||0;
    this.setData({
      height,
      showMore: false,
      showEmoji:false
    })
  },
  blur() {
    this.setData({
      height: 0
    })
  },
  changeShowMore() {
    let showMore = this.data.showMore
    this.setData({
      height: 0,
      showMore: !showMore,
      showEmoji:false
    })
  },
  changeShowEmoji(){
    let showEmoji = this.data.showEmoji
    this.setData({
      height: 0,
      showEmoji: !showEmoji,
      showMore:false
    })
  },
  initEmoji() {
    let emojiChar = "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲";

    let emojiKey = [
      "60a", "60b", "60c", "60d", "60f",
      "61b", "61d", "61e", "61f",
      "62a", "62c", 
      "602", "603", "605", "606", "608",
      "612", "613", "614", "615", "616", "618", "619", "620", "621", "623", "624", "625", "627", "629", "633", "635", "637",
      "63a", "63b", "63c", "63d", "63e", "63f",
      "64a", "64b", "64f", "681",
      "68a", "68b", "68c",
      "344", "345", "346", "347", "348", "349", "351", "352", "353",
      "414", "415", "416",
      "466", "467", "468", "469", "470", "471", "472", "473",
      "483", "484", "485", "486", "487", "490", "491", "493", "498", "6b4"
    ];
    let emojiCharArr = emojiChar.split('-');
    let emojis=[];
    for (let i in emojiKey){
      let em = {
        char: emojiCharArr[i],
        emoji: "0x1f" + emojiKey[i]
      };
      let index = parseInt(i/40)
      if (!emojis[index]){
        emojis[index]=[]
      }
      emojis[index].push(em)
    }
    this.setData({
      emojis
    })
  },
  //当前输入内容和表情合并
  emojiChoose(e){
    this.setData({
      text: this.data.text + e.currentTarget.dataset.emoji
    })
  },
  delEmoji(){
    let text=this.data.text;
    console.log(text.length)
    let newtext = text.substring(0, text.length - 1);
    this.setData({
      text:newtext
    })
  },
  async collect(e) {

    let that = this;
    let {
      id:card_id,
      uid,
      index
    } = util.getData(e);
    let type=3;
    let mode=1;
    let key = `list.data[${index}].content.is_collect`
    util.showLoading()
    await cardModel.operateCard({
      type,
      mode,
      card_id
    })
    util.showFail("已收下")
    util.hideAll();
    that.setData({
      [key]:true,
    })
    radarModel.report({
      event_name: "collect_card",
      obj_uid: uid
    })
  },
})