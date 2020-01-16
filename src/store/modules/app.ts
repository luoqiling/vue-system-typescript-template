import store from '@/store'
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import defaultSettings from '@/settings'

const MODULE_NAME = 'app'
const { title } = defaultSettings

if ((store as any).state[MODULE_NAME]) {
  store.unregisterModule(MODULE_NAME)
}

interface ISidebar {
  closed: boolean
}

@Module({ name: MODULE_NAME, dynamic: true, store })
class AppModule extends VuexModule {
  public title: string = title
  public sidebar: ISidebar = {
    closed: false
  }

  @Mutation
  private SET_CLOSED(val: boolean) {
    this.sidebar.closed = val
  }

  @Action({ commit: 'SET_CLOSED' })
  public close(val: boolean) {
    return val
  }
}

export default getModule(AppModule)
