import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  formatImageUrl
} from '../../../utils/req.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onReady() {
    let that = this;
    util.showLoading();
    let getUserInfo = getApp().getUserInfo()
    let getConfigInfo = getApp().getConfigInfo();

    let {
      card: userInfo
    } = await getUserInfo
    let {
      tech_support
    } = await getConfigInfo
    let {
      forword_words
    } = await getApp().getConfigInfo()
    let {
      person_avatar_thumb,
      name,
      company_name,
      tel,
      email,
      mini_address,
      position,
      qrcode
    } = userInfo
    let format_person_avatar_thumb = formatImageUrl(person_avatar_thumb)
    let format_tech_support = util.isEmpty(tech_support) ? "" : formatImageUrl(tech_support[0].path);
    let format_qrcode = formatImageUrl(qrcode)
    let template = {
      background: "/images/card/poster-bg.jpg",
      width: '750rpx',
      height: '970rpx',
      views: [

        {
          type: 'image',
          url: format_person_avatar_thumb,
          css: {
            top: '95rpx',
            left: '82rpx',
            width: '88rpx',
            height: '88rpx',
            borderRadius: '88rpx'
          }
        },
        {
          type: 'text',
          text: name,
          css: {
            width: '400rpx',
            maxLines: 1,
            left: '200rpx',
            top: '104rpx',
            fontSize: '32rpx',
            color: "#000000"
          }
        },
        {
          type: 'text',
          text: `${position}`,
          css: {
            width: '400rpx',
            maxLines: 1,
            left: '200rpx',
            top: '146rpx',
            fontSize: '24rpx',
            color: "#888888"
          }
        },
        {
          type: 'text',
          text: tel,
          css: {
            width: '600rpx',
            maxLines: 1,
            left: '82rpx',
            top: '260rpx',
            fontSize: '24rpx',
            color: "#888888"
          }
        },
        {
          type: 'text',
          text: company_name,
          css: {
            width: '600rpx',
            maxLines: 1,
            left: '82rpx',
            top: '310rpx',
            fontSize: '24rpx',
            color: "#888888"
          }
        },
        {
          type: 'text',
          text: mini_address,
          css: {
            width: '600rpx',
            maxLines: 1,
            left: '82rpx',
            top: '360rpx',
            fontSize: '24rpx',
            color: "#888888"
          }
        },
        {
          type: 'image',
          url: format_qrcode,
          css: {
            top: '520rpx',
            left: '66rpx',
            width: '220rpx',
            height: '220rpx',
            borderRadius: '110rpx'
          }
        },
        {
          type: 'image',
          url: format_tech_support,
          css: {
            top: '830rpx',
            left: '245rpx',
            width: '260rpx',
            height: '120rpx'
          }
        }
      ]
    }
    that.setData({
      template,
      forword_words,
      userInfo
    })

  },
  onImgOK: function(e) {
    util.hideAll();
    let imagePath = e.detail.path;
    this.setData({
      imagePath
    })
  },
  previewImage: function() {
    let imagePath = this.data.imagePath
    wx.previewImage({
      urls: [imagePath],
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let {
      name,
      uid,
      person_avatar
    } = this.data.userInfo;
    let forword_words = this.data.forword_words || "你好,我是&&name&&,邀你30秒免费做名片,相互收藏"
    forword_words = forword_words.replace(/&&name&&/g, name)
    console.log(`/pages/card/home/home?uid=${uid}`)
    return {
      title: forword_words,
      path: `/pages/card/home/home?uid=${uid}`,
      imageUrl: person_avatar
    }
  },
  async save(e) {
    let that = this;
    let filePath = that.data.imagePath;
    await wx.pro.saveImageToPhotosAlbum(filePath).then((d) => {
      util.showSuccess("保存成功")
    }).catch((e) => {
      that.setData({
        settingShow: e.errMsg.includes('auth')
      })
    })
  }
})