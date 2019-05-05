Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    tabBar: getApp().globalData.tabBar,
    nowPageIndex:-1
  },
  methods: {
    switchTab(e) {
      const url = e.currentTarget.dataset.url
      wx.switchTab({
        url
      })
    }
  },
  ready() {
    let that = this;
    let tabBar = getApp().globalData.tabBar;
    let pages = getCurrentPages();
    let page = pages[pages.length - 1]
    let route = page.__route__
    let nowPageIndex = -1;
    for (let i in tabBar.list) {
      let item = tabBar.list[i]
      if (item.pagePath.includes(route)) {
        nowPageIndex = i
      }
    }
    that.setData({
      tabBar,
      nowPageIndex
    })
  },
  pageLifetimes: {},
})