var Fly = require("./wx.js") //wx.js为您下载的源码文件
var fly = new Fly; //创建fly实例
var tokenFly = new Fly();
import util from './index.js';
const regeneratorRuntime = util.regeneratorRuntime
import siteInfo from '../siteinfo.js';

// 打印站点信息siteInfo
let allSiteInfo = Object.assign({}, {
	time: "2019/4/26",
	version_app: "1.1.4/免费版本"
}, siteInfo)
console.log(allSiteInfo)


//添加finally方法,用于指定不管 Promise 对象最后状态如何，都会执行的操作
Promise.prototype.finally = function(callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => {
      throw reason
    })
  );
};
//定义构造请求地址函数
const isWq = true; //是否构造微擎地址
const formatUrl = function(url) {
  if (isWq) {
    let model_name = "longbing_cardcloud";
    url = `${siteInfo.siteroot}?i=${siteInfo.uniacid}&t=${siteInfo.multiid}&v=${siteInfo.version}&from=wxapp&c=entry&a=wxapp&do=api&m=${model_name}&s=${url}`;
    return url;
  } else {
    url = `${siteInfo.siteroot}?i=${siteInfo.uniacid}&s=${url}`;
    return url
  }
}
//阿里云地址转为本地域名的
const formatImageUrl = function(url) {
  if (url.indexOf(siteInfo.siteroot) > -1) {
    return url
  } else {
    return `${formatUrl("api/base_api/getImage")}/path/${encodeURIComponent(url)}`
  }
}

//登录
const login = async function() {
  let url = "api/mingpian_user/login"
  url = formatUrl(url)
	let token;
	util.showLoading("登录中...")
  try {
    let {code} = await wx.pro.login();
    let d = await tokenFly.post(url, { code});
		if (d.data.code != 0) {
			throw d;
		}
		//登录成功
		util.hideAll();
		let res= d.data.data;
		return res;
  } catch (e) {
		return await  Promise.reject(e);
  }
}

//绑定分销上下级
const bind=async function(){
	console.log("绑定分销")
	let url = "api/mingpian_user/save"
	url = formatUrl(url)
	let pid = wx.getStorageSync('pid')
	if (!pid) return;
	await fly.post(url, { pid })
	console.log("绑定分销成功")
}


//设置超时
fly.config.timeout = 10000;

//设置请求基地址

//给所有请求添加自定义header
fly.config.headers = tokenFly.config.headers = {
  "content-type": "application/x-www-form-urlencoded"
}

//添加请求拦截器
fly.interceptors.request.use((request) => {
  //添加验证token
  let { token, radar_token} = wx.getStorageSync('userInfo')||{};
	//首次登录验证
  if (!token || !radar_token){
		fly.lock()
		return login().then((res)=>{
      let { token,radar_token } = res;
			//保存token和将token动态加入header
			request.headers["token"] = token;
      request.headers["radartoken"] = radar_token;
			wx.setStorageSync("userInfo", res); //保存用户信息
			//绑定分销上下级
			bind()
		}).finally(()=>{
			//解锁后，会继续发起请求队列中的任务
			console.log("解锁")
			fly.unlock();
		}).then(()=>{
      return request; 
    })
	}else{
		request.headers["token"] = token;
    request.headers["radartoken"] = radar_token;
	}
  
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response) => {
    //token过期验证
    if (response.data.code == 401) {
      fly.lock()
			return login()
        .then((res) => {
          let { token, radar_token}=res;
					//保存token和将token动态加入header
          response.request.headers["token"] = token;
          response.request.headers["radartoken"] = radar_token;
					wx.setStorageSync("userInfo", res); //保存用户信息
					//绑定分销上下级
					bind()
        }).finally(() => {
          //解锁后，会继续发起请求队列中的任务
					console.log("解锁")
          fly.unlock();

        }).then(() => {
					console.log("重新发起请求")
          //只有最终返回request对象时，原来的请求才会继续
          return fly.request(response.request);
        })
    } else {
      return response;
    }

  },
  (err) => {
		//网络错误
		return err
  }
)

//统一处理请求,satus=200网络正常code=0服务器正常
const req = {
  async post(url, param) {
    //构造请求地址
    url = formatUrl(url);
	
		try{
			let res = await fly.post(url, param)
			//code!=0抛出错误
			let {code,msg}=res.data
			if (code !== 0) throw res
			return res.data.data
		}catch(e){
			console.log(e)
			//区分status!=200网络错误和后台返回错误
			util.hideAll(e.status)
			if (e.status!=200){
				util.networkError(e)
			}else{
				let {code,msg}=e.data
				if (code == -2) {
					let { confirm } = await wx.pro.showModal({
						title: '权限不足',
						content: msg,
						confirmText: "去开通"
					})
					if (confirm) util.goUrl('/pages/ucenter/member/member');
				}
				else if (code == 400) {
					let { confirm } = await wx.pro.showModal({
						title: '提示',
						content: msg,
						confirmText: "去创建"
					})
					if (confirm) util.goUrl('/pages/card/add/add');

				}
				else if (code == 402) {
					util.goUrl('/pages/common/disable/disable', "reLaunch")
				}
				else if (code == -3) {
					let { confirm } = await wx.pro.showModal({
						title: '提示',
						content: msg,
						showCancel: false,
						confirmText: '回到首页'
					})
					if (confirm) util.goUrl('/pages/card/index/index', "switchTab");
				}
				else{
					util.showModal(msg)
				}
			
			}
			return await Promise.reject(e);
		}
  }
}

// 定义上传,picture--代表图片 audio--音频 video--视频,默认picture
const uploadFile = async (url, {
	name = "file",
	filePath,
	formData = {
		type: "picture",
		uid: wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo').uid:""
	}
} = {}) => {
	url = formatUrl(url)
	try {
		let res = await wx.pro.uploadFile({ url, filePath: filePath, name, formData })

		//网络请求错误
		if (res.statusCode != 200) {
			throw res;
		}
		let data = JSON.parse(res.data)
	  //服务器提示错误
		if (data.code != 0) {
			throw res;
		}
		return data.data

	} catch (e) {

		util.hideAll()
		
		if (e.statusCode!=200){
			util.networkError(e.statusCode)
		}else{
      let data = JSON.parse(e.data)
      let { code, msg } = data
      if (code == -2) {
        let { confirm } = await wx.pro.showModal({
          title: '权限不足',
          content: msg,
          confirmText: "去开通"
        })
        if (confirm) util.goUrl('/pages/ucenter/member/member');
      }else{
        util.showFail(msg)
      }
      
		}
		return await Promise.reject(e);
	}
}

export {
  fly,
  req,
  uploadFile,
  formatImageUrl
}