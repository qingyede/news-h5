<template>
  <div class="detail-containre">
    <!-- //顶部 -->
    <div class="nav">
      <van-nav-bar title="文章详情" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="mianzong" @click="xianshi = true">
      <!-- //主体 -->
      <div class="main" v-for="(item, index) in iditem" :key="index">
        <p class="title">{{ item.title }}</p>
        <div class="top">
          <div class="top-yi">
            <img :src="item.aut_photo" alt="" />
          </div>
          <div class="top-er">
            <div class="shang">{{ item.aut_name }}</div>
            <div class="xia">{{ item.pubdate }}</div>
          </div>
          <div class="top-san">
            <div class="guanzhu">已关注</div>
          </div>
        </div>
        <div class="box-box" v-html="item.content"></div>
      </div>
      <!-- //底部收藏 -->
      <div class="end">End</div>
      <div class="zan">
        <div class="dianzan">
          <div class="zuo">
            <van-icon name="thumb-circle" />
          </div>
          <div class="you">点赞</div>
        </div>
      </div>
      <!-- //评论 -->
      <div
        class="pinglun"
        v-for="(item, index) in responddata"
        :key="index + 'i'"
      >
        <div class="yi">
          <div class="zuo">
            <div class="yi-avater">
              <img :src="item.aut_photo" alt="" />
            </div>
            <div class="yi-number">{{ item.aut_name }}</div>
          </div>
          <div
            class="yi-faver"
            @click="red = !red"
            :class="red ? 'xihaun' : ''"
          >
            <van-icon name="like-o" />
          </div>
        </div>
        <div class="er">
          {{ item.content }}
        </div>
        <div class="san">
          {{ item.pubdate }}
          分钟前
        </div>
      </div>
      <div class="p">没有更多了</div>
    </div>
    <!-- //底部 -->
    <div class="footer" v-if="xianshi">
      <div class="zuo"></div>
      <div class="zhong">
        <input @focus="xian" type="text" value="发表评论" />
      </div>
      <div class="you">
        <div class="yi">
          <van-icon name="chat-o" />
          <span v-if="dianfabu.length !== 0">{{ responddata.length }}</span>
        </div>
        <div class="er" :class="zhen ? 'fontcolor' : ''" @click="zhen = !zhen">
          <van-icon name="star-o" />
        </div>
        <div class="san">
          <van-icon name="share-o" />
        </div>
      </div>
    </div>
    <div class="footer2" v-else>
      <textarea
        ref="area"
        name=""
        class="text"
        placeholder="友善评论，理性发言，阳光评论"
        v-model="txtarea"
      >
      </textarea>
      <button class="fabu" @click="fa">发布</button>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import axios from 'axios'
