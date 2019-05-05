'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _WxHelper = require('../../libs/WxHelper.js');

var _WxHelper2 = _interopRequireDefault(_WxHelper);

var _StyleHelper = require('../../libs/StyleHelper.js');

var _StyleHelper2 = _interopRequireDefault(_StyleHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ParentPath = '../timeline/timeline';

exports.default = Component({
	relations: _WxHelper2.default.getParentRelation(ParentPath),
	behaviors: [],
	properties: {
		timelineType: {
			type: String,
			value: 'column'
		},
		num: {
			type: Number,
			observer: function observer(val) { }
		},
		lineColor: String,
		pointColor: String,
		pointStyle: String,
		top: {
			type: [Number, String]
		},
		shadow: {
			type: Boolean,
			value: true
		},
		showLine: {
			type: Boolean,
			value: true
		}
	},
	data: {},
	methods: {},
	attached: function attached() {
		// console.log(this.data.shadowStyle);
	}
});