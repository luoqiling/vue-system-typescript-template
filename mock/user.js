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
    response: (req, res) => {
      const { mobile } = req.body
      const token = users[mobile]
      res.send(token ? {
        code: 200,
        data: token,
        msg: '成功',
        success: true
      } : {
        code: 60204,
        msg: 'Account and password are incorrect.'
      })
    }
  },

  // user logout
  {
    url: '/session/logout',
    type: 'post',
    response: (req, res) => {
      res.send({
        code: 200,
        data: true,
        msg: '成功',
        success: true
      })
    }
  },

  {
    url: '/session/sendCode',
    type: 'post',
    response: (req, res) => {
      res.send({
        code: 200,
        data: true,
        msg: '成功',
        success: true
      })
    }
  }
]
