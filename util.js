/**
 * Universal extension function
 */
'use strict';

const _ = require('lodash');
const qs = require('querystring');
const md5 = require('md5');
const crypto = require('crypto');
const moment = require('moment');
const request = require('request');
const urlencode = require('urlencode');

module.exports =  {

  /**
   * Judge specify string is email or not
   * @param  {String} str specify string
   * @return {Boolean}    true/false
   */
  isEmail(str) {
    return /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/.test(str);
  },

  /**
   * Judge specify string is phone number or not
   * @param  {String} str specify string
   * @return {Boolean}    true/false
   */
  isPhone(str) {
    return /0?(13|14|15|18)[0-9]{9}/.test(str);
  },

  /**
   * Generate number used once
   * @return {String} ramdon number
   */
  nonce() {
    return md5(`${+moment()}-${_.random(99999999999)}`);
  },

  /**
   * Signature handler
   * @param  {Object} opt params options
   * @return {String}     signature string
   */
  signature(opt, key)  {
    const StringToSign = `POST&${urlencode('/')}&${urlencode(qs.stringify(opt))}`;

    return crypto.createHmac('sha1', key).update(StringToSign).digest().toString('base64');
  },

  /**
   * Resort data
   * @param  {String} secret AccessKeySecret
   * @param  {Object} params public params
   * @param  {Object} opts   send options
   * @return {Object}        resort object
   */
  reSort(secret, params, opts) {
    const args = Object.assign(params, opts);
    const keys = Object.keys(args).sort();
    const newArgs = {};

    keys.forEach(e => newArgs[e] = args[e]);

    newArgs['SignatureNonce'] = this.nonce();
    newArgs['Timestamp'] = moment().utc().format();
    newArgs['Signature'] = this.signature(newArgs, `${secret}&`);

    return newArgs;
  },

  /**
   * Push handler
   * @param  {Object}   opt include 'host' and 'data'
   * @param  {Function} cb  callback function
   * @return {[type]}       [description]
   */
  push(opt, cb) {
    request({
      url: opt.host,
      method: opt.method || 'POST',
      form: opt.data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      json: true
    }, (err, response, body) => {
      if (err) {
        cb && cb(err);
      } else {
        cb && cb(null, response, body);
      }
    });
  }
};
