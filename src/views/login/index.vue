<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <h1 class="title">{{ appTitle }}</h1>

      <el-form-item prop="username" :class="{ hightlight: isHightlight.username }">
        <span><svg-icon icon-class="login_icon_accout" /></span>
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          placeholder="请输入登录账号"
          tabindex="1"
          auto-complete="off"
          @focus="focus"
          @blur="blur"
        />
      </el-form-item>

      <el-form-item prop="password" :class="{ hightlight: isHightlight.password }">
        <span><svg-icon icon-class="login_icon_password" /></span>
        <el-input
          v-model="loginForm.password"
          name="password"
          type="password"
          placeholder="请输入登录密码"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
          @focus="focus"
          @blur="blur"
        />
      </el-form-item>

      <div class="form-item-box">
        <el-form-item prop="code" :class="{ hightlight: isHightlight.code }" class="form-item-code">
          <span><svg-icon icon-class="icon_verify_code" /></span>
          <el-input
            v-model="loginForm.code"
            name="code"
            type="text"
            placeholder="请输入验证码"
            tabindex="3"
            @focus="focus"
            @blur="blur"
          />
        </el-form-item>
        <el-button :loading="loading2" :disabled="isSendingCode" type="primary" class="getCode" @click.native.prevent="sendCode">
          <span v-if="isSendingCode">重新获取({{ time }}s)</span>
          <span v-else>获取验证码</span>
        </el-button>
      </div>

      <div class="form-item-box mgb16">
        <el-button :loading="loading" type="primary" class="loginBtn" @click.native.prevent="handleLogin">登录</el-button>
      </div>

      <div class="form-item-box mgb0">
        <el-checkbox v-model="isSavePassword">记住密码</el-checkbox>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import AppModule from '@/store/modules/app'
import UserModule from '@/store/modules/user'
import defaultSettings from '@/settings'
import { ILoginData } from '@/types/api'
import { Form as ElForm, Input } from 'element-ui'

const env: string | undefined = process.env.VUE_APP_ENV
const savePasswordItemName: string = `${env}${defaultSettings.name}saveinfo`

@Component({
  name: 'Login'
})
export default class extends Vue {
  private loginForm: ILoginData = {
    username: '',
    password: '',
    code: ''
  }
  private loginRules = {
    username: [{ required: true, trigger: 'blur', validator: this.validateUsername, transform(v: any) { return v.trim() } }],
    password: [{ required: true, trigger: 'blur', message: '您输入的密码有误，请重新输入', transform(v: any) { return v.trim() } }],
    code: [{ required: true, trigger: 'blur', message: '您输入的验证码有误，请重新输入', transform(v: any) { return v.trim() } }]
  }
  private isHightlight: { [propName: string]: boolean } = {
    username: false,
    password: false,
    code: false
  }
  private time = 60
  private loading = false
  private loading2 = false
  private isSavePassword = true
  private isSendingCode = false
  private redirect!: string | (string | null)[]

  private validateUsername(rule: any, value: string, callback: Function) {
    let flag = ''
    if (!value) {
      flag = '您输入的账号有误，请重新输入'
    }
    callback(flag ? new Error(flag) : undefined)
  }

  get appTitle() {
    return AppModule.title
  }

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    const query = route.query
    if (query) {
      this.redirect = query.redirect
    }
  }

  private created() {
    let item = window.localStorage.getItem(savePasswordItemName)
    if (item) {
      const obj = JSON.parse(item)
      this.loginForm.username = obj.username
      this.loginForm.password = obj.password
    }
  }

  private sendCode() {
    const username = this.loginForm.username
    if (!username) {
      this.$message.error('请先输入登录账号！')
      return
    }
    this.loading2 = true
    UserModule.sendCode(username).then(() => {
      this.loading2 = false
      this.isSendingCode = true
      let currentTime = this.time
      const time = currentTime
      const timer = window.setInterval(() => {
        currentTime--
        this.time = currentTime
        if (currentTime <= 0) {
          this.isSendingCode = false
          clearInterval(timer)
          this.time = time
        }
      }, 1000)
    }).catch(() => {
      this.loading2 = false
    })
  }

  private focus(event: any) {
    this.resetHightlight()
    this.isHightlight[event.target.name] = true
  }

  private blur(event: any) {
    this.resetHightlight()
    this.isHightlight[event.target.name] = false
  }

  private resetHightlight() {
    for (var key in this.isHightlight) {
      this.isHightlight[key] = false
    }
  }

  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate((valid: boolean) => {
      if (valid) {
        this.loading = true
        UserModule.login(this.loginForm).then(() => {
          if (this.isSavePassword) {
            window.localStorage.setItem(savePasswordItemName, JSON.stringify(this.loginForm))
          } else {
            window.localStorage.setItem(savePasswordItemName, '')
          }
          this.$router.push({ path: (this.redirect as string) || '/' })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
}
</script>

<style lang="scss">
.login-container {
  $input_bg_color: #fff;
  $input_color: #363941;
  $input_cursor_color: #363941;
  $input_width: 360px;
  $input_height: 44px;

  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-image: linear-gradient(-269deg, rgba(255, 255, 255, 0.98) 0%, #ffffff 100%);

  @supports (-webkit-mask: none) and (not (cater-color: $input_cursor_color)) {
    & .el-input input {
      color: $input_cursor_color;
    }
  }

  .el-input {
    display: inline-block;
    height: $input_height - 2;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      color: $input_color;
      height: 100%;
      caret-color: $input_cursor_color;
      padding: 0;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $input_bg_color inset !important;
        -webkit-text-fill-color: $input_cursor_color !important;
      }
    }
  }

  .el-form-item__error {
    @include global_icon_warn;
  }

  .form-item-box,
  .el-form-item {
    margin: 0 auto 22px;
  }

  .el-form-item {
    width: $input_width - 2;
    border: 1px solid #dcdde6;
    background: $input_bg_color;
    border-radius: 4px;

    &.hightlight {
      background: #f4f7ff;
      border: 1px solid $global_main_color;
    }

    .el-form-item__content {
      display: flex;
      align-items: center;
      line-height: 0;

      & > span {
        width: 20px;
        height: 20px;
        margin: 0 8px 0 8px;
        display: block;
        line-height: 0;

        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .form-item-box {
    width: $input_width;
    @include global_clearfix;

    .el-form-item {
      float: left;
    }

    .form-item-code {
      width: 208px;
      margin: 0;
    }
  }

  .login-form {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 480px;
    max-width: 100%;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 2px 30px 0 #eceef3;
    border-radius: 4px;
    padding-bottom: 42px;
  }

  .title {
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    color: #ffffff;
    letter-spacing: 0;
    width: 100%;
    height: 100px;
    line-height: 100px;
    position: relative;
    margin-bottom: 40px;
    background: $global_main_color;
  }

  button {
    height: $input_height;
  }

  .getCode {
    width: 130px;
    font-size: 14px;
    float: right;
  }

  .loginBtn {
    width: 100%;
    font-size: 16px;
    span {
      letter-spacing: 10px;
    }
  }

  .mgb0 {
    margin-bottom: 0;
  }

  .mgb16 {
    margin-bottom: 16px;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: $global_main_color;
    border-color: $global_main_color;
  }

  .el-checkbox__input.is-focus .el-checkbox__inner {
    color: $global_main_color;
  }

  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: $global_main_color;
  }

  .el-checkbox__inner:hover {
    border-color: $global_main_color;
  }
}
</style>
