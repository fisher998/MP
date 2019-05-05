import util from '../../../utils/index.js';
const regeneratorRuntime = util.regeneratorRuntime
import {
	groupModel
} from '../../../apis/index.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    form:{
			id:0,
			name:'',
			logo: [],
			desc: '',
			category: '',
		},
		

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let { edit, back } = options;
		back = back||1;
		this.setData({
			back
		})
		if(edit==1){
      this.getDetail();
			wx.setNavigationBarTitle({
				title: '编辑群名片'
			})
		}else{
			this.firstLoad();
		}
    
	},
	async getDetail(){
		let getConfigInfo = getApp().getConfigInfo()
		let { group_category } = await getConfigInfo;
		let form = util.getPage(-1).data.detail;
		this.setData({
			group_category,
			form
		})
	},
	async firstLoad(){
		util.showLoading();
		let getConfigInfo=getApp().getConfigInfo()
		let getUserInfo = getApp().getUserInfo()
		let { group_category } = await getConfigInfo;
		let { card: userInfo } = await getUserInfo
		let { name, person_avatar, person_avatar_thumb } = userInfo
		this.setData({
			group_category,
			'form.name': `${name}的群`,
			// 'form.logo': person_avatar,
			// 'form.logo_thumb': person_avatar_thumb
		})
		util.hideAll();
	},
	//跳转
	goUrl: function (e) {
		let { url } = util.getData(e);
		util.goUrl(url)
	},
	//设置表单值
	setFormValue: function (key, value) {
		key = `form.${key}`;
		this.setData({
			[key]: value
		})
	},
	//标签变化
	handerCategoryChange:function(e){
		let {val}=util.getData(e)
		this.setFormValue("category", val)
	},
	//输入值变化
	handerInputChange: function (e) {
		let {
			key
		} = util.getData(e);
		let value = util.getValue(e);
		this.setFormValue(key, value)
	},
	//图片值变化
	handerImageChange: function (key, d) {
		let { id, src, src_thumb } = d;
		let logo=[{
			id:id,
			path_thumb:src_thumb,
			path: src
		}]
		this.setFormValue(key,logo)
	},
	//选择图片
	async chooseImage(e) {
		let {
			key
		} = util.getData(e);
		let res = await wx.pro.chooseImage({
			count: 1,
			sizeType: "original",
		})
		let {
			tempFilePaths
		} = res;
		wx.navigateTo({
			url: `/pages/common/cropper/cropper?key=${key}&&src=${tempFilePaths[0]}`
		})
	},
	//表单验证
	validate: function (param) {
		let {
			id,
			name,
			logo,
			desc,
			category,
		} = param
		let validate = new util.Validate();
		validate.add(name, "isNoEmpty", "请填写群名称");
		validate.add(logo, "isNoEmpty", "请上传标志");
		validate.add(category, "isNoEmpty", "请选择类型");

		let message = validate.start();
		return message;
	},
	//提交表单
	submit: function () {
		let {
			id,
			name,
			logo,
			desc,
			category,
		} = this.data.form;
		logo = util.getIds(logo)
		let param = {
			id,
			name,
			logo,
			desc,
			category,
		}
		let msg = this.validate(param)
		if (msg) {
			util.showModal(msg)
			return;
		}
		util.showLoading()
		let back = this.data.back;
		groupModel.add(param).then((d) => {
			util.hideAll();
			util.showSuccess("保存成功")
			let page = back == 2 ? 2 : 1
			util.getPage(-page).onPullDownRefresh();
			wx.navigateBack({
				delta: page
			})
		})
	}
})