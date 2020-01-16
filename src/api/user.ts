import request from '@/utils/request'
import QS from 'qs'

export function login(mobile: string, password: string, code: string) {
  return request({
    url: '/session/login',
    method: 'post',
    data: QS.stringify({
      mobile,
      password,
      code
    })
  })
}

export function logout() {
  return request({
    url: '/session/logout',
    method: 'post'
  })
}

export function sendCode(mobile: string) {
  return request({
    url: '/session/sendCode',
    method: 'post',
    data: QS.stringify({
      mobile
    })
  })
}
