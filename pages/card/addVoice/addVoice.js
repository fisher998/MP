import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
  fileModel,
  cardModel
} from '../../../apis/index.js'
const recorderManager = wx.getRecorderManager();
var innerAudioContext;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    start: false,
    tempFilePath: "",
    play: false,
    duration: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let that = this;
    let {
      scene
    } = options
    scene = scene || 2
    //初始化信息
    innerAudioContext = wx.createInnerAudioContext()
    let {
      voice_path,
      voice_long,
      person_avatar,
      person_avatar_thumb
    } = scene == 1 ? util.getPage(-1).data.userInfo : util.getPage(-1).data.form;
    innerAudioContext.src = voice_path || "";

    that.setData({
      scene,
      duration: voice_long || 0,
      tempFilePath: voice_path || "",
      person_avatar: person_avatar || "",
      person_avatar_thumb: person_avatar_thumb || "",

    })
    //开始录音
    recorderManager.onStart(() => {
      console.log('开始录音')
      that.setData({
        start: true,
      })
    })
    //结束录音
    recorderManager.onStop((res) => {
      console.log(res)
      console.log('结束录音')
      const {
        tempFilePath,
        duration
      } = res;
      that.setData({
        start: false,
        tempFilePath,
        duration: (duration / 1000).toFixed()
      })
      innerAudioContext.src = tempFilePath;

    })
    //录音异常
    recorderManager.onError((e) => {
      console.log('录音异常')
			this.setData({
				settingShow: e.errMsg.includes('auth')
			})
    })
    //开始播放
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.setData({
        play: true
      })
    })
    //结束播放
    innerAudioContext.onStop((res) => {
      console.log('结束播放')
      that.setData({
        play: false
      })
    })
    //自然结束播放
    innerAudioContext.onEnded((res) => {
      console.log('结束播放')
      that.setData({
        play: false
      })
    })
  },
  onUnload: function() {
    innerAudioContext.destroy()
  },
  //开始录音
  async start(e) {
    let {
      start,
      play
    } = this.data

    if (play) {
      wx.showToast({
        title: '正在播放语音',
        icon: "none"
      })
      return;
    }
    const options = {
     
    }
    recorderManager.start(options)
  },
  //停止录音
  end: function(e) {
    recorderManager.stop()
  },
  //播放语音
  play: function() {
    let {
      start,
      play,
      tempFilePath
    } = this.data
    if (!tempFilePath) {
      wx.showToast({
        title: '还没有语音!',
        icon: "none"
      })
      return;
    }
    if (start) {
      wx.showToast({
        title: '正在录音',
        icon: "none"
      })
      return;
    }

    if (play) {
      innerAudioContext.stop()
    } else {
      innerAudioContext.play()
    }

  },
  //提交保存录音
  async submit() {
    let {
      tempFilePath: filePath,
      duration,
      scene
    } = this.data;
    if (!filePath) {
      util.showModal("你还没进行录音")
      return;
    }
    let voice_path = filePath;
    let voice_long = duration;
    //判断是否为临时路径，临时路劲需要上传
    if (filePath.indexOf('wxfile') > -1) {
      util.showLoading();
      let info = await fileModel.upload({
        filePath,
        formData: {
          type: "audio"
        }
      })
      voice_path = info.src;
      util.hideAll();
    }
    let param = {
      voice_path,
      voice_long
    }
    cardModel.add(param).then((d) => {
      util.hideAll();
      util.showSuccess("保存成功")
      getApp().getUserInfo(true).then(() => {
        if (scene == 2){
          util.getPage(-1).setFormValue('voice_path', voice_path)
          util.getPage(-1).setFormValue('voice_long', voice_long)
        }
        wx.navigateBack({
          delta: 1
        })
      })
    })
  }

})