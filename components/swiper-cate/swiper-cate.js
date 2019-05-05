import util from '../../utils/index.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
    //列
    colNum: {
      type: Number,
      value: 5
    },
    //行
    rowNum: {
      type: Number,
      value: 2
    },
    indicatorActiveColor: {
      type: String,
      value: '#28c24c'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handerScroll: function (e) {
      let { scrollLeft, scrollWidth } = e.detail;
      let windowWidth = wx.getSystemInfoSync().windowWidth
      this.setData({
        left: scrollLeft * 30 / (scrollWidth - windowWidth)
      })
    },
    goUrl: function (e) {
      let { url } = util.getData(e);
      util.goUrl(url)
    },
    categoryChange: function (e) {
      let current = e.detail.current;
      this.setData({
        current
      })
    }
  },
  observers: {
    'list': function (list) {
      let { colNum, rowNum } = this.properties;
      let newList = [];
      let index = 0;
      let length = list.length;
      while (index < length) {
        newList.push(list.slice(index, index += rowNum * colNum));
      }
      this.setData({
        newList
      })
    }
  },
  ready: function () {
    
  }
})
