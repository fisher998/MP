import util from '../../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  customerModel,
  radarModel
} from '../../../../apis/index.js';
import * as echarts from '../../../components/ec-canvas/echarts';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: "#21bf34",
    navBar: {
      type: 'back',
      color: '#22272c',
      text: '客户详情'
    },
    tabList: [{
      id: 1,
      title: "浏览记录",
      modelMethod: "getTimeList",
      param: {
        page: 1
      },
      list: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1,
        data: []
      }
    }, {
      id: 2,
      title: "跟进记录",
      modelMethod: "getFollowList",
      list: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1,
        data: []
      },
      param: {
        page: 1
      },
    }, {
      id: 3,
      title: "AI分析",
    }],
    tabActiveIndex: 0,
    loading: true,
    refresh: false,
    line: {
      lazyLoad: true
    },
    bar: {
      lazyLoad: true
    },
    pie: {
      lazyLoad: true
    },
    hidden: true

  },
  async onLoad(options) {
    let that = this;
    let { uid } = options
    that.setData({
      c_uid:uid
    })
    util.showLoading()
  },
  async onReady() {
    let rateList = [];
    for (let i = 0; i < 100; i++) {
      rateList.push(i + 1)
    }
    let pageConfig=util.getPageConfig(getApp().globalData.configInfo,["radar"])
    this.setData({
      rateList,
      pageConfig
    })

    this.getDetail();
    this.getList();
    
  },
  async getDetail() {
    let that = this;

    let c_uid = this.data.c_uid;
    let detail = await customerModel.getDetail({ c_uid})
    this.setData({
      detail
    })
    console.log("初始化图表")
    that.initPie();
    that.initLine();
    that.initBar();
    util.hideAll()
  },
  getNameData(arr) {
    let newArr = [];
    for (let i in arr) {
      newArr.push(arr[i].name)
    }
    return newArr
  },
  goUrl: function (e) {
    let {
      url,
      method
    } = util.getData(e)
    util.goUrl(url, method)
  },
  tabChange: function (e) {
    let that = this;
    let index = e.detail.index;
    let {
      tabList,
      line,
    } = this.data;
    this.setData({
      tabActiveIndex: index
    })
    if (index == 2) {
      if (line.src) return;

      return;
    }
    let length = tabList[index].list.data.length
    if (length <= 0) {
      this.setData({
        loading: true
      })
      this.getList();
    }

  },
  async handerDateChange(e) {
    let val = e.detail.value;
    let {
      u_card_id,
      id
    } = this.data.detail;
    util.showLoading();
    await customerModel.edit({
      deal_time: val,
      u_card_id,
      id
    })
    util.hideAll();
    this.setData({
      'detail.deal_time': val
    })
  },
  async handerRateChange(e) {
    let val = e.detail.value;
    let rateList = this.data.rateList;
    let {
      u_card_id,
      id
    } = this.data.detail;
    util.showLoading();
    await customerModel.edit({
      deal_rate: rateList[val],
      u_card_id,
      id
    })
    util.hideAll();
    this.setData({
      'detail.deal_rate': rateList[val]
    })
  },
  async changeStatus() {
    let {
      u_card_id,
      id
    } = this.data.detail;
    util.showLoading();
    await customerModel.edit({
      status: 3,
      u_card_id,
      id
    })
    util.hideAll();
    this.setData({
      'detail.status': 3
    })
  },
  async changeStar() {
    let {
      u_card_id,
      id,
      is_stra
    } = this.data.detail;
    util.showLoading();
    is_stra = is_stra == 1 ? 0 : 1;

    await customerModel.edit({
      is_stra,
      u_card_id,
      id
    })
    util.hideAll();
    this.setData({
      'detail.is_stra': is_stra
    })
  },
  //获取列表
  async getList() {
    let that = this;
    let {
      refresh,
      tabList,
      tabActiveIndex,
    } = this.data;
    if (tabActiveIndex == 2) return;
    let oldlist = tabList[tabActiveIndex].list;
    let param = tabList[tabActiveIndex].param;
    param = Object.assign({}, param, {c_uid:this.data.c_uid})
    let newlist = await customerModel[tabList[tabActiveIndex].modelMethod](param);
    util.hideAll()
    //如果刷新,则不加载老数据
    if (!refresh) {
      newlist.data = [...oldlist.data, ...newlist.data];
    }

    let key = `tabList[${tabActiveIndex}].list`
    that.setData({
      [key]: newlist,
      loading: false,
      refresh: false,
    })
  },
  //刷新
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      refresh: true,
      'param.page': 1,
    }, function () {
      wx.showNavigationBarLoading()
      that.getDetail();
      that.getList();
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let {
      loading,
      tabList,
      tabActiveIndex
    } = this.data;
    if (tabActiveIndex == 2) return;
    let {
      current_page,
      last_page
    } = tabList[tabActiveIndex].list;
    if (current_page != last_page && !loading) {
      let key = `tabList[${tabActiveIndex}].param.page`
      that.setData({
        [key]: current_page + 1,
        loading: true
      }, function () {
        that.getList();
      })
    }
  },
  initPie() {
    let that = this;
    let {
      interest: interestData
    } = this.data.detail;
    console.log(interestData)
    let option = {
      backgroundColor: "#ffffff",
      color: ["#f9bc02", "#2ed22c", "#41aeff"],
      title: {
        text: "客户兴趣占比",
        left: "center",
        padding: 20
      },
      legend: {
        top: "90%",
        data: this.getNameData(interestData)
      },

      series: [{
        name: '访问来源',
        type: 'pie',
        radius: ['30%', '50%'],
        avoidLabelOverlap: true,
        silent: false,
        label: {
          normal: {
            show: true,
            formatter: '{d}%',
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '14'
            }
          }
        },
        labelLine: {
          normal: {
            show: true
          }
        },
        data: interestData
      }]
    };
    let pie = this.selectComponent('#mychart-dom-pie')

    pie.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表

      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      chart.setOption(option);
      let {
        windowWidth
      } = wx.getSystemInfoSync();

      chart.on('finished', function () {
        pie.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: windowWidth,
          height: windowWidth,
          destWidth: windowWidth * 2,
          destHeight: windowWidth * 2,
          canvasId: 'mychart-pie',
          fileType: 'jpg',
          success(res) {
            let {
              tempFilePath
            } = res;
            that.setData({
              'pie.src': tempFilePath,
            })
          },
          complete(res) {
          }
        })
      })

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;

    });
  },
  initBar() {
    let {
      hudong: interactionData
    } = this.data.detail;
    let option = {
      backgroundColor: "#ffffff",
      color: ['#2ed22c'],
      barWidth: 12,
      title: {
        text: "客户与我的互动",
        left: "center",
        padding: 20
      },
      grid: {
        left: 14,
        height: "78%",
        containLabel: true
      },
      xAxis: [{
        type: 'value',
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#e7e7e7'
          }
        },
        axisLabel: {
          color: '#969696'
        }
      }],
      yAxis: [{
        type: 'category',
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        data: this.getNameData(interactionData),
        axisLine: {
          lineStyle: {
            color: '#e7e7e7'
          }
        },
        axisLabel: {
          color: '#969696'
        }
      }],
      series: [{
        name: '活跃度',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data: interactionData
      }]
    };
    let that = this;
    let bar = this.selectComponent('#mychart-dom-bar')
    bar.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表

      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      chart.setOption(option);
      let {
        windowWidth
      } = wx.getSystemInfoSync();
      chart.on('finished', function () {
        bar.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: windowWidth,
          height: windowWidth,
          destWidth: windowWidth * 2,
          destHeight: windowWidth * 2,
          canvasId: 'mychart-bar',
          fileType: 'jpg',
          success(res) {
            let {
              tempFilePath
            } = res;
            that.setData({
              'bar.src': tempFilePath,
            })
          }
        })

      })

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  initLine() {
    let {
      active: activeData
    } = this.data.detail;
    let that = this;
    let option = {
      backgroundColor: "#ffffff",
      color: "#2ed22c",
      title: {
        text: "近15日客户活跃度",
        left: "center",
        padding: 20
      },
      grid: {
        left: '3%',
        right: '6%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.getNameData(activeData),
        axisLine: {
          lineStyle: {
            color: '#e7e7e7'
          }
        },
        axisLabel: {
          color: '#969696'
        },
        splitLine: {
          lineStyle: {
            color: '#e7e7e7'
          }
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#e7e7e7'
          }
        },
        axisLabel: {
          color: '#969696'
        },
        splitLine: {
          lineStyle: {
            color: '#e7e7e7'
          }
        },
      },
      series: [{
        data: activeData,
        type: 'line'
      }]
    };
    let line = this.selectComponent('#mychart-dom-line');
    line.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表

      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      chart.setOption(option);
      let {
        windowWidth
      } = wx.getSystemInfoSync();

      chart.on('finished', function () {
        line.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: windowWidth,
          height: windowWidth,
          destWidth: windowWidth * 2,
          destHeight: windowWidth * 2,
          canvasId: 'mychart-line',
          fileType: 'jpg',
          success(res) {
            let {
              tempFilePath
            } = res;
            that.setData({
              'line.src': tempFilePath,
            })
          }
        })

      })
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  copy(e) {
    console.log(e);
    let {
      str
    } = util.getData(e)
    wx.setClipboardData({
      data: str,
      success: function (res) {
        util.showSuccess("复制成功")
      }
    })
  },
  call() {
    let phoneNumber = this.data.detail.tel
    wx.makePhoneCall({
      phoneNumber
    })
  }
})