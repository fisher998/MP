import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime


Page({
  data: {

  },
  goUrl: function(e) {
    let {
      url
    } = util.getData(e);
    util.goUrl(url)
  },
})