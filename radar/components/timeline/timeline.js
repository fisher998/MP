'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _WxHelper = require('../../libs/WxHelper.js');

var _WxHelper2 = _interopRequireDefault(_WxHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChildPath = '../timeline-item/timeline-item';

exports.default = Component({
	relations: _WxHelper2.default.getChildRelation(ChildPath),

	behaviors: [],
	data: {
		width: 375
	},
	properties: {
		mode: String
	},
	methods: {
		_getAllLi: function _getAllLi() {
			return this.getRelationNodes(ChildPath);
		}
	},
	ready: function ready() {
		var _this = this;

		this.data.childrens = this._getAllLi();
		// console.log(this.data.childrens);
		this.data.childrens.forEach(function (element) {
			element.setData({
				timelineType: _this.data.mode
			});
		});
	}
});