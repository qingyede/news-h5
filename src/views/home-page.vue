<template>
  <div class="home-container">
    <div class="zhuti">
      <!-- //点击加号让用户自定义自己喜欢的列表 -->
      <div class="jiahao" ref="jia" @click="FreeSettings">+</div>
      <div class="top" v-if="flag">
        <div class="zuo"><img src="@/assets/img/heima.png" alt="" /></div>
        <router-link to="/search">
          <div class="you">
            <img src="@/assets/img/搜索.svg" alt="" /></div
        ></router-link>
      </div>
      <div class="main">
        <!-- //轮播图 -->
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item
            ><img src="@/assets/img/1.jpg" alt=""
          /></van-swipe-item>
          <van-swipe-item
            ><img src="@/assets/img/2.png" alt=""
          /></van-swipe-item>
          <van-swipe-item
            ><img src="@/assets/img/3.jpg" alt=""
          /></van-swipe-item>
          <van-swipe-item
            ><img src="@/assets/img/4.jpg" alt=""
          /></van-swipe-item>
          <van-swipe-item
            ><img src="@/assets/img/5.jpg" alt=""
          /></van-swipe-item>
        </van-swipe>
        <!-- 主体模块 -->
        <div class="main-body" ref="nav">
          <!-- //频道栏目-->
          <div class="main-b">
            <van-tabs animated sticky @click="onClick($event)">
              <van-tab
                v-for="(item, index) in navList"
                :key="index"
                :title="item.name"
              >
                <van-list
                  v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad"
                >
                  <Body
                    v-for="(item, index) in biao"
                    :key="index"
                    :id="item.art_id"
                  >
                    <!-- //只有一张图情况时候的插槽-->
                    <template #yi v-if="item.cover.type === 1">
                      <div>
                        <div class="main-one">
                          <div class="main-one-yi">
                            <div class="wenzi">
                              {{ item.title }}
                            </div>
                            <img :src="item.cover.images[0]" alt="" />
                          </div>
                          <div class="main-one-er">
                            <span> {{ item.aut_name }} </span>
                            <span>评论&nbsp; {{ item.comm_count }}</span>
                            <span>
                              &nbsp;&nbsp;{{
                                item.pubdate.substr(0, 4)
                              }}&nbsp;年前</span
                            >
                          </div>
                        </div>
                      </div>
                    </template>
                    <!-- //有三张图情况时候的插槽-->
                    <template #er v-if="item.cover.type === 3">
                      <div>
                        <div class="main-two">
                          <div class="main-two-yi">
                            {{ item.title }}
                          </div>
                          <div class="main-two-er">
                            <img :src="item.cover.images[0]" alt="" />
                            <img :src="item.cover.images[1]" alt="" />
                            <img :src="item.cover.images[2]" alt="" />
                          </div>
                          <div class="main-two-san">
                            <span>{{ item.aut_name }} </span>
                            <span>评论&nbsp; {{ item.comm_count }}</span>
                            <span
                              >&nbsp;&nbsp;{{
                                item.pubdate.substr(0, 4)
                              }}&nbsp;年前</span
                            >
                          </div>
                        </div>
                      </div>
                    </template>
                    <!-- //没有图情况时候的插槽-->
                    <template #san v-if="item.cover.type === 0">
                      <div>
                        <div class="main-three">
                          <div class="main-three-yi">{{ item.title }}</div>
                          <div class="main-three-er">
                            <span>{{ item.aut_name }} </span>
                            <span>评论&nbsp; {{ item.comm_count }}</span>
                            <span
                              >&nbsp;&nbsp;&nbsp;{{
                                item.pubdate.substr(0, 4)
                              }}年前</span
                            >
                          </div>
                        </div>
                      </div>
                    </template>
                  </Body>
                </van-list>
              </van-tab>
            </van-tabs>
          </div>
        </div>
      </div>
      <!-- //底部导航栏 -->
      <van-tabbar route>
        <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
        <van-tabbar-item icon="contact" to="/user">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
