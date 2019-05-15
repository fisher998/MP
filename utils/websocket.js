import siteInfo from '../siteinfo.js';
import util from './index.js';
export default {
  localSocket: null,
  limit: 0,
  timeout: 20000,
  timeoutObj: null,
  serverTimeoutObj: null,
  isInitPage: false,
  isLogin: false,
  watcherList: [], // 订阅者,
  reset: function () {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function () {
    let that = this;
    //每隔20秒发送一次暗号
    that.timeoutObj = setTimeout(() => {
      wx.sendSocketMessage({
        data: "78346+SJDHFA.longbing",
        success() {
          //console.log("发送暗号");
        }
      });
      //20秒没收到回应则关闭连接
      that.serverTimeoutObj = setTimeout(() => {
        console.log("关闭")
        wx.closeSocket();
      }, that.timeout);
    }, that.timeout);
  },
  connect() {
    let that = this;
    let { uniacid: i } = siteInfo;
    let userInfo = wx.getStorageSync('userInfo') || {};
    let uid = userInfo.id || "";
    // let url = `wss://${util.getHostname(siteInfo.siteroot)}/websocket`;
    let url = `ws://${util.getHostname(siteInfo.siteroot)}/websocket`;

    that.localSocket = wx.connectSocket({
      url
    })
    that.localSocket.onMessage((res) => {
      //收到消息
      if (res.data == "78346+SJDHFA.longbing") {
        //console.log("对接暗号成功,登录成功")
        that.reset().start()
      } else {
        that.getSocketMsg(JSON.parse(res.data))
        // 收到的消息为字符串，需处理一下
      }
    })
    that.localSocket.onOpen((res) => {
      that.reset().start();
    })
    that.localSocket.onError((res) => {
      that.reconnect()
    })
    that.localSocket.onClose((res) => {
      that.reconnect()
    })
  },

  // websocket登录和页面同步进行问题，当先登录,则页面不需要登录回调，直接执行下面操作
  // 如果未登录，则需要注册登录回调，等待回调成功后，执行下面操作
  onLogin() {
    //登录成功回调isLogin变为true
    console.log('WebSocket登录成功！')
    this.isLogin = true
    if (this.loginCallback) {
      this.loginCallback()
    }
  },
  login() {
    let that = this;
    //页面调用登录，如果已经登录则直接返回成功，如果未登录等待登录回调成功
    return new Promise((resolve, reject) => {
      if (that.isLogin) {
        resolve()
      } else {
        that.loginCallback = function () {
          resolve()
        }
      }
    })
  },
  // 重连
  reconnect() {
    console.log("WebSocket重连中...")
    let that = this;
    that.isLogin = false
    if (that.lockReconnect) return;
    that.lockReconnect = true;
    clearTimeout(that.timer)
    if (that.limit < 12) {
      that.timer = setTimeout(() => {
        that.connect();
        that.lockReconnect = false;
      }, 5000);
      that.limit++
    } else {
      console.log("WebSocket连接失败！")
    }
  },
  //收到消息
  getSocketMsg(res) {
    let that = this;
    let {
      code,
      msg,
      type,
      data
    } = res

    if (code == 401) {
      wx.closeSocket();
    } else if (code == 0) {
      if (type == "login") {
        that.onLogin();
      } else {
        that.publish(type, data);
      }
    } else if (code == -1) {
      console.log(res)
    }
  },
  //发送消息
  sendMessage: function (param) {

    let that = this;
    let { uniacid: i } = siteInfo;
    let uid = wx.getStorageSync('userInfo').uid
    param = Object.assign({}, param, { i,uid})
    param = JSON.stringify(param)

    console.log(param)
    return new Promise((resolve, reject) => {
      that.localSocket.send({
        data: param,
        success: function (res) {
          console.log(res)
          resolve(res)
        },
        fail: function (e) {
          reject(e)
          console.log(e)
          wx.showToast({
            title: '网络繁忙',
            icon: 'none'
          })
        }
      })
    })
  },
  // 订阅
  subscribe: function (key, fn) {
    if (!this.watcherList[key]) {
      this.watcherList[key] = [];
    }
    this.watcherList[key].push(fn);
    console.log(key)
    console.log(this.watcherList)
  },
  // 发布
  publish: function () {
    let arg = arguments;
    let key = [].shift.call(arg);
    let fns = this.watcherList[key];
    if (!fns || fns.length <= 0) return false;

    for (var i = 0, len = fns.length; i < len; i++) {
      fns[i].apply(this, arg);
    }
  },
  // 取消订阅
  unSubscribe(key) {
    let fns = this.watcherList[key];
    if (!fns || fns.length <= 0) return false;
    delete this.watcherList[key].pop();
  }
}