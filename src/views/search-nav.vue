<template>
  <div class="search-container">
    <div class="top2">
      <div class="zuo2" @click="back">
        <img src="@/assets/img/返回.svg" alt="" />
      </div>
      <div class="you2" v-if="searchrs">
        <input
          type="text"
          placeholder="请输入搜索关键词"
          ref="inpRef"
          v-model.trim="iptdata"
          @keydown.enter="searching"
          @keyup.enter="mohu"
        />
      </div>
      <router-view></router-view>
    </div>
    <div class="main">
      <!-- 搜索页mian的头部 -->
      <div class="main-top">
        <div class="main-top-zuo">搜索历史</div>
        <div class="main-top-you" @click="del">
          <img src="@/assets//img/删除.svg" alt="" />
        </div>
      </div>
      <!-- 搜索页mian的body -->
      <div class="mian-body">
        <!-- //如果查询到了，那么就v-if控制它 -->
        <ul v-if="getrs">
          <li @click="todetail(item)" v-for="item in searchList" :key="item.id">
            {{ item.value }}
          </li>
        </ul>
        <!-- //模糊查询结果 -->
        <ol v-else>
          <li
            v-for="(item, index) in olList"
            :key="index"
            @click="todetail(item)"
          >
            {{ item }}
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'search-first',
  data() {
    return {
      value: '',
      iptdata: '',
      searchrs: true,
      searchList: [],
      nextId: 0,
      getrs: true,
      ipt: '',
      olList: []
    }
  },
  created() {
    // 发起请求拿到模糊查询结果，如果拿到了就把getrs改为false
  },
  methods: {
    // 循环li
    searching() {
      // 必要的时候处理一下回车空白问题
      this.searchList.push({ id: this.nextId, value: this.iptdata })
      this.nextId++
      // 在清空输入的文字之前，再次执行一遍todetail(),并且把用户的输入文本作为参数给这个函数
      this.todetail(this.iptdata)
      this.iptdata = ''
      // 不明原因注释便可以正常运行
      //   this.searchrs = false
      //   this.$router.push('/search/searching')
    },
    // 控制list里面的数据
    del() {
      this.iptdata = ''
    },
    // back 路由返回上一级
    back() {
      this.$router.back()
    },
    // 键盘弹起就拿到模糊查询结果并渲染到页面中
    async mohu() {
      this.getrs = false
      if (this.iptdata.length !== 0) {
        const { data: res } = await request.get('/v1_0/suggestion', {
          params: { q: this.iptdata }
        })
        // TODO:完成关键字颜色的高亮
        this.olList = res.data.options
      } else {
        this.getrs = true
      }
    },
    todetail(item) {
      //   item就是当前模糊查询的结果
      this.$router.push({
        name: 'searching',
        query: { title: item }
      })
    }
  }
}
// 实现模糊搜索的结果变色功能
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
  width: 9.24vw;
  height: 7.888vw;
  background-color: #efefef;
  margin: 1.8667vw;
  border-radius: 2.6667vw;
  text-align: center;
  line-height: 7.888vw;
  font-size: small;
}
.mian-body ol {
  width: 100%;
  margin-top: -7.7333vw;
  margin-left: 0.8vw;
}
.mian-body ol li {
  width: 100%;
  height: 13.544vw;
  line-height: 13.544vw;
}
</style>
