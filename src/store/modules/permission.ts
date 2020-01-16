import store from '@/store'
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { constantRoutes, dynamicRoutes } from '@/router'

const MODULE_NAME = 'permission'

if ((store as any).state[MODULE_NAME]) {
  store.unregisterModule(MODULE_NAME)
}

@Module({ name: MODULE_NAME, dynamic: true, store })
class PermissionModule extends VuexModule {
  public routes: RouteConfig[] = []
  public checked: boolean = false

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes)
  }

  @Mutation
  private SET_CHECKED(val: boolean) {
    this.checked = val
  }

  @Action({ commit: 'SET_CHECKED' })
  public check(val: boolean) {
    return val
  }

  @Action
  public async generateRoutes() {
    this.SET_ROUTES(dynamicRoutes)
    this.SET_CHECKED(true)
    return dynamicRoutes
  }
}

export default getModule(PermissionModule)