import Body from '@/components/main-body/main-body.vue'
export default {
  name: 'home-p',
  created() {
    this.getlist()
    this.liebiao()
  },
  data() {
    return {
      value: '',
      flag: true,
      // 1.定义控制什么时候吸顶的变量
      scroll: false,
      initTop: 0,
      navList: [],
      currentIndex: 0,
      // 列表数据
      biao: [],
      loading: true,
      finished: false,
      // 控制请求数据的变量
      num: 0,
      // 控制channel的显示与隐藏
      kongzhi: false
    }
  },
  components: {
    Body
  },
  mounted() {
    // 2.在mounted钩子里面给予盒子最初的offsetTop
    this.initTop = this.$refs.nav.offsetTop
    // 3.监听组件的页面滚动事件，执行括号里的函数
    window.addEventListener('scroll', this.fn)
  },
  methods: {
    tosearch() {
      this.flag = false
      this.$nextTick(() => {
        this.$refs.inpRef.focus()
      })
    },
    // 吸顶函数
    fn() {
      //   console.log(window.pageYOffset, this.initTop)
      if (window.pageYOffset >= this.initTop) {
        this.scroll = true
        // 修改加号的偏差
        this.$refs.jia.className = 'hou '
      } else {
        this.scroll = false
        // 当不吸顶的时候再次返回绝对定位
        this.$refs.jia.className = 'jiahao '
      }
    },
    // 封装请求用户选择的频道列表的函数
    async getlist() {
      const token = sessionStorage.getItem('token')
      const { data: res } = await request.get('/v1_0/user/channels', {
        headers: { Authorization: 'Bearer ' + token }
      })
      const newData = res.data.channels
      // 请求的频道数据
      this.navList = newData
    },
    async http(isxia) {
      const { data: res } = await request.get('/v1_0/articles', {
        params: { channel_id: this.num, timestamp: 1654835148606 }
      })
      if (isxia) {
        // 下拉加载
        console.log('下拉加载')
      } else {
        // 上拉加载
        res.data.results.forEach((item, index) => {
          // 0未置顶1置顶
          if (item.is_top === 1) {
            // 置顶
            const a = res.data.results.splice(index, 1)
            res.data.results.unshift(a)
          }
        })
        this.biao = [...this.biao, ...res.data.results]
        this.loading = false
      }
      if (this.biao.length === 250) {
        //   没有数据啦
        this.finished = true // 防止异步加载还在继续
      }
    },
    // 封装请求文章列表的函数
    liebiao() {
      this.http()
    },
    onLoad() {
      // TODO完成上拉下拉加载
      // 异步更新数据
      // 页码值加一
      this.num++
      this.http()
    },
    async http2(e) {
      const { data: res } = await request.get('/v1_0/articles', {
        params: { channel_id: e, timestamp: 1654835148606 }
      })
      res.data.results.forEach((item, index) => {
        // 0未置顶1置顶
        if (item.is_top === 1) {
          // 置顶
          const a = res.data.results.splice(index, 1)
          res.data.results.unshift(a)
        }
      })
      // 这里不需要拼接this.biao给this.biao,因为当我们滚动的时候
      //   会自动请求数据然后添加给列表中

      // TODO完成用户自定义频道栏目的功能

      this.biao = [...res.data.results]

      this.loading = false

      if (this.biao.length === 250) {
        //   没有数据啦
        this.finished = true // 防止异步加载还在继续
      }
    },
    // 点击切换栏做的事情
    onClick(e) {
      this.num = e
      this.http2(e)
    },
    // 当点击加号时让用户自定义喜欢的列表时的事情
    FreeSettings() {
      // TODO   完成路由的跳转或者动态的元素隐藏
      // 跳转到用户自定义频道页面
      // 点击加号通过路由传参把数据发送过去
      this.$router.push({ name: 'channel' })
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  //   display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  color: #000000;
  box-sizing: border-box;
  //只有开启auto才能触发@scroll事件
  //   overflow: auto;
}
img {
  width: 100%;
  height: 100%;
}
.home-container .top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 13.3333vw;
  background: #007bff;
  padding: 0 4vw;
}
.home-container .top .zuo {
  width: 26.6667vw;
  height: 8vw;
}
.home-container .top .you {
  width: 4.8vw;
  height: 4.8vw;
}
.home-container .bottom {
  height: 13.3333vw;
}
.home-container .top2 {
  display: flex;
  align-items: center;
  height: 12.2667vw;
  background: #007bff;
  padding: 0 4vw;
}
.home-container .top2 .zuo2 {
  width: 4.8vw;
  height: 4.8vw;
}
.home-container .top2 .you2 {
  position: relative;
  width: 81.9227vw;
  height: 8vw;
  margin-left: 2.6667vw;
}
.home-container .top2 .you2::before {
  position: absolute;
  top: 1.6vw;
  left: 2.6667vw;
  width: 4.2667vw;
  height: 6.4vw;
  font-family: 'icomoon';
  content: '\e987';
  text-align: center;
  line-height: 6.4vw;
  color: #918a87;
  font-weight: lighter;
}
.home-container .top2 .you2 input {
  width: 100%;
  height: 100%;
  border-radius: 8vw;
  outline: none;
  border: 0.2667vw solid #fff;
  text-indent: 8vw;
}
.home-container .top2 .you2 input::placeholder {
  font-size: 3.7333vw;
}
.van-swipe {
  width: 100.0533vw;
  margin-left: -4vw;
  height: 40vw;
}
.van-swipe img {
  width: 100.0533vw;
  height: 40vw;
}
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 4rem;
  text-align: center;
  background-color: #39a9ed;
}
.home-container .main {
  flex: 1;
  padding: 0 4vw;
}
.home-container .main-body {
  width: 100%;
  margin-top: -2.1333vw;
  transition: all 0.5s;
}

/deep/.van-tabs__line {
  position: absolute;
  bottom: 4.8vw;
  left: 0;
  z-index: 1;
  width: 10.6667vw;
  height: 0.8vw;
  border-radius: 0.8vw;
}
.main-body-nav::after {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: -3.2vw;
  content: '+';
  width: 3.7333vw;
  height: 3.7333vw;
  text-align: center;
  line-height: 3.7333vw;
  color: #646566;
  font-size: large;
}
/deep/ .van-sticky--fixed {
  width: 92.0533vw;
  margin: auto;
  margin-top: -2.6667vw;
}
/deep/.van-tabs--line .van-tabs__wrap {
  margin-top: 2.6667vw;
  margin-left: -3.2vw;
}
/deep/ .van-list__loading,
.van-list__finished-text,
.van-list__error-text {
  margin-bottom: 10.6667vw;
}
.jiahao {
  position: absolute;
  top: 58.1333vw;
  right: .8vw;
  width: 3.7333vw;
  height: 3.7333vw;
  text-align: center;
  line-height: 3.7333vw;
  font-size: 4.8vw;
  font-weight: 600;
  z-index: 999;
}
.hou {
  position: fixed;
  top: 4vw;
  right: 0.8vw;
  width: 3.7333vw;
  height: 3.7333vw;
  text-align: center;
  line-height: 3.7333vw;
  font-size: 4.8vw;
  font-weight: 600;
  z-index: 999;
}
</style>
