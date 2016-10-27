Aliyun push sdk for node.js, include DirectMail and SMS.

[![Build Status](https://travis-ci.org/ShanChain/aliyun-push.svg?branch=master)](https://travis-ci.org/ShanChain/aliyun-push)

# Usage

  ```js
  var push = require('aliyun-push');

  var client = new push({
    AccessKeyId: '<Your AccessKeyId>',
    AccessKeySecret: '<Your AccessKeySecret>',
    AccountName: '<Your AccountName>'   // for DirectMail
  });

  client.SingleSendMail({
    ToAddress: 'test@shanchain.com',
    Subject: 'test',
    TextBody: 'hello world'
  }, funtion(err, res, body) {
    // do something here
    // console.log(err, res, body)
  });
  ```

  ```js
  /**
   * @param {Object}   args params
   * @param {Function} cb   callback
   */
  client.MEHOTD(args, callback);
  ```

# Params

  - **SingleSendMail**

  | name | type | required | description |
  | :---: | :---: | :---: | :---: |
  | ToAddress | String | yes |  |
  | Subject | String | yes |  |
  | TextBody | String | yes |  |
  | HtmlBody | String | yes |  |
  | FromAlias | String | no |  |

  **Note**: choose `TextBody` or `HtmlBody`

  - **BatchSendMail**

  | name | type | required | description |
  | :---: | :---: | :---: | :---: |
  | TemplateName | String | yes |  |
  | ReceiversName | String | yes |  |
  | TagName | String | no |  |


  - **SingleSendSms**

  | name | type | required | description |
  | :---: | :---: | :---: | :---: |
  | SignName | String | yes |  |
  | TemplateCode | String | yes |  |
  | RecNum | String | yes |  |
  | ParamString | String | yes |  |


# License

  [MIT](https://github.com/ShanChain/aliyun-push/blob/master/LICENSE)