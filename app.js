import {
  userModel,
  categoryModel,
  radarModel
} from './apis/index.js';
import util from './utils/index.js';
import './utils/wxPromise.min.js'
const regeneratorRuntime = util.regeneratorRuntime
import websocket from './utils/websocket.js';
App({
  onLaunch: function(options) {
    console.log(options)
    //获取配置
    let that = this;
  },

  globalData: {
    configInfo: false,
    userInfo: false,
    locationInfo: false,
    initWebsocket: false,
    formIds: [],
    tabBar: {
      color: "#b0b3c0",
      selectedColor: "#28c24c",
      backgroundColor: "#fff",
      borderStyle: "white",
      list: [{
          pagePath: "/pages/card/index/index",
          text: "我的名片",
          iconPath: "/images/tabbar/t1.png",
          selectedIconPath: "/images/tabbar/t1-fill.png",
          method: "switchTab"
        },
        {
          pagePath: "/pages/card/book/book",
          text: "名片夹",
          iconPath: "/images/tabbar/t2.png",
          selectedIconPath: "/images/tabbar/t2-fill.png",
          method: "switchTab"
        },
        {
          pagePath: "/pages/card/square/square",
          text: "人脉集市",
          iconPath: "/images/tabbar/t3.png",
          selectedIconPath: "/images/tabbar/t3-fill.png",
          method: "switchTab"
        },
        {
          pagePath: "/pages/info/index/index",
          text: "信息广场",
          iconPath: "/images/tabbar/t5.png",
          selectedIconPath: "/images/tabbar/t5-fill.png",
          method: "switchTab"
        },
        {
          pagePath: "/pages/ucenter/index/index",
          text: "个人中心",
          iconPath: "/images/tabbar/t4.png",
          selectedIconPath: "/images/tabbar/t4-fill.png",
          method: "switchTab"
        }
      ]
    },
    radarTabBar: {
      color: "#5d6268",
      selectedColor: "#21bf34",
      backgroundColor: "#fff",
      borderStyle: "white",
      list: [{
          pagePath: "/radar/pages/info/index/index",
          text: "雷达",
          iconPath: "/images/radar-tabbar/t1.png",
          selectedIconPath: "/images/radar-tabbar/t1-fill.png",
          method: "redirectTo"
        },
        {
          pagePath: "/radar/pages/message/index/index",
          text: "消息",
          iconPath: "/images/radar-tabbar/t2.png",
          selectedIconPath: "/images/radar-tabbar/t2-fill.png",
          method: "redirectTo"
        },
        {
          pagePath: "/radar/pages/custom/index/index",
          text: "客户",
          iconPath: "/images/radar-tabbar/t3.png",
          selectedIconPath: "/images/radar-tabbar/t3-fill.png",
          method: "redirectTo"
        },
        {
          pagePath: "/pages/ucenter/index/index",
          text: "我的",
          iconPath: "/images/radar-tabbar/t4.png",
          selectedIconPath: "/images/radar-tabbar/t4-fill.png",
          method: "switchTab"
        }
      ]
    },
  },
  siteInfo: require('siteinfo.js'),
  websocket,
  //获取全局配置信息
  async getConfigInfo(refrensh = false) {
    let that = this;
    let configInfo = that.globalData.configInfo;
    //已经获取过了且不刷新则获取老信息
    if (!configInfo || refrensh) {
      configInfo = await userModel.getConfig();
    }
    let {
      tab_name4,
      android_pay_switch,
      ios_pay_switch,
      radar
    } = configInfo;
    
    //处理虚拟支付问题
    let isIos = wx.getSystemInfoSync().system.includes('iOS');
    let pay_switch = isIos ? ios_pay_switch : android_pay_switch;
    configInfo.pay_switch = pay_switch;
    // wx[pay_switch ? "showTabBar" : "hideTabBar"]({
    //   aniamtion: false
    // })

    //修改底部导航
    // wx.setTabBarItem({
    //   index: 3,
    //   text: tab_name4 || "信息广场"
    // })

    //未初始化聊天且聊天打开则进行初始化
    if (!that.initWebsocket && radar.chat_switch == 1) {
      //连接websocket
      that.websocket.connect();
      that.initWebsocket = true
    }
    

    //关闭聊天开关后应该隐藏底部消息tab
    if (radar.chat_switch == 0) {
      that.globalData.radarTabBar.list[1].hide = true
    }
    that.globalData.configInfo = configInfo;
    wx.setStorageSync('configInfo', configInfo)
    return configInfo
  },
  //获取全局用户信息
  async getUserInfo(refrensh = false) {
    let that = this;
    let userInfo = that.globalData.userInfo;
    if (userInfo && !refrensh) {
      return userInfo
    } else {
      let userInfo = await userModel.getUserInfo()
      //userInfo.card=false
      that.globalData.userInfo = userInfo;
      wx.setStorageSync('allUserInfo', userInfo)
      return userInfo
    }
  },
  //获取全局定位信息
  async getLocationInfo(refrensh = false) {
    let that = this;
    let locationInfo = that.globalData.locationInfo;
    if (locationInfo && !refrensh) {
      return locationInfo
    } else {
      let locationInfo = await util.getLocation()
      that.globalData.locationInfo = locationInfo;
      return locationInfo
    }
  },
  //收集formID
  async collectFormId(formId) {
    console.log(formId)
    let formIds = this.globalData.formIds;
    if (!formId || formId == "the formId is a mock one") return;
    formIds.push(formId)
    if (formIds.length < 1) return;
    let form_id = JSON.stringify(formIds)
    await radarModel.collectFormId({
      form_id
    })
    this.globalData.formIds = []
  }
})