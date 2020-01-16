import store from '@/store'
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { Base64 } from 'js-base64'
import Md5 from 'md5'
import Cookies from 'js-cookie'
import defaultSettings from '@/settings'
import { login, logout, sendCode } from '@/api/user'
import { resetRouter } from '@/router'
import PermissionModule from './permission'
import { ILoginData } from '@/types/api'

const MODULE_NAME = 'user'
const tokenKey: string = `${process.env.VUE_APP_ENV}${defaultSettings.name}token`

if ((store as any).state[MODULE_NAME]) {
  store.unregisterModule(MODULE_NAME)
}

@Module({ name: MODULE_NAME, dynamic: true, store })
class UserModule extends VuexModule {
  public token: string | undefined = Cookies.get(tokenKey) || ''
  public nickname: string = ''
  public useruuid: string = ''

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NICKNAME(name: string) {
    this.nickname = name
  }

  @Mutation
  private SET_ID(id: string) {
    this.useruuid = id
  }

  @Action
  public login(userInfo: ILoginData) {
    const { username, password, code } = userInfo
    return new Promise((resolve, reject) => {
      login(username, Md5(password), code).then(response => {
        const { data } = response
        this.SET_TOKEN(data)
        Cookies.set(tokenKey, data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

  @Action
  public getInfo() {
    const data = JSON.parse(Base64.decode(this.token as string))
    const { nickname, uuid } = data
    this.SET_NICKNAME(nickname)
    this.SET_ID(uuid)
  }

  @Action
  public logout() {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        this.SET_TOKEN('')
        PermissionModule.check(false)
        Cookies.remove(tokenKey)
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

  @Action
  sendCode(username: string) {
    return new Promise((resolve, reject) => {
      sendCode(username).then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

  @Action
  resetToken() {
    return new Promise(resolve => {
      this.SET_TOKEN('')
      Cookies.remove(tokenKey)
      resolve()
    })
  }
}

export default getModule(UserModule)
