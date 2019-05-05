import Validate from './validate.js';
import regeneratorRuntime from './wxPromise.min.js'
export default {
  //验证
  Validate,
  regeneratorRuntime,
  //格式化时间
  formatTime(date, format) {
    let newFormat = format || 'YY-M-D h:m:s';
    let formatNumber = this.formatNumber;
    let newDate = date || new Date();
    if (Object.prototype.toString.call(newDate).slice(8, -1) !== "Date") {
      newDate = new Date(date);
    }
    let week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', '日', '一', '二', '三', '四', '五', '六'];
    return newFormat.replace(/YY|Y|M|D|h|m|s|week|星期/g, function(a) {
      switch (a) {
        case 'YY':
          return newDate.getFullYear();
        case 'Y':
          return (newDate.getFullYear() + '').slice(2);
        case 'M':
          return formatNumber(newDate.getMonth() + 1);
        case 'D':
          return formatNumber(newDate.getDate());
        case 'h':
          return formatNumber(newDate.getHours());
        case 'm':
          return formatNumber(newDate.getMinutes());
        case 's':
          return formatNumber(newDate.getSeconds());
        case '星期':
          return "星期" + week[newDate.getDay() + 7];
        case 'week':
          return week[newDate.getDay()];
      }
    })
  },
  //格式化数字
  formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n
  },

  /**
   * 人性话格式时间
   */
  ctDate(date) {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;


    if (!date) return "";
    const now = Date.now();
    let diffValue;
    let result;
    date = typeof date === "number" ? date : +(new Date(date));
    diffValue = now - date;

    let monthC = diffValue / month;
    let weekC = diffValue / (7 * day);
    let dayC = diffValue / day;
    let hourC = diffValue / hour;
    let minC = diffValue / minute;

    if (monthC >= 1) {
      result = parseInt(monthC) + "个月前";
    } else if (weekC >= 1) {
      result = parseInt(weekC) + "个星期前";
    } else if (dayC >= 1) {
      result = parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
      result = parseInt(hourC) + "个小时前";
    } else if (minC >= 1) {
      result = parseInt(minC) + "分钟前";
    } else {
      result = "刚刚发表";
    }

    return result;
  },

  //返回类型
  typeOf(param) {
    return Object.prototype.toString.call(param).slice(8, -1)
  },
  //判断是否为空
  isEmpty(param) {

    //基本类型为空
    let condition1 = param === '' || param === null || param === undefined || param === "NaN" || param === false;
    let condition2;
    let condition3
    //引用类型为空
    if (!condition1) {
      condition2 = this.typeOf(param) === "Object" && Object.keys(param).length < 1;
      condition3 = this.typeOf(param) === "Array" && param.length < 1;
    }


    return condition1 || condition2 || condition3;
  },

  //检查授权
  checkAuth(name) {
    let that = this;
    return new Promise((resove, reject) => {
      wx.getSetting({
        success(res) {
          if (res.authSetting[`scope.${name}`]) {
            resove(true)
          } else {
            resove(false)
          }
        },
        fail() {
          that.networkError()
        }
      })
    })
  },
	auth(name){
		return new Promise((resove, reject) => {
			wx.getSetting({
				success(res) {
					if (!res.authSetting[`scope.${name}`]) {
						wx.authorize({
							scope: `scope.${name}`,
							success() {
								resove(true)
							},
							fail(){
								resove(false)
							}
						})
					}else{
						resove(true)
					}
				}
			})
		})
	},
  //小程序自带获取定位
  getLocation() {
    let that = this;
    return new Promise((resove, reject) => {
      wx.getLocation({
        success: function(res) {
          resove(res)
        },
        fail: function(e) {
					reject(e)
        }
      })
    })
  },
  getWeather(ak = 'GoI7BxLpfvBEyf1TcMXCloi99Vov7flZ'){
    let that = this;
    let bmap = require('./bmap-wx.min.js');
    let BMap = new bmap.BMapWX({
      ak
    });
    BMap.weather({
      success: function(data){
        console.log(data)
      }
    }); 
  },
  //百度地图获取定位
  getBmapLocation: function(ak = 'GoI7BxLpfvBEyf1TcMXCloi99Vov7flZ') {
    //定位
    let that = this;
    let bmap = require('./bmap-wx.min.js');
    let BMap = new bmap.BMapWX({
      ak
    });
    return new Promise((resolve, reject) => {
      BMap.regeocoding({
        success: function(data) {
          let addressInfo = data.originalData.result;
          let {
            lat: latitude,
            lng: longitude
          } = addressInfo.location;
          let {
            formatted_address
          } = addressInfo;
          //只返回需要的数据
          let locationInfo = {
            name: formatted_address,
            latitude,
            longitude,
            address: formatted_address,
          }
          //成功回调
          resolve(locationInfo)
        },
        fail: function(e) {
          console.log(e)
          //e.errMsg="为精确匹配"
				  
          if (e.errMsg.includes("auth")){
            reject(e)
            return;
          };
          if (e.errMsg.includes("domain")) {
            wx.showModal({
              title: "获取定位失败",
              content: `请在小程序公众平台添加百度域名api.map.baidu.com`,
              showCancel: false
            })
            return;
          }
          if (e.errMsg.includes("Referer")) {
            wx.showModal({
              title: "获取定位失败",
              content: `登录百度开放平台给ak添加白名单`,
              showCancel: false
            })
            return;
          }
          util.showModal(e.errMsg)
        }
      })
    })
  },
  //授权失败提示
  authFail(msg = "需要的") {
    //是否有设置页面,有提示跳转设置页面,没有则提示用小程序自带的
    let haveSetupPage = false;
    if (haveSetupPage) {
      wx.showModal({
        title: '未授权',
        content: `为保证功能正常使用,需打开${msg}权限，去开启?`,
        showCancel: true,
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/common/auth/auth?openType=openSetting',
            })
          }
        }
      })
      return;
    }
    wx.showModal({
      title: '未授权',
      content: `为保证功能正常使用,点击「右上角」-「关于**」-「右上角」-「设置」,打开${msg}权限后重试`,
      showCancel: false,
    })

  },
  //网络错误提示
  networkError(e) {
    //定义网络错误码
    const netMessage = {
      "0": "网络异常",
      "1": "请求超时",
      "500": "服务器错误",
      "404": "请求地址错误"
    }
    let msg =netMessage[e.status];
    if (e.message.includes('domain')){
      let url=e.request.url;
      msg = `小程序公众平台未添加域名${this.getHostname(url)}`;
      this.showModal(msg) 
      return;
    }
    this.showFail(msg)
  },
  /* 打开提示信息 */
  showModal(content = "服务器在调试~") {
    wx.showModal({
      title: "提示",
      content,
      showCancel: false
    })
  },
  showLoading(title = "加载中") {
    wx.showLoading({
      title,
      mask: true
    })
  },
  showSuccess(title = "操作成功") {
    wx.showToast({
      title,
    })
  },
  showFail(title = "操作失败") {
    wx.showToast({
      title,
      icon: 'none'
    })
  },
  hideLoading() {
    wx.hideLoading()
  },
  /* 隐藏所有提示信息 */
  hideAll() {
    wx.hideLoading();
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading();
  },

  //获取标签上data
  getData(e) {
    return e.currentTarget.dataset
  },
  //获表单控件值
  getValue(e) {
    return e.detail.value
  },
  //跳转
  goUrl(url, method = "navigateTo") {
    if (!url) {
      return;
    }
    //拨打电话
    if (url.indexOf('tel:') > -1) {
      wx.makePhoneCall({
        phoneNumber: url.split(':')[1],
      })
      return;
    }
    //网页跳转
    if (url.indexOf('http') > -1) {
      url = encodeURIComponent(url)
      wx.navigateTo({
        url: `/pages/common/webview/webview?url=${url}`,
      })
      return;
    }
    //小程序跳转
    if (url.indexOf('wx') == 0) {
      var appIdData, pathData = '',
        envVersionData = 'release';

      var urlArr = url.split(':');
      if (urlArr.length == 1) {
        appIdData = urlArr[0];
      } else if (urlArr.length == 2) {
        appIdData = urlArr[0];
        pathData = urlArr[1];
      } else if (urlArr.length == 3) {
        appIdData = urlArr[0];
        pathData = urlArr[1];
        envVersionData = urlArr[2];
      }

      wx.navigateToMiniProgram({
        appId: appIdData,
        path: pathData,
        extraData: {
          lb: 'longbing'
        },
        envVersion: envVersionData,
        success(res) {
          // 打开成功
        }
      })


      return;
    }
    //正常页面跳转
    wx[method]({
      url
    })
  },

  //格式化参数对象
  setOptions(o) {
    return encodeURIComponent(JSON.stringify(o))
  },
  //解析参数对象
  getOptions(o) {
    return JSON.parse(decodeURIComponent(o))
  },
  //获取页面对象，0时为当前页面
  getPage(index = 0) {
    let pages = getCurrentPages();
    let page = pages[pages.length - 1 + index]
    return page
  },
  //发起支付
  pay(orderInfo) {
    let that = this;
    return new Promise((resove, reject) => {
      wx.requestPayment({
        timeStamp: orderInfo.timeStamp,
        nonceStr: orderInfo.nonceStr,
        'package': orderInfo.package,
        signType: orderInfo.signType,
        paySign: orderInfo.paySign,
        success: function(res) {
          resove(true)
        },
        fail: function(res) {
          that.showFail("支付失败")
        },
        complete: function(res) {
          console.log(res)
        },
      })
    })
  },
  //深拷贝
  deepCopy(o) {
    let that = this;
    if (o instanceof Array) {
      var n = [];
      for (var i = 0; i < o.length; ++i) {
        n[i] = that.deepCopy(o[i]);
      }
      return n;
    } else if (o instanceof Function) {
      var n = new Function("return " + o.toString())();
      return n
    } else if (o instanceof Object) {
      var n = {}
      for (var i in o) {
        n[i] = that.deepCopy(o[i]);
      }
      return n;
    } else {
      return o;
    }
  },

  //获取数组中的id字符串,以逗号隔开
  getIds: function(o) {
    let ids = [];
    o = o || [];
    o.forEach((item) => {
      ids.push(item.id)
    })
    return ids.join(',');
  },
  //查询某个字符在字符串的位置
  searchSubStr: function(str, subStr) {
    let positions = [];
    let pos = str.indexOf(subStr);
    while (pos > -1) {
      positions.push(pos);
      pos = str.indexOf(subStr, pos + 1);
    }
    return positions
  },
  //将一个数组根据规则分为两个
  partition: function(arr, isValid) {
    arr.reduce(
      ([pass, fail], elem) =>
      isValid(elem) ? [
        [...pass, elem], fail
      ] : [pass, [...fail, elem]], [
        [],
        []
      ],
    )
  },
  /*
   * 获取链接某个参数
   * url 链接地址
   * name 参数名称
   */
  getUrlParam: function(url, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象  
    var r = url.split('?')[1].match(reg); //匹配目标参数  
    if (r != null) return unescape(r[2]);
    return null; //返回参数值  
  },
  /*
   * 格式化扫码二维码的参数scene例如a=1&b=2转化为对象{a:1,b:2}
   * param 参数scene
   */
  getSceneParam: function(param) {
    if (!param) return {};
    let paramArr = param.split('&');
    let paramObj = {};
    for (let item of paramArr) {
      let sp = item.split("=")
      paramObj[sp[0]] = sp[1]
    }
    return paramObj
  },
  /**
   * @desc 函数防抖
   * @param func 函数
   * @param wait 延迟执行毫秒数
   * @param immediate true 表立即执行，false 表非立即执行
   */
  debounce: function(func, wait, immediate) {
    var timeout = null;
    return function() {
      var context = this;
      var args = arguments;

      if (timeout) clearTimeout(timeout);
      if (immediate) {
        let callNow = !timeout;
        timeout = setTimeout(function() {
          timeout = null;
        }, wait)
        if (callNow) func.apply(context, args)
      } else {
        timeout = setTimeout(function() {
          func.apply(context, args)
        }, wait);
      }
    }
  },
  /**
   * @desc 函数节流
   * @param func 函数
   * @param wait 延迟执行毫秒数
   * @param type 1 表时间戳版，2 表定时器版
   */
  throttle(func, wait, type) {
    if (type === 1) {
      var previous = 0;
    } else if (type === 2) {
      var timeout;
    }

    return function() {
      var context = this;
      var args = arguments;
      if (type === 1) {
        var now = Date.now();

        if (now - previous > wait) {
          func.apply(context, args);
          previous = now;
        }
      } else if (type === 2) {
        if (!timeout) {
          timeout = setTimeout(function() {
            timeout = null;
            func.apply(context, args)
          }, wait)
        }
      }

    }
  },
  async noCardTip() {
    let {
      confirm
    } = await wx.pro.showModal({
      title: "提示",
      content: "你还没有名片",
      confirmText: "去创建"
    })
    if (!confirm) return;
    this.goUrl('/pages/card/add/add')
  },
  getHostname(url) {
    var reg = /^http(s)?:\/\/(.*?)\//
    // 必须是http开头或者https开头，结尾为'/'
    var ToReplace = 'Host/'
    url.replace(reg, ToReplace)
    url = reg.exec(url)[2];
    return url;
  },
  getPageConfig(configInfo,arr=[]){
    let pageConfig={};
    for(let i in arr){
      let key=arr[i]
      pageConfig[key] = configInfo[key]
    }
    return pageConfig
  },
}