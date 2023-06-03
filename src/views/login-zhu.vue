<template>
  <div class="login-container">
    <van-form>
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="电话号"
        autocomplete="current-password"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
        autocomplete="current-password"
      />
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
        @click="to"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    to() {
      request
        .post('/v1_0/authorizations', {
          mobile: this.username,
          code: this.password
        })
        .then(function(data) {
          const { data: { data: { token } } } = data
          sessionStorage.setItem('token', token)
        }).then(() => {
          this.$router.push('/')
        })
    }
  }
}
</script>

<style lang="less" scoped></style>
