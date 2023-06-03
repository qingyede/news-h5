<template>
  <div class="editor-container">
    <!-- //头部导航 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" />
    <div class="body-top">
      <div class="yi">
        <div class="zuo">头像</div>
        <div class="zhong">
          <div class="dabox">
            <img :src="userdata.photo" alt="" />
            <div class="fliefather">
              <input
                @change="updateavater"
                class="file"
                type="file"
                name=""
                accept="image/*"
                id="fileInput"
              />
            </div>
          </div>
        </div>
        <div class="you"><van-icon name="arrow" /></div>
      </div>
      <van-cell is-link @click="showPopup2"
        >名称<span ref="iptzi" class="btn-you">{{
          userdata.name
        }}</span></van-cell
      >
      <van-dialog
        v-model="show2"
        title="修改名称"
        show-cancel-button
        @confirm="yes"
      >
        <input
          class="ipt"
          ref="iptfocus"
          placeholder="请修改您的名称"
          v-model="ipttext"
          type="text"
        />
      </van-dialog>
      <van-popup v-model="show"></van-popup>
      <van-cell is-link @click="showPopup"
        >生日<span class="btn-you" ref="celecttime">{{
          userdata.birthday
        }}</span></van-cell
      >
      <van-popup v-model="show" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="showTime"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import eventBus from '@/components/eventBus'
export default {
  mounted() {
    this.http()
  },
  data() {
    return {
      // 用户资料数据
      userdata: [],
      updatauser: '',
      ipttext: '',
      photo: '',
      show2: false,
      show: false,
      minDate: new Date(1500, 0, 1),
      maxDate: new Date(2023, 12, 12),
      currentDate: new Date(2023, 3, 1)
    }
  },
  computed: {
    userpagename() {
      return this.ipttext
    },
    userphoto() {
      return this.userdata.photo
    }
  },
  methods: {
    async http() {
      const token = sessionStorage.getItem('token')
      const { data: res } = await request.get('/v1_0/user/profile', {
        headers: { Authorization: 'Bearer ' + token }
      })
      this.userdata = res.data
    },
    showPopup() {
      this.show = true
    },
    // 展示时间
    showTime(val) {
      const date = new Date(val)
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m > 10 ? m : '0' + m
      let d = date.getDate()
      d = d > 10 ? d : '0' + d
      const timers = y + '-' + m + '-' + d
      // 更新用户数据
      const token = sessionStorage.getItem('token')
      const data = {
        gender: 0,
        birthday: timers
      }
      const config = {
        method: 'patch',
        url: '/v1_0/user/profile',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        data: data
      }
      request(config).then((res) => {
        this.http()
      })
      this.show = false
    },
    showPopup2() {
      this.show2 = true
    },
    // 编辑资料点击确认做的事
    yes() {
      // 更新用户数据
      const token = sessionStorage.getItem('token')
      const data = {
        name: this.ipttext,
        gender: 0
      }
      const config = {
        method: 'patch',
        url: '/v1_0/user/profile',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        data: data
      }
      request(config).then((res) => {
        this.http()
      })
      eventBus.$emit('tomsg', this.userpagename)
    },
    updateavater(e) {
      const fileInput = document.getElementById('fileInput')
      const file = fileInput.files[0]
      const formData = new FormData()
      formData.append('photo', file)
      const token = sessionStorage.getItem('token')
      // 判断用户选择的文件是否为空
      if (file !== '') {
        request
          .patch('/v1_0/user/photo', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((response) => {
            this.userdata.photo = response.data.data.photo
            eventBus.$emit('tomsg2', this.userphoto)
          })
          .catch((error) => {
            console.log('上传失败', error.response.data)
          })
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar__title {
  color: #fff;
}
/deep/ .van-nav-bar .van-icon {
  color: #fff;
}
.body-top {
  height: 44.0507vw;
  padding-left: 4vw;
  padding-right: 4vw;
  color: #323233;
  font-size: 3.7333vw;
}
.body-top .yi {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 20.584vw;
  .zuo {
    width: 43.0933vw;
    height: 6.4vw;
    line-height: 6.4vw;
  }
  .zhong {
    width: 43.0933vw;
    height: 15.2507vw;
    line-height: 15.2507vw;
    color: #969799;
    img {
      float: right;
      width: 13.3333vw;
      height: 13.3333vw;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 1.3333vw;
    }
  }
  .you {
    width: 4.2667vw;
    height: 6.4vw;
    line-height: 6.4vw;
    color: #969799;
  }
}
/deep/ .van-cell {
  position: relative;
  padding: 0.4vw;
  margin-top: 5.3333vw;
}
.btn-you {
  position: absolute;
  top: 0;
  right: 0.2667vw;
  color: #969799;
  font-size: 3.7333vw;
}
.ipt {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  text-align: center;
  margin-top: 1.3333vw;
  border: 0;
}
.ipt::placeholder {
  color: #969799;
  font-size: 2.6667vw;
  text-indent: --1.3333vw;
}
.dabox {
  position: relative;
}
.body-top .yi .zhong .fliefather {
  position: absolute;
  top: 0;
  right: 0;
  width: 50px;
  height: 50px;
}
.body-top .yi .zhong .fliefather .file {
  display: inline-block;
  opacity: 0;
  width: 50px;
  height: 50px;
  background-color: pink;
}
</style>
