import util from '../../utils/index.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object
    },
    nowPageIndex: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goUrl: function (e) {
      let {
        url,
        method
      } = util.getData(e);
      util.goUrl(url, method)
    }
  },
  ready: function () {
    let tabbar = this.properties.tabbar;
    let pages = getCurrentPages();
    let page = pages[pages.length - 1]
    let route = page.__route__
    let nowPageIndex=-1;
    for (let i in tabbar.list) {
      let item = tabbar.list[i]
      if (item.pagePath.includes(route)) {
        nowPageIndex = i
      }
    }
    console.log(nowPageIndex)
    this.setData({
      nowPageIndex
    })
  }
})