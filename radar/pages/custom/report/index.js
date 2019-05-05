import util from '../../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  customerModel
} from '../../../../apis/index.js';
import * as echarts from '../../../components/ec-canvas/echarts';

Page({
  data: {
    line: {
      lazyLoad: true
    },
    bar: {
      lazyLoad: true
    },
    pie: {
      lazyLoad: true
    },
    segmentList: [{
      id: 0,
      title: "汇总"
    }, {
      id: 1,
      title: "昨日"
    }, {
      id: 2,
      title: "近七天"
    }, {
      id: 3,
      title: "近三十天"
    }],
    segmentIndex: 0
  },

  async onLoad(options) {
    let that = this;

    that.setData({
      options
    })
     util.showLoading()
  },
  async onReady() {
    let param = {
      day: 0
    }
    this.setData({
      param
    })

    this.getDetail();
  },
  async getDetail() {
    let that = this;

    let param = this.data.param;
    let detail = await customerModel.getAiReport(param)
    this.setData({
      detail
    },function(){
      util.hideAll();
      console.log("初始化图表")
      that.initPie();
      that.initLine();
      that.initBar();
    })
   

  },
  //刷新
  onPullDownRefresh: function() {
    let that = this;
    that.setData({
      refresh: true,
    }, function() {
      wx.showNavigationBarLoading()
      that.getDetail();
    })
  },
  segmentChange: function(e) {
    let index = e.detail.index;
    this.setData({
      segmentIndex: index,
      'param.day': index
    })
    this.onPullDownRefresh();
  },
  getNameData(arr) {
    let newArr = [];
    for (let i in arr) {
      newArr.push(arr[i].name)
    }
    return newArr
  },
  initPie() {
    let that = this;
    let {
      interest: interestData
    } = this.data.detail;
    let option = {
      backgroundColor: "#fff",
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
        animation:false,
        radius: ['30%', '50%'],
        avoidLabelOverlap: true,
        silent: true,
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

      // chart.on('finished', function() {
      //   pie.canvasToTempFilePath({
      //     x: 0,
      //     y: 0,
      //     width: windowWidth,
      //     height: windowWidth,
      //     destWidth: windowWidth * 2,
      //     destHeight: windowWidth * 2,
      //     canvasId: 'mychart-pie',
      //     fileType: 'jpg',
      //     success(res) {
      //       let {
      //         tempFilePath
      //       } = res;
      //       that.setData({
      //         'pie.src': tempFilePath,
      //       })
      //       util.hideAll()
      //     },
      //     complete(res) {}
      //   })
      // })

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
      // chart.on('finished', function() {
      //   bar.canvasToTempFilePath({
      //     x: 0,
      //     y: 0,
      //     width: windowWidth,
      //     height: windowWidth,
      //     destWidth: windowWidth * 2,
      //     destHeight: windowWidth * 2,
      //     canvasId: 'mychart-bar',
      //     fileType: 'jpg',
      //     success(res) {
      //       let {
      //         tempFilePath
      //       } = res;
      //       that.setData({
      //         'bar.src': tempFilePath,
      //       })
      //     }
      //   })

      // })

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

      // chart.on('finished', function() {
      //   line.canvasToTempFilePath({
      //     x: 0,
      //     y: 0,
      //     width: windowWidth,
      //     height: windowWidth,
      //     destWidth: windowWidth * 2,
      //     destHeight: windowWidth * 2,
      //     canvasId: 'mychart-line',
      //     fileType: 'jpg',
      //     success(res) {
      //       let {
      //         tempFilePath
      //       } = res;
      //       that.setData({
      //         'line.src': tempFilePath,
      //       })
      //     }
      //   })

      // })
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  //滚动
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  }
});