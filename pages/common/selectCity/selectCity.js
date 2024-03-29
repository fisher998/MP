var tagStyle = '\n  font-size: 14px;\n  margin-top: 10px;\n  border-radius: 4px;\n  color: #666;\n  background-color:#fff;\n  border:1px solid #f1f1f1;\n  line-height:35px;\n  text-align:center;\n  ';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    list: [{
      index: 'A',
      items: [{ name: '鞍山' }, { name: '安庆' }, { name: '安阳' }, { name: '安康' }, { name: '安丘' }, { name: '安顺' }, { name: '阿克苏' }, { name: '阿拉尔' }, { name: '阿拉善盟' }, { name: '安化' }, { name: '安吉' }]
    }, {
      index: 'B',
      items: [{ name: '北京' }, { name: '保定' }, { name: '包头' }, { name: '宝鸡' }, { name: '蚌埠' }, { name: '滨州' }, { name: '亳州' }, { name: '白城' }, { name: '百色' }, { name: '白山' }, { name: '白银' }]
    }, {
      index: 'C',
      items: [{ name: '成都' }, { name: '重庆' }, { name: '长春' }, { name: '长沙' }, { name: '沧州' }, { name: '常德' }, { name: '常熟' }, { name: '长治' }, { name: '承德' }, { name: '郴州' }, { name: '赤峰' }]
    }, {
      index: 'D',
      items: [{ name: '大连' }, { name: '东莞' }, { name: '大庆' }, { name: '大同' }, { name: '丹东' }, { name: '达州' }, { name: '德阳' }, { name: '德州' }, { name: '东营' }, { name: '大丰' }, { name: '大理' }]
    }, {
      index: 'E',
      items: [{ name: '鄂尔多斯' }, { name: '恩平' }, { name: '恩施' }, { name: '鄂州' }, { name: '峨眉山' }, { name: '额尔古纳' }]
    }, {
      index: 'F',
      items: [{ name: '佛山' }, { name: '福州' }, { name: '抚顺' }, { name: '阜阳' }, { name: '抚州' }, { name: '肥城' }, { name: '奉化' }, { name: '丰城' }, { name: '肥乡' }, { name: '凤城' }, { name: '封丘' }]
    }, {
      index: 'G',
      items: [{ name: '广州' }, { name: '贵阳' }, { name: '赣州' }, { name: '贵港' }, { name: '桂林' }, { name: '高碑店' }, { name: '高密' }, { name: '巩义' }, { name: '广安' }, { name: '广元' }, { name: '盖州' }]
    }, {
      index: 'H',
      items: [{ name: '杭州' }, { name: '哈尔滨' }, { name: '合肥' }, { name: '海口' }, { name: '邯郸' }, { name: '衡阳' }, { name: '淮安' }, { name: '呼和浩特' }, { name: '惠州' }, { name: '湖州' }, { name: '衡水' }]
    }, {
      index: 'J',
      items: [{ name: '济南' }, { name: '江门' }, { name: '江阴' }, { name: '嘉兴' }, { name: '吉林' }, { name: '荆州' }, { name: '金华' }, { name: '济宁' }, { name: '佳木斯' }, { name: '焦作' }, { name: '揭阳' }]
    }, {
      index: 'K',
      items: [{ name: '昆明' }, { name: '昆山' }, { name: '开封' }, { name: '开化' }, { name: '开阳' }, { name: '库车' }, { name: '奎屯' }, { name: '库尔勒' }, { name: '开平' }, { name: '克州' }, { name: '克拉玛依' }]
    }, {
      index: 'L',
      items: [{ name: '兰州' }, { name: '连云港' }, { name: '临析' }, { name: '柳州' }, { name: '洛阳' }, { name: '廊坊' }, { name: '拉萨' }, { name: '乐山' }, { name: '聊城' }, { name: '辽阳' }, { name: '临汾' }]
    }, {
      index: 'M',
      items: [{ name: '绵阳' }, { name: '马鞍山' }, { name: '牡丹江' }, { name: '眉山' }, { name: '茂名' }, { name: '梅州' }, { name: '麻城' }, { name: '满洲里' }, { name: '孟津' }, { name: '孟州' }, { name: '蒙阴' }]
    }, {
      index: 'N',
      items: [{ name: '南京' }, { name: '南宁' }, { name: '宁波' }, { name: '南通' }, { name: '南昌' }, { name: '南阳' }, { name: '南充' }, { name: '宁德' }, { name: '内江' }, { name: '宁海' }, { name: '南和' }]
    }, {
      index: 'P',
      items: [{ name: '莆田' }, { name: '盘锦' }, { name: '平顶山' }, { name: '濮阳' }, { name: '攀枝花' }, { name: '沛县' }, { name: '蓬莱' }, { name: '彭州' }, { name: '平度' }, { name: '平湖' }, { name: '平阳' }]
    }, {
      index: 'Q',
      items: [{ name: '青岛' }, { name: '秦皇岛' }, { name: '泉州' }, { name: '清远' }, { name: '齐齐哈尔' }, { name: '曲靖' }, { name: '衢州' }, { name: '迁安' }, { name: '潜江' }, { name: '庆阳' }, { name: '青州' }]
    }, {
      index: 'R',
      items: [{ name: '日照' }, { name: '荣成' }, { name: '如东' }, { name: '瑞安' }, { name: '乳山' }, { name: '汝州' }, { name: '仁怀' }, { name: '任丘' }, { name: '仁寿' }, { name: '瑞昌' }, { name: '瑞金' }]
    }, {
      index: 'S',
      items: [{ name: '上海' }, { name: '深圳' }, { name: '沈阳' }, { name: '石家庄' }, { name: '苏州' }, { name: '三亚' }, { name: '汕头' }, { name: '绍兴' }, { name: '商丘' }, { name: '上饶' }, { name: '韶关' }]
    }, {
      index: 'T',
      items: [{ name: '天津' }, { name: '太原' }, { name: '泰州' }, { name: '台州' }, { name: '唐山' }, { name: '泰安' }, { name: '太仓' }, { name: '桐乡' }, { name: '泰山' }, { name: '天水' }, { name: '滕州' }]
    }, {
      index: 'W',
      items: [{ name: '武汉' }, { name: '温州' }, { name: '无锡' }, { name: '潍坊' }, { name: '威海' }, { name: '芜湖' }, { name: '乌鲁木齐' }, { name: '渭南' }, { name: '温岭' }, { name: '吴江' }, { name: '万州' }]
    }, {
      index: 'X',
      items: [{ name: '西安' }, { name: '厦门' }, { name: '襄阳' }, { name: '徐州' }, { name: '咸阳' }, { name: '孝感' }, { name: '湘潭' }, { name: '邢台' }, { name: '西宁' }, { name: '信阳' }, { name: '许昌' }]
    }, {
      index: 'Y',
      items: [{ name: '盐城' }, { name: '扬州' }, { name: '烟台' }, { name: '宜昌' }, { name: '银川' }, { name: '岳阳' }, { name: '阳江' }, { name: '宜宾' }, { name: '营口' }, { name: '宜春' }, { name: '义乌' }]
    }, {
      index: 'Z',
      items: [{ name: '郑州' }, { name: '湛江' }, { name: '镇江' }, { name: '中山' }, { name: '珠海' }, { name: '株洲' }, { name: '枣庄' }, { name: '淄博' }, { name: '张家口' }, { name: '漳州' }, { name: '周口' }]
    }],
    tagsData: [{
      text: '广州',
      tagStyle: tagStyle
    }, {
      text: '上海',
      tagStyle: tagStyle
    }, {
      text: '成都',
      tagStyle: tagStyle
    }, {
      text: '深圳',
      tagStyle: tagStyle
    }, {
      text: '杭州',
      tagStyle: tagStyle
    }, {
      text: '郑州',
      tagStyle: tagStyle
    }, {
      text: '西安',
      tagStyle: tagStyle
    }, {
      text: '南京',
      tagStyle: tagStyle
    }, {
      text: '武汉',
      tagStyle: tagStyle
    }, {
      text: '深圳',
      tagStyle: tagStyle
    }, {
      text: '杭州',
      tagStyle: tagStyle
    }, {
      text: '郑州',
      tagStyle: tagStyle
    }],
    alpha: '',
    place: '北京',
    search: '输入城市名或拼音查询',
    country: '',
    position: '定位中……',
    isTap: false

  },
  tapTag: function tapTag(e) {
    var city = e.currentTarget.dataset.city;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      country1: city
    });
    wx.navigateBack();
  },
  singleselect: function singleselect(msg) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      country1: msg.detail
    });
    wx.navigateBack();
  },
  positionTap: function positionTap() {
    if (this.data.isTap) {
      var place = this.data.position;
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1]; //当前页面
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        country1: this.data.position
      });
      wx.navigateBack();
    } else {
      return false;
    }
  },
  singleTap: function singleTap(e) {
    var index = e.detail.index;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      country1: this.data.tagsData[index].text
    });
    wx.navigateBack();
  },
  getPosition: function getPosition() {
    var _this = this;

    wx.request({
      url: 'https://apis.map.qq.com/ws/location/v1/ip',
      data: {
        key: 'RHGBZ-S2LAU-5MRV7-4QPTZ-JI25K-HVBDV'
      },
      success: function success(res) {
        console.log(res.data.result.ad_info.city);
        _this.setData({
          position: res.data.result.ad_info.city,
          isTap: true
        });
      }
    });
  },
  navigateBack: function navigateBack() {
    wx.navigateBack();
  },
  onLoad: function onLoad(options) {
    this.getPosition();
    console.log(options, 'options');
    this.setData({
      country: options.country || "",
      height: wx.getSystemInfoSync().windowHeight
    });
  },
  onReady: function onReady(options) {
    this.getPosition();
  }
})