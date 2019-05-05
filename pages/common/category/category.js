import util from '../../../utils/index.js';
import { companyModel } from '../../../apis/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    let {key,id,pid,level}=options;

    let categoryList = util.getPage(-1).data[`${key}List`]
    let pIndex;
    pIndex = categoryList.findIndex((item) => {
      return item.id == pid
    })
    pIndex=pIndex > -1?pIndex:0
    
    that.setData({
      key,
      pIndex,
      id:id||0,
      level: level||2,
      categoryList,
      height: wx.getSystemInfoSync().windowHeight
    })
    
  },
  tabChange:function(e){
    let index=e.detail.index;
    this.setData({
      pIndex:index
    })
  },
  categoryChange: function (e) {
    let { index} = util.getData(e);
    let {key,level}=this.data;
    let { categoryList, pIndex } = this.data;

    let categoryInfo
    if (level==2){
      categoryInfo = categoryList[pIndex]._child[index];
    }else{
      categoryInfo = categoryList[index];
    }
    
    let { id, title, pid } = categoryInfo;
    let value = { id, title, pid}
    util.getPage(-1).handerCategoryChange(key, value)
    wx.navigateBack({
      delta: 1
    })

  },
})