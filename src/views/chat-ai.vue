<template>
  <div class="chat-container">
    <!-- //头部地区 -->
    <div class="top">
      <van-nav-bar
        title="最强AI - 小王同学"
        left-arrow
        @click-left="$router.back()"
      />
    </div>
    <!-- //主体部分 -->
    <div class="main">
      <div class="left-chat">
        <div class="avater">
          <img src="@/assets/img/OIP-C (1).png" alt="" />
        </div>
        <div class="left-ipt">哈哈哈,我是小王</div>
      </div>

      <div
        class="left-chat"
        v-for="(item, index) in aiList"
        :key="index + 'ai'"
      >
        <div class="avater">
          <img src="@/assets/img/OIP-C (1).png" alt="" />
        </div>
        <div class="left-ipt">{{ item.msg }}</div>
      </div>
      <div class="right-chat" v-for="(item, index) in usermsgList" :key="index">
        <div class="li">
          <div class="avater2">
            <img :src="xinphoto" alt="" />
          </div>
          <div class="ipt2">
            {{ item.msg }}
          </div>
        </div>
      </div>
    </div>
    <!-- //footer部分 -->
    <div class="footer">
      <input
        type="text"
        name="text"
        class="input"
        placeholder="说些什么吧..."
        v-model="usermsg"
      />
      <button class="btn" @click="fasong">发送</button>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import eventBus from '@/components/eventBus'
import { io } from 'socket.io-client'

export default {
  data() {
    return {
      photo: '',
      updataphoto: '',
      // 用户输入的消息
      usermsg: '',
      // 用户信息列表
      usermsgList: [],
      nextId: 1,
      // ai信息列表
      aiList: [],
      ainextId: 2
    }
  },
  computed: {
    xinphoto() {
      if (this.updataphoto === '') {
        return this.photo
      } else {
        return this.updataphoto
      }
    }
  },
  mounted() {
    // 连接服务端
    // this.connect()
    this.http()
    eventBus.$on('tomsg', (data) => {
      this.updataphoto = data
    })
  },
  methods: {
    async http() {
      const token = sessionStorage.getItem('token')
      const { data: res } = await request.get('/v1_0/user/profile', {
        headers: { Authorization: 'Bearer ' + token }
      })
      this.photo = res.data.photo
    },
    // 客户端与服务端建立连接
    // connect() {
    //   //   const token = sessionStorage.getItem('token')
    //   //   const socket = io('http://geek.itheima.net', {
    //   //     query: {
    //   //       token: 'Bearer ' + token
    //   //     },
    //   //     transports: ['websocket']
    //   //   })
    //   //   socket.on('connect', () => {
    //   //     console.log('连接成功')
    //   //   })
    //   // 监听来自服务器的消息
    //   //   socket.on('message', (data) => {
    //   //     console.log(`接收到消息: ${JSON.stringify(data)}`)
    //   //   })
    //   //   socket.on('connect_error', (err) => {
    //   //     console.error('Failed to connect:', err)
    //   //   })
    //   //   // 发送消息
    //   //   const sendMessage = (msg) => {
    //   //     const timestamp = Date.now().toString()
    //   //     const data = {
    //   //       msg: msg,
    //   //       timestamp: timestamp
    //   //     }
    //   //     socket.emit('message', data)
    //   //   }
    //   //   // 发送一条消息
    //   //   sendMessage('测试消息')
    // },
    fasong() {
      const token = sessionStorage.getItem('token')
      const socket = io('http://geek.itheima.net', {
        query: {
          token: 'Bearer ' + token
        },
        transports: ['websocket']
      })
      socket.on('connect', () => {
        console.log('连接成功')
      })
      // 获得当前时间的时间戳
      const date = +new Date()
      this.usermsgList.push({
        id: this.nextId,
        msg: this.usermsg,
        userdate: date
      })
      // 发送消息
      const sendMessage = (msg) => {
        const timestamp = Date.now().toString()
        const data = {
          msg: msg,
          timestamp: timestamp
        }
        socket.emit('message', data)
      }
      // 发送一条消息
      sendMessage(this.usermsg)
      //   监听来自服务器的正确消息
      socket.on('message', (data) => {
        this.aiList.push({ id: this.ainextId, msg: data.msg })
        this.ainextId += 1
        console.log(data)
      })
      //   监听来自服务器的错误消息
      socket.on('connect_error', (err) => {
        console.error('Failed to connect:', err)
      })
      this.usermsg = ''
      this.nextId += 1
    }
  }
}
</script>

<style lang="less" scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
}
img {
  width: 100%;
  height: 100%;
}
.chat-container::-webkit-scrollbar {
  display: none;
}
.top,
.footer {
  width: 100%;
  height: 13.3333vw;
}
.top {
  background-color: red;
}
.main {
  width: 100%;
  flex: 1;
  overflow-y: scroll;
  padding-left: 2.6667vw;
  padding-right: 2.6667vw;
  box-sizing: border-box;
  background: #0f2027; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #2c5364,
    #203a43,
    #0f2027
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #2c5364,
    #203a43,
    #0f2027
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  p {
    width: 100%;
    word-break: break-all;
  }
}
.footer {
  position: relative;
  background-color: #212121;
  .input {
    width: 85.3867vw;
    height: 7.4667vw;
    color: #8707ff;
    border: 0.5333vw solid #8707ff;
    padding: 2.6667vw 6.6667vw;
    background: transparent;
    border-top-left-radius: 1.3333vw;
    border-top-right-radius: 1.3333vw;
  }
  .input:active {
    box-shadow: 0.5333vw 0.5333vw 4vw #8707ff inset;
  }
  .btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 4.2667vw;
    width: 24vw;
    height: 9.3333vw;
    line-height: 5.3333vw;
    text-align: center;
    --border-color: linear-gradient(-45deg, #ffae00, #7e03aa, #00fffb);
    --border-width: 0.125em;
    --curve-size: 0.5em;
    --blur: 30px;
    --bg: #080312;
    --color: #afffff;
    color: var(--color);
    /* use position: relative; so that BG is only for .btn */
    isolation: isolate;
    // display: inline-grid;
    place-content: center;
    padding: 0.5em 1.5em;
    font-size: 4.5333vw;
    border: 0;
    text-transform: uppercase;
    box-shadow: 2.6667vw 2.6667vw 5.3333vw rgba(0, 0, 0, 0.6);
    clip-path: polygon(
      /* Top-left */ 0% var(--curve-size),
      var(--curve-size) 0,
      /* top-right */ 100% 0,
      100% calc(100% - var(--curve-size)),
      /* bottom-right 1 */ calc(100% - var(--curve-size)) 100%,
      /* bottom-right 2 */ 0 100%
    );
    transition: color 250ms;
  }

  .btn::after,
  .btn::before {
    content: '';
    position: absolute;
    inset: 0;
  }

  .btn::before {
    background: var(--border-color);
    background-size: 300% 300%;
    animation: move-bg7234 5s ease infinite;
    z-index: -2;
  }

  @keyframes move-bg7234 {
    0% {
      background-position: 31% 0%;
    }

    50% {
      background-position: 70% 100%;
    }

    100% {
      background-position: 31% 0%;
    }
  }

  .btn::after {
    background: var(--bg);
    z-index: -1;
    clip-path: polygon(
      /* Top-left */ var(--border-width)
        calc(var(--curve-size) + var(--border-width) * 0.5),
      calc(var(--curve-size) + var(--border-width) * 0.5) var(--border-width),
      /* top-right */ calc(100% - var(--border-width)) var(--border-width),
      calc(100% - var(--border-width))
        calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5)),
      /* bottom-right 1 */
        calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5))
        calc(100% - var(--border-width)),
      /* bottom-right 2 */ var(--border-width) calc(100% - var(--border-width))
    );
    transition: clip-path 500ms;
  }

  .btn:where(:hover, :focus)::after {
    clip-path: polygon(
      /* Top-left */ calc(100% - var(--border-width))
        calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5)),
      calc(100% - var(--border-width)) var(--border-width),
      /* top-right */ calc(100% - var(--border-width)) var(--border-width),
      calc(100% - var(--border-width))
        calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5)),
      /* bottom-right 1 */
        calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5))
        calc(100% - var(--border-width)),
      /* bottom-right 2 */
        calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5))
        calc(100% - var(--border-width))
    );
    transition: 200ms;
  }

  .btn:where(:hover, :focus) {
    color: #fff;
  }
}
/deep/ .van-nav-bar__title {
  color: rgb(7, 255, 226);
}
/deep/ .van-nav-bar .van-icon {
  color: rgb(7, 255, 226);
}
/deep/ .van-nav-bar {
  background: -webkit-linear-gradient(left, lightpink, lightseagreen);
  height: 100%;
}
.left-chat {
  position: relative;
  margin-top: 2.6667vw;
}
.avater {
  float: left;
  width: 10.6667vw;
  height: 10.6667vw;
  background-color: red;
  border-radius: 50%;
  overflow: hidden;
  margin-top: 1.3333vw;
}
.left-ipt {
  display: inline-block;
  position: relative;
  max-width: 77.6vw;
  //   min-width: 26.6667vw;
  word-break: break-all;
  background: #2980b9; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #ffffff,
    #6dd5fa,
    #2980b9
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #ffffff,
    #6dd5fa,
    #2980b9
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  margin-left: 5.3333vw;
  margin-top: 1.3333vw;
  text-align: left;
  color: #333;
  font-size: 4.2667vw;
  font-weight: 550;
  padding: 2.1333vw;
  box-sizing: border-box;
  border-radius: 2.1333vw;
  min-height: 11.0933vw;
  line-height: 6.6667vw;
}
.left-ipt::before {
  position: absolute;
  top: 1.3333vw;
  left: -4.8vw;
  content: '';
  width: 0;
  height: 0;
  border: 2.6667vw solid transparent;
  border-right: 2.6667vw solid #afffe7;
  border-radius: 0.5333vw;
}
.right-chat {
  display: flex;
  width: 100%;
  justify-content: end;
  margin-top: 5.3333vw;
  color: #333;
  font-size: 4.2667vw;
  font-weight: 550;
}
.right-chat .li {
  display: flex;
  flex-direction: row-reverse;
}
.avater2 {
  width: 10.6667vw;
  height: 10.6667vw;
  overflow: hidden;
  border-radius: 50%;
}
.ipt2 {
  position: relative;
  max-width: 77.6vw;
  //   min-width: 26.6667vw;
  word-break: break-all;
  border-radius: 2.1333vw;
  background-color: red;
  line-height: 6.6667vw;
  padding: 2.1333vw;
  box-sizing: border-box;
  margin-right: 4.2667vw;
  background: #2980b9; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #ffffff,
    #6dd5fa,
    #2980b9
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #ffffff,
    #6dd5fa,
    #2980b9
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.ipt2::after {
  position: absolute;
  top: 1.3333vw;
  right: -4.8vw;
  content: '';
  width: 0;
  height: 0;
  border: 2.6667vw solid transparent;
  border-left: 2.6667vw solid #afffe7;
  border-radius: 0.5333vw;
}
</style>