export default {
  data() {
    return {
      id: '',
      iditem: [],
      flag: false,
      // 收藏的变量
      zhen: false,
      // 喜欢的变量
      red: false,
      // 评论的数据
      //   pinglunList: []
      // 控制评论的显示与隐藏
      xianshi: true,
      txtarea: '',
      // 响应回来的评论数据
      responddata: [],
      dianfabu: []
    }
  },
  mounted() {
    // 因为钩子函数只执行一次所以再加updated函数即可
    this.fetchData()
    console.log(this.responddata)
  },
  // 用watch监听路由参数的变化
  watch: {
    '$route.params': 'fetchData'
  },
  methods: {
    async http() {
      const params = this.id
      request.get(`/v1_0/articles/${params}`).then((res) => {
        const {
          data: { data }
        } = res
        this.iditem.push(data)
        // const res = data
        // this.id = res
        // // 把对象数据转变为数组，方便循环遍历
        // const arrlist = []
        // for (const k in this.id) {
        //   arrlist.push(this.id[k])
        // }
        // this.id = [{ data: arrlist[0].data }]
        this.flag = true
        this.beforhttp()
        //   TODO:这里莫名报错，建议直接自定义数组进行循环
        //   错误原因是axios请求回来的数据没有被vue及时拿到
        //   所以vm渲染的时候这些变量就没有被定义，因此我们直接来个变量，监听axios的完成 （then）当完成后我们就让这个控制变量的值为true，从而根据这个变量进行条件渲染所要循环的html
      })
    },
    fetchData() {
      // 当路由参数变化了之后就发起请求
      if (this.$route.params.id) {
        this.id = this.$route.params.id
        this.http()
        // this.getHttp(this.id)
      }
    },
    onClickLeft() {
      this.$router.back()
    },
    // 控制评论的显示与隐藏
    xian() {
      this.xianshi = false
      this.$nextTick(() => {
        this.$refs.area.focus()
      })
    },
    // 点击发布评论时候做的事
    fa() {
      this.xianshi = true
      // 1. 请求接口发送用户的评论给数据库
      // 传给函数当前文章的id
      if (this.txtarea !== '') {
        this.putHttp(this.iditem)
        this.dianfabu = true
        this.txtarea = ''
        // TODo完成bug显示已经发表的评论
      } else {
        alert('请输入内容')
      }
    },
    // 封装添加评论的axios
    putHttp(id) {
      const token = sessionStorage.getItem('token')
      const data = JSON.stringify({
        target: id[0].art_id,
        content: this.txtarea,
        art_id: ''
      })

      const config = {
        method: 'post',
        url: 'http://geek.itheima.net/v1_0/comments',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        data: data
      }
      axios(config).then((res) => {
        console.log(res.statusText)
        // console.log('创建成功并添加完了' + res.statusText)
        // 2.请求接口得到用户发表的评论,注意这里一定要等到提交评论完成后再请求数据，否则不能得到最新一条的数据
        this.gethttp(id)
        // 这里依旧有问题
      })
    },
    // 封装得到评论的axios
    gethttp(id) {
      const data = {
        type: 'a',
        source: id[0].art_id,
        limit: id[0].comm_count
      }
      const config = {
        method: 'get',
        url: 'http://geek.itheima.net/v1_0/comments',
        params: data
      }
      axios(config).then((res) => {
        // console.log(res)
        const {
          data: {
            data: { results }
          }
        } = res
        // console.log(results)
        this.responddata = results
      })
    },
    beforhttp() {
      this.gethttp(this.iditem)
    }
  }
}
</script>
<style lang="less" scoped>
.detail-containre {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
}
.nav,
.footer {
  width: 100%;
  height: 12.2667vw;
}
.mianzong {
  width: 100%;
  flex: 1;
  overflow-y: scroll;
  word-break: break-all;
}
.mianzong::-webkit-scrollbar {
  display: none;
}
.title {
  height: 5.9733vw;
  font-size: 4.2667vw;
  font-weight: 700;
}
.main {
  padding: 2.1333vw 4vw;
}
img {
  width: 100%;
  height: 100%;
}
/deep/ .van-nav-bar__title {
  color: #fff;
  font-size: 4.2667vw;
  font-weight: 500;
}
/deep/ .van-icon-arrow-left:before {
  color: #fff;
}
/deep/ .van-tabbar--fixed {
  width: 100%;
}
.top {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 89.3867vw;
  height: 18.6587vw;
  margin-top: -1.3333vw;
  .top-yi {
    width: 17.3333vw;
    height: 16vw;
    border-radius: 50%;
    overflow: hidden;
  }
  .top-er {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 38.696vw;
    height: 12.2667vw;
    padding-left: 2.6667vw;
    .shang {
      width: 100%;
      height: 5.3333vw;
      color: #323233;
      font-size: 3.7333vw;
    }
    .xia {
      width: 100%;
      height: 4.8vw;
      color: #969799;
      font-size: 2.6667vw;
    }
  }
  .top-san {
    display: flex;
    justify-content: end;
    align-items: end;
    width: 38.696vw;
    height: 7.68vw;
    .guanzhu {
      width: 12.16vw;
      height: 6.4vw;
      background-color: #1989fa;
      color: #fff;
      font-size: 3.7333vw;
      text-align: center;
      line-height: 6.4vw;
    }
  }
}
.dabox {
  width: 100%;
}
.di {
  width: 100%;
}
[data-v-01e87120] .van-icon-arrow-left:before {
  color: #323233;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 94.72vw;
  border: 0.2667vw solid #dddddd;
  margin: 0 auto;
  margin-top: 15px;
  .zuo {
    font-family: 'icomoon';
    width: 4.8vw;
    height: 4.8vw;
    text-align: center;
    line-height: 4.8vw;
    font-size: 4.8vw;
  }
  .zhong {
    width: 50.968vw;
    height: 8.4267vw;
    background-color: #f8f8f8;
    border-radius: 2.6667vw;
    border: 0.2667vw solid rgb(192, 192, 192);
    padding: 0.5333vw 1.3333vw;
    box-sizing: border-box;
    margin-left: 1.3333vw;
    margin-right: 1.3333vw;
    line-height: 7.4667vw;
    font-size: 2.6667vw;
    z-index: 2.1333vw;
    input {
      width: 100%;
      height: 100%;
      outline: none;
      border: 0;
    }
  }
  .you {
    display: flex;
    justify-content: space-around;
    width: 38.952vw;
    height: 5.3333vw;
    text-align: center;
    line-height: 5.3333vw;
    font-size: 5.3333vw;
    .yi {
      position: relative;
      width: 5.3333vw;
      height: 5.3333vw;
      span {
        position: absolute;
        top: -1.3333vw;
        left: 3.2vw;
        min-width: 4vw;
        min-height: 4vw;
        display: inline-block;
        background-color: red;
        color: #fff;
        font-size: 2.6667vw;
        text-align: center;
        line-height: 4vw;
        border-radius: 4vw;
      }
    }
    .er {
      width: 5.3333vw;
      height: 5.3333vw;
    }
    .san {
      width: 5.3333vw;
      height: 5.3333vw;
    }
  }
}
.fontcolor {
  color: orange;
}
.end {
  width: 94.72vw;
  height: 6.4vw;
  margin: 0 auto;
  text-align: center;
  line-height: 6.4vw;
  color: #b6b7b8;
  font-size: 4.2667vw;
  margin-bottom: 2.6667vw;
}
.zan {
  width: 94.72vw;
  height: 8.5333vw;
  margin: 0 auto;
  text-align: center;
  line-height: 8.5333vw;
  .dianzan {
    display: flex;
    width: 16vw;
    height: 8.5333vw;
    border: 0.2667vw solid red;
    margin: 0 auto;
    .zuo {
      flex: 1;
      font-size: 5.3333vw;
      text-align: center;
      line-height: 8.5333vw;
      color: red;
    }
    .you {
      flex: 1;
      color: red;
      font-size: 3.7333vw;
      text-align: center;
      line-height: 8.5333vw;
      padding-right: 0.8vw;
    }
  }
}
.pinglun {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 89.3867vw;
  height: 34.88vw;
  margin: 0 auto;
  margin-top: 5.3333vw;
  border: 0.2667vw solid transparent;
  box-shadow: 0.5333vw 0.5333vw 1.3333vw red;
  .yi {
    position: relative;
    display: flex;
    width: 100%;
    height: 10.6667vw;
    .zuo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 34.2427vw;
      height: 10.6667vw;
      .yi-avater {
        width: 10.6667vw;
        height: 10.6667vw;
        border-radius: 50%;
        overflow: hidden;
      }
      .yi-number {
        width: 19.576vw;
        height: 3.6267vw;
        font-size: 2.9333vw;
      }
    }
    .yi-faver {
      position: absolute;
      top: 20%;
      right: 0.2667vw;
      transform: translateY(-50%);
      font-size: 4.8vw;
      transform: scale(1.2);
    }
  }
  .er {
    width: 100%;
    min-height: 7.4667vw;
    font-size: 4.2667vw;
    box-sizing: border-box;
    padding-left: 5.3333vw;
    color: pink;
    word-break: break-all;
    padding-top: 1.3333vw;
  }
  .san {
    width: 100%;
    height: 4.48vw;
    color: grey;
    font-size: 2.6667vw;
    margin-top: 5.3333vw;
  }
}
.xihaun {
  color: pink;
}
.p {
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}
.footer2 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  .text {
    width: 307.21px;
    height: 64.36px;
    outline: none;
    border: 0.8px solid rgb(227, 220, 221);
    font-size: 16px;
    color: #678fb8;
    text-indent: 5px;
  }
  .fabu {
    width: 58px;
    height: 80px;
    border: none;
    border-radius: 10px;
    background-color: #fff;
  }
}
</style>
