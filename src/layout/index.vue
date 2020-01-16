<template>
  <div class="app-wrapper" :class="{ closedSidebar: closed }">
    <Header />
    <Sidebar />
    <Main />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AppModule from '@/store/modules/app'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar/index.vue'
import Main from './components/Main.vue'

@Component({
  name: 'Layout',
  components: {
    Main,
    Header,
    Sidebar
  }
})
export default class extends Vue {
  get closed() {
    return AppModule.sidebar.closed
  }
}
</script>
