import router from './router'
import { Route } from 'vue-router'
import AppModule from '@/store/modules/app'
import UserModule from '@/store/modules/user'
import PermissionModule from '@/store/modules/permission'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

// 白名单
const whiteList: Array<string> = ['/login']

router.beforeEach(async(to: Route, from: Route, next: any) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  AppModule.close(to.meta.closed)

  if (UserModule.token) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (PermissionModule.checked) {
        next()
      } else {
        try {
          await UserModule.getInfo()
          const accessRoutes = await PermissionModule.generateRoutes()
          // console.log(accessRoutes)
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          await UserModule.resetToken()
          Message.error(error || 'Has Error')
          // next(`/login?redirect=${to.path}`)
          next('/login')
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // next(`/login?redirect=${to.path}`)
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
