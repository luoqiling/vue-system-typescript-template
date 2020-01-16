const Mock = require('mockjs')
const { Base64 } = require('js-base64')

const users = {
  'admin': Base64.encode(JSON.stringify({
    uuid: Mock.Random.id(),
    nickname: 'Super Admin',
    username: 'admin'
  })),
  'editor': Base64.encode(JSON.stringify({
    uuid: Mock.Random.id(),
    nickname: 'Normal Editor',
    username: 'editor'
  }))
}

module.exports = [
  // user login
  {
    url: '/session/login',
    type: 'post',
    response: config => {
      const { mobile } = config.body
      const token = users[mobile]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 200,
        data: token,
        msg: '成功',
        success: true
      }
    }
  },

  // user logout
  {
    url: '/session/logout',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: true,
        msg: '成功',
        success: true
      }
    }
  },

  {
    url: '/session/sendCode',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: true,
        msg: '成功',
        success: true
      }
    }
  }
]
