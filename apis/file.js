import { uploadFile } from '../utils/req.js';

export default {
	//上传图片
  upload(param) {
		return uploadFile('api/base_api/upload',param)
  },
	//识别图片
	scan(param) {
		return uploadFile('api/mingpian_card_outside/identify', param)
	}
}