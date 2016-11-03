/**
 * Aliyun push sdk, include DirectMail and SMS
 */
'use strict';

const _ = require('lodash');
const util = require('./util');

/**
 * Init
 * @param {Object} opts required params include `AccessKeyId`, `AccessKeySecret` and `AccountName`
 */
function Aliyun_Push(opts) {
  opts = opts || {};

  this.AccessKeyId = opts.AccessKeyId;
  this.AccessKeySecret = opts.AccessKeySecret;
  this.AccountName = opts.AccountName;
  this.dmHost = 'https://dm.aliyuncs.com/';
  this.smsHost = 'https://sms.aliyuncs.com/';

  this.publicParams = {
    Format: 'JSON',
    AccessKeyId: opts.AccessKeyId,
    SignatureMethod: 'HMAC-SHA1',
    Timestamp: '',
    SignatureVersion: '1.0',
    SignatureNonce: '',
  };
  this.singleOptions = {
    Action: 'SingleSendMail',
    AccountName: opts.AccountName,
    ReplyToAddress: true,
    AddressType: 1
  }
  this.batchOptions = {
    Action: 'BatchSendMail',
    AccountName: opts.AccountName,
    ReplyToAddress: true,
    AddressType: 1
  }
  this.smsOptions = {
    Action: 'SingleSendSms'
  }
}

// function prototype
const push = Aliyun_Push.prototype;

/**
 * SingleSendMail handler
 * @param {Object}   args params
 * @param {Function} cb   callback
 */
push.SingleSendMail = function(args, cb) {
  args = args || {};

  if (_.isEmpty(args.ToAddress)) {
    return cb({statusCode: 400, message: 'param ToAddress is required'});
  }
  if (!util.isEmail(args.ToAddress)) {
    return cb({statusCode: 400, message: 'param ToAddress format is not correct'});
  }
  if (_.isEmpty(args.Subject)) {
    return cb({statusCode: 400, message: 'param Subject is required'});
  }
  if (_.isEmpty(args.HtmlBody) && _.isEmpty(args.TextBody)) {
    return cb({statusCode: 400, message: 'The specified TextBody or HtmlBody is wrongly formed'});
  }

  this.singleOptions['ToAddress'] = args.ToAddress;
  this.singleOptions['Subject'] = args.Subject;
  args.FromAlias && (this.singleOptions['FromAlias'] = args.FromAlias);
  args.HtmlBody && (this.singleOptions['HtmlBody'] = args.HtmlBody);
  args.TextBody && (this.singleOptions['TextBody'] = args.TextBody);

  const params = Object.assign(this.publicParams, {Version: '2015-11-23'});
  const data = util.reSort(this.AccessKeySecret, params, this.singleOptions);

  util.push({
    host: this.dmHost,
    data: data
  }, cb);
};

/**
 * BatchSendMail handler
 * @param {Object}   args params
 * @param {Function} cb   callback
 */
push.BatchSendMail = function(args, cb) {
  args = args || {};

  if (_.isEmpty(args.TemplateName)) {
    return cb({statusCode: 400, message: 'param TemplateName is required'});
  }
  if (_.isEmpty(args.ReceiversName)) {
    return cb({statusCode: 400, message: 'param ReceiversName is required'});
  }

  this.batchOptions['TemplateName'] = args.TemplateName;
  this.batchOptions['ReceiversName'] = args.ReceiversName;
  args.TagName && (this.batchOptions['TagName'] = args.TagName);

  const params = Object.assign(this.publicParams, {Version: '2015-11-23'});
  const data = util.reSort(this.AccessKeySecret, params, this.batchOptions);

  util.push({
    host: this.dmHost,
    data: data
  }, cb);
};

/**
 * SingleSendSms handler
 * @param {Object}   args params
 * @param {Function} cb   callback
 */
push.SingleSendSms = function(args, cb) {
  args = args || {};

  if (_.isEmpty(args.SignName)) {
    return cb({statusCode: 400, message: 'param SignName is required'});
  }
  if (_.isEmpty(args.TemplateCode)) {
    return cb({statusCode: 400, message: 'param TemplateCode is required'});
  }
  if (_.isEmpty(args.RecNum)) {
    return cb({statusCode: 400, message: 'param RecNum is required'});
  }
  if (!util.isPhone(args.RecNum)) {
    return cb({statusCode: 400, message: 'param RecNum format is not correct'});
  }
  if (_.isEmpty(args.ParamString)) {
    return cb({statusCode: 400, message: 'param ParamString is required'});
  }

  this.smsOptions['SignName'] = args.SignName;
  this.smsOptions['TemplateCode'] = args.TemplateCode;
  this.smsOptions['RecNum'] = args.RecNum;
  this.smsOptions['ParamString'] = args.ParamString;

  const params = Object.assign(this.publicParams, {Version: '2016-09-27'});
  const data = util.reSort(this.AccessKeySecret, params, this.smsOptions);

  util.push({
    host: this.smsHost,
    data: data
  }, cb);
};

module.exports = Aliyun_Push;
