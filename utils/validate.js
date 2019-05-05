const strategies = {
  // errorMsg参数，提升了适用性
  isNoEmpty: function(value, errorMsg) { //不为空
    if (value === '' || value === undefined || value === false || JSON.stringify(value) === '[]' || JSON.stringify(value) === '{}') {
      // 返回字符串true  错误信息
      return errorMsg;
    }
  },
  minLength: function(value, length, errorMsg) { //限制最小长度
    if (value.length < length) {
      return errorMsg;
    }
  },
  maxLength: function(value, length, errorMsg) { //限制最小长度
    if (value.length > length) {
      return errorMsg;
    }
  },
  isMobile: function(value, errorMsg) {
    if (!/^((\+?86)|(\(\+86\)))?(1[0-9]{10}|([0-9]{3,4}-)?[0-9]{7,8})$/.test(value)) { //电话号码校验
      return errorMsg;
    }
  },
  isWx: function(value, errorMsg) {
    if (!/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/.test(value)) { //微信码校验
      return errorMsg;
    }
  },
  isEmail: function(value, errorMsg) {
    if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)) { //邮箱校验
      return errorMsg;
    }
  },
  money: function(value, errorMsg) {
    if (!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value) || parseFloat(value) < 0.01) { //金额校验
      return errorMsg;
    }
  },
  name: function(value, errorMsg) {
		if (value.length>10) {
      return errorMsg;
    }
  }
};
class Validate {
  constructor() {
    this.cache = []
  }

}
Validate.prototype.add = function(value, rule, errorMsg) {

  this.cache.push(function() {
    // 规则


    let method, arr;
    //判断为已有的策略还是新增的
    if (typeof rule === 'string') {
      arr = rule.split(':');
      let strategy = arr.shift();
      method = strategies[strategy];

    } else {
      arr = [];
      method = rule;
    }
    arr.unshift(value);
    arr.push(errorMsg);
    return method.apply(null, arr);

  });
};

Validate.prototype.start = function() {
  for (let i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
    let msg = validatorFunc();
    if (msg) {
      return msg;
    }
  }
};

export default Validate