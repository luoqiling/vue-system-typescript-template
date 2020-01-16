<template>
  <div class="sidebar-container">
    <el-menu
      :default-active="activeMenu"
      :unique-opened="false"
      :collapse-transition="false"
    >
      <menu-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import menuItem from './menuItem.vue'
import PermissionModule from '@/store/modules/permission'

@Component({
  name: 'Sidebar',
  components: {
    menuItem
  }
})
export default class extends Vue {
  get routes() {
    return PermissionModule.routes
  }

  get activeMenu() {
    const route = this.$route
    const { meta, path } = route
    if (meta.activeMenu) {
      return meta.activeMenu
    }
    return path
  }
}
</script>

<style lang="scss">
.sidebar-container {
  .svg-icon {
    width: 20px !important;
    height: 20px !important;
    margin-right: 15px;
    opacity: .5;
  }

  .el-menu {
    border-right: 0;
    background-color: $global_menu_bg_color;
  }

  .el-menu.el-menu--inline {
    background-color: $global_subMenu_bg_color;
  }

  .el-menu-item,
  .el-submenu .el-submenu__title {
    color: $global_menu_text_color;

    i {color: $global_menu_text_color;}

    &:hover {
      color: $global_menu_hover_text_color;
      background-color: $global_menu_hover_color;

      i {color: $global_menu_hover_text_color;}
      .svg-icon {opacity: 1;}
    }
  }

  .el-menu-item.is-active {
    color: $global_menu_active_text_color;
    background: $global_menu_active_color;
    .svg-icon {opacity: 1;}
  }

  .is-active > .el-submenu__title {
    color: $global_menu_active_text_color;
    i {color: $global_menu_active_text_color;}
    .svg-icon {opacity: 1;}
  }

  .el-submenu__title {
    display: flex;
    align-items: center;
  }

  .el-submenu__icon-arrow {
    margin-top: 0;
    top: auto;
  }
}
</style>
