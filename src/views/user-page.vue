<template>
  <div class="user-container">
    <!-- //头部 -->
    <div class="top">
      <div class="body">
        <div class="top-yi">
          <div class="user-kar">
            <div class="avater">
              <img :src="photo === '' ? userdata.photo : photo" alt="" />
            </div>
            <div class="msg">
              <div class="yi">
                {{ changename === '' ? userdata.name : changename }}
              </div>
              <div class="er">申请认证</div>
            </div>
          </div>
          <div class="user-dongtai">
            <div class="dt">
              <div class="top">0</div>
              <div class="bottom">动态</div>
            </div>
            <div class="gz">
              <div class="top">0</div>
              <div class="bottom">关注</div>
            </div>
            <div class="fs">
              <div class="top">0</div>
              <div class="bottom">粉丝</div>
            </div>
          </div>
        </div>
        <div class="top-er">
          <div class="yi">
            <div class="zuo">
              <van-icon name="more-o" />
            </div>
            <div class="zhong" @click="toeditor">编辑资料</div>
            <div class="you"><van-icon name="arrow" /></div>
          </div>
          <div class="er" @click="chat">
            <div class="zuo"><van-icon name="chat-o" /></div>
            <div class="zhong">小思同学</div>
            <div class="you"><van-icon name="arrow" /></div>
          </div>
          <div class="san">
            <div class="zuo"><van-icon name="warning-o" /></div>
            <div class="zhong" @click="confirm">退出登录</div>
            <div class="you"><van-icon name="arrow" /></div>
          </div>
        </div>
      </div>
    </div>
    <!-- //底部 -->
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="contact" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import request from '@/utils/request'
import { Dialog } from 'vant'
import eventBus from '@/components/eventBus'
export default {
  data() {
    return {
      changename: '',
      photo: '',
      userdata: []
    }
  },
  mounted() {
    this.http()
    eventBus.$on('tomsg', (data) => {
      this.changename = data
    })
    eventBus.$on('tomsg2', (data) => {
      this.photo = data
      console.log(data)
    })
  },
  methods: {
    async http() {
      const token = sessionStorage.getItem('token')
      const { data: res } = await request.get('/v1_0/user/profile', {
        headers: { Authorization: 'Bearer ' + token }
      })
      this.userdata = res.data
      console.log(res)
    },
    showPopup() {
      this.show = true
    },
    confirm() {
      Dialog.confirm({
        title: '提示',
        message: '嘤嘤嘤这就走了?，不爱我了嘛？'
      }).then(() => {
        // on confirm
        sessionStorage.removeItem('token')
        this.$router.replace('/login')
      })
    },
    toeditor() {
      this.$router.push('/user/editor')
    },
    chat() {
      this.$router.push('/user/chatAi')
    }
  }
}
</script>

<style lang="less" scoped>
.user-container {
  color: red;
}
img {
  width: 100%;
  height: 100%;
}
.top {
  width: 100%;
  height: 87.6773vw;
  .top-yi {
    height: 52.4773vw;
    background: -webkit-linear-gradient(left, skyblue, orange);
    padding-top: 5.3333vw;
    .user-kar {
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;
      height: 21.3333vw;

      .avater {
        width: 16vw;
        height: 16vw;
        border-radius: 100%;
        overflow: hidden;
      }
      .msg {
        width: 72.8533vw;
        height: 16vw;
        margin-left: 1.3333vw;
        .yi {
          color: #fff;
          font-weight: 500;
          font-size: 3.4667vw;
          margin-top: 1.3333vw;
          margin-bottom: 1.3333vw;
          padding-left: 2.1333vw;
          font-weight: 600;
        }
        .er {
          width: 14.9333vw;
          height: 4.2667vw;
          background-color: #fff;
          color: aquamarine;
          font-size: 3.2vw;
          text-align: center;
          line-height: 4.2667vw;
          margin-top: 2.6667vw;
          font-weight: 600;
          border: 1px solid pink;
          margin-left: 1.3333vw;
        }
      }
    }
    .user-dongtai {
      display: flex;
      align-items: center;
      height: 26.3467vw;
      text-align: center;
      color: #fff;
      .dt {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 9.8133vw;
        .top {
          height: 4.48vw;
        }
        .bottom {
          height: 5.3333vw;
        }
      }
      .gz {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 9.8133vw;
        .top {
          height: 4.48vw;
        }
        .bottom {
          height: 5.3333vw;
        }
      }
      .fs {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 9.8133vw;
        .top {
          height: 4.48vw;
        }
        .bottom {
          height: 5.3333vw;
        }
      }
    }
  }
  .top-er {
    display: flex;
    flex-direction: column;
    height: 35.2vw;
    padding-left: 4vw;
    padding-right: 4vw;
    color: #323233;
    font-size: 3.7333vw;
    .yi {
      display: flex;
      align-items: center;
      height: 11.7333vw;
    }
    .er {
      display: flex;
      align-items: center;
      height: 11.7333vw;
    }
    .san {
      display: flex;
      align-items: center;
      height: 11.7333vw;
    }
  }
}
.user-container .top .body .top-er .zuo {
  width: 4.2667vw;
  height: 6.4vw;
  line-height: 6.4vw;
  margin-right: 2.1333vw;
}
.user-container .top .body .top-er .zhong {
  width: 80.8533vw;
  height: 6.4vw;
  line-height: 6.4vw;
}
.user-container .top .body .top-er .you {
  width: 4.2667vw;
  height: 6.4vw;
  line-height: 6.4vw;
}
</style>
