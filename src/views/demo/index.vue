<template>
  <div class="demo-container">
    <h1>Demo</h1>
    <el-button type="primary" @click="$router.push({ name: 'Form' })">go to Form</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Demo'
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.demo-container{
  padding: 20px;
  overflow: hidden;
  box-sizing: border-box;
  h1 {
    margin-bottom: 20px;
  }
}
</style>
