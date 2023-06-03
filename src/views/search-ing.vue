<template>
  <div class="search-container">
    <div class="top2">
      <div class="zuo2" @click="back">
        <img src="@/assets/img/返回.svg" alt="" />
      </div>

      <div class="you-2">搜索结果</div>
    </div>
    <div class="main">
      <!-- 搜索页mian的头部 -->
      <Body v-for="(item, index) in biao" :key="index" :id="item.art_id">
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
                  &nbsp;&nbsp;{{ item.pubdate.substr(0, 4) }}&nbsp;年前</span
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
                  >&nbsp;&nbsp;{{ item.pubdate.substr(0, 4) }}&nbsp;年前</span
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
                  >&nbsp;&nbsp;&nbsp;{{ item.pubdate.substr(0, 4) }}年前</span
                >
              </div>
            </div>
          </div>
        </template>
      </Body>
      <!-- 搜索页mian的body -->
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import Body from '@/components/main-body/main-body.vue'
export default {
  name: 'searching-first',
  data() {
    return {
      // 转存的模糊查询传递过来的title
      title: '',
      biao: []
    }
  },
  components: {
    Body
  },
  mounted() {},
  watch: {
    // 监视搜索词变化
    '$route.query': {
      immediate: true,
      handler() {
        const a = JSON.stringify(this.$route.query)
        // console.log(a)
        // console.log(this.$route.query)
        if (a !== '{}') {
          // 这个就是模糊查询传递过来的title
          const til = this.$route.query.title
          this.title = til
          this.http()
        }
      }
    }
  },
  methods: {
    // back 路由返回上一级
    back() {
      this.$router.back()
      this.title = ''
    },
    // 发起http请求
    async http() {
      const data = await request.get('/v1_0/search', {
        params: { q: this.title }
      })
      this.biao = data.data.data.results
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  color: #000000;
  box-sizing: border-box;
}
img {
  width: 100%;
  height: 100%;
}
.search-container .top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 13.3333vw;
  background: #007bff;
  padding: 0 4vw;
}
.search-container .top .zuo {
  width: 26.6667vw;
  height: 8vw;
}
.search-container .top .you {
  width: 4.8vw;
  height: 4.8vw;
}
.search-container .main {
  flex: 1;
  overflow-y: scroll;
  padding: 0 4vw;
}
.search-container .bottom {
  height: 13.3333vw;
}
.search-container .top2 {
  display: flex;
  align-items: center;
  height: 12.2667vw;
  background: #007bff;
  padding: 0 4vw;
}
.search-container .top2 .zuo2 {
  width: 4.8vw;
  height: 4.8vw;
}
.search-container .top2 .you2 {
  position: relative;
  width: 81.9227vw;
  height: 8vw;
  margin-left: 2.6667vw;
}
.search-container .top2 .you-2 {
  position: relative;
  width: 81.9227vw;
  height: 8vw;
  margin-left: 2.6667vw;
  text-align: center;
  line-height: 8vw;
  color: #fff;
}
.search-container .top2 .you2::before {
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
.search-container .top2 .you2 input {
  width: 100%;
  height: 100%;
  border-radius: 8vw;
  outline: none;
  border: 0.2667vw solid #fff;
  text-indent: 8vw;
}

.search-container .top2 .you2 input::placeholder {
  font-size: 3.7333vw;
}
.main {
  margin: 4vw 0;
  .main-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 6.4vw;
    .main-top-zuo {
      width: 14.928vw;
      height: 4.2667vw;
      color: #323233;
      font-size: 3.2vw;
      line-height: 4.2667vw;
    }
    .main-top-you {
      width: 4.2667vw;
      height: 6.4vw;
      line-height: 6.4vw;
      margin-right: 1.3333vw;
    }
  }
}
.mian-body {
  width: 100%;
  padding-top: 4vw;
}
.mian-body ul {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
}
.mian-body ul li {
  width: 34.65px;
  height: 29.58px;
  background-color: #efefef;
  margin: 7px;
  border-radius: 10px;
  text-align: center;
  line-height: 29.58px;
  font-size: small;
}
</style>
