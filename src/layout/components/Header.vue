<template>
  <div class="header-container">
    <h3 @click="$router.push('/')">{{ appTitle }}</h3>
    <div>
      <dl><dd /><dt /></dl>
      <strong>{{ nickname }}</strong>
      <i />
      <span @click="logout">退出</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AppModule from '@/store/modules/app'
import UserModule from '@/store/modules/user'

@Component({
  name: 'Header'
})
export default class extends Vue {
  get nickname() {
    return UserModule.nickname
  }

  get appTitle() {
    return AppModule.title
  }

  private logout() {
    this.$confirm('', '确认退出？', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(async() => {
      await UserModule.logout()
      this.$router.push({ name: 'Login' })
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }).catch(() => {})
  }
}
</script>

<style lang="scss" scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E7E7E7;

  h3 {
    display: flex;
    align-items: center;
    font-size: 18px;
    color: #333;
    letter-spacing: 0;
    margin-left: 32px;
    cursor: pointer;
  }

  div{
    display: flex;
    align-items: center;
    margin-right: 32px;

    dl, strong, i{
      margin-right: 8px;
    }

    strong{
      font-size: 16px;
      color: #262626;
      font-weight: normal;
    }

    span{
      font-size: 14px;
      color: #737373;
      cursor: pointer;

      &:hover{
        text-decoration: underline;
      }
    }

    i{
      display: inline-block;
      width: 1px;
      height: 12px;
      background: #E7E7E7;
    }
  }

  dl{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background: #EDF1F7;
    border-radius: 50%;

    dd, dt{
      background: #FFFFFF;
    }

    dd{
      width: 8px;
      height: 8px;
      box-shadow: 0 0 4px 0 rgba(201,214,233,0.30);
      border-radius: 50%;
      margin-bottom: 2px;
    }

    dt{
      width: 16px;
      height: 8.5px;
      box-shadow: 0 0 4px 0 rgba(201,214,233,0.30);
      border-radius: 15px 15px 10px 10px;
    }
  }
}
</style>
