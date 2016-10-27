'use strict';

const assert = require('assert');
const urlencode = require('urlencode');
const crypto = require('crypto');
const qs = require('querystring');
const util = require('../util');
const md5 = require('md5');
const _ = require('lodash');
const moment = require('moment');

describe ('util.js', () => {
  describe ('isEmail:', () => {
    it ('should return true when insert a right email `test@shanchain.com`', () => {
      assert.equal(util.isEmail('test@shanchain.com'), true);
    })

    it ('should return false when insert a wrong string `testtest`', () => {
      assert.equal(util.isEmail('testtest'), false);
    })
  })

  describe ('isPhone:', () => {
    it ('should return true when insert a right number `13123123123`', () => {
      assert.equal(util.isPhone('13123123123'), true);
    })

    it ('should return true when insert a wrong number `123123`', () => {
      assert.equal(util.isPhone('123123'), false);
    })
  })

  describe ('nonce:', () => {
    it ('should return return an value when call', () => {
      assert.ok(util.nonce());
    })
  })

  describe ('reSort:', () => {
    it ('should return return an value when call', () => {
      const secret = 'test';
      const params = {
        name: 'test',
        form: 'test'
      };
      const opts = {
        age: 10,
        sexy: 'male'
      };

      assert.ok(util.reSort(secret, params, opts));
    })
  })

  describe ('signature:', () => {
    it ('should return equal value when insert the same params', () => {
      const opt = {
        name: 'shanchain',
        version: '1.0'
      };
      const key = 'test';
      const sts = `POST&${urlencode('/')}&${urlencode(qs.stringify(opt))}`;
      const signature = crypto.createHmac('sha1', key).update(sts).digest().toString('base64')

      assert.equal(util.signature(opt, key), signature);
    })
  })

  describe ('push:', () => {
    it ('should return 200 value when insert the right params', (done) => {
      util.push({
        host: 'https://www.baidu.com',
        method: 'GET'
      }, (err, res, body) => {
        if (res.statusCode === 200) {
          done();
        }
      })
    })

    it ('should return err when insert the wrong params', (done) => {
      util.push({
        host: 'test.com',
        method: 'GET'
      }, (err, res, body) => {
        if (err) {
          done();
        }
      })
    })
  })
})
