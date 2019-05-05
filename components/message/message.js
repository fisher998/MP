// components/message/message.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    count: {
      type: Number,
      value: 0
    },
    bottom: {
      type: Number,
      value: 25
    },
    info: {
      type: Object
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
    goUrl(e) {
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url,
      })
    }
  }
})