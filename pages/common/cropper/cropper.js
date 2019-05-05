/**
 * Created by sail on 2017/6/1.
 */
import WeCropper from '../../../plugin/we-cropper/we-cropper.js'


import util from '../../../utils/index.js';
import {
  fileModel
} from '../../../apis/index.js'
Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      scale: 2.5,
      zoom: 8,
      cut: ''
    }
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    let {
      key
    } = this.data;
		
    //上传裁剪后的图片
    this.wecropper.getCropperImage((src) => {
			console.log(src)
      util.showLoading()
      fileModel.upload({
        filePath: src
      }).then((d) => {
        util.hideAll();
        let path = d;
        let pages = getCurrentPages();
        let prePage = pages[pages.length - 2]
        prePage.handerImageChange(key, path);
        wx.navigateBack({
          delta: 1
        })
      })
    })
  },
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值
        console.log(res)
        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad(option) {
    let self = this

		let {
			ratio,
			src,
			key
		} = option;
		self.setData({
			key: key || ''
		})
		let device = wx.getSystemInfoSync();
		let width = device.windowWidth;
		let height = device.windowHeight - 50;
		ratio = ratio||1;
		let cut = {
			x: width * 0.1,
			y: (height - width * 0.8 * ratio) / 2,
			width: width * 0.8,
			height: width * 0.8 * ratio
		}
		this.setData({
			'cropperOpt.width': width,
			'cropperOpt.height': height,
			'cropperOpt.cut': cut
		})
    const {
      cropperOpt
    } = this.data

    
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        //console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        //console.log(`before picture loaded, i can do something`)
        //console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        //console.log(`picture loaded`)
        //console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        //console.log(`before canvas draw,i can do something`)
        //console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()

    //自定义图片
    if (src) {
		
      self.wecropper.pushOrign(src)
    }
  }
})