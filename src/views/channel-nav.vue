<template>
  <div class="channel-container">
    <van-nav-bar title="频道管理" left-text="返回" @click-left="onClickLeft" />
    <!-- //上盒子 -->
    <div class="main-top">
      <div class="top">
        <span class="yi">
          我的频道:
          <span class="yi-yi" ref="chanchu" @click="$router.back()">
            点击进入频道
          </span>
        </span>
        <span class="er" ref="edite" @click="bianji">编辑</span>
      </div>
      <div class="bottom">
        <ul>
          <li v-for="(item, index) in bjList" :key="index">
            <span class="lison">{{ item.name }}</span>
            <span class="cha" @click="del(index)" v-if="chahao">×</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- //下盒子 -->
    <div class="main-top">
      <div class="top">
        <span class="yi"> 点击添加更多频道 </span>
      </div>
      <div class="bottom">
        <ul>
          <li @click="add(item.id)" v-for="(item,index) in allList" :key="index"><span class="lison">{{item.name}}</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import request from '@/utils/request.js'
export default {
  data() {
    return {
      bjList: [],
      // 控制查号的显示与隐藏
      chahao: false,
      // 控制函数的变量
      flag: false,
      // 全部频道的数据
      allList: [],
      xuhao: 0,
      arrdata: [],
      kong: false,
      arrmsg: []
    }
  },
  created() {
    // getsome
    this.httpSomechannel()
    // put
    // this.httpChannel()
  },
  methods: {
    // top的cahnnel
    httpSomechannel() {
      const token = sessionStorage.getItem('token')
      request.get('/v1_0/user/channels', { headers: { Authorization: 'Bearer ' + token } }).then((res) => {
        this.bjList = res.data.data.channels
        // getall
        this.httpAllchannel()
      })
    },
    // 设置相关的频道列表请求

    // 全部频道的请求
    async httpAllchannel() {
      const { data: res } = await request.get('/v1_0/channels')
      this.allList = res.data.channels
      // TODO完成数组去重拿到过滤后的新数据
      this.allList = this.allList.filter((item) => {
        return !this.bjList.some((other) => {
          return other.id === item.id || other.name === item.name
        })
      })
    },
    onClickLeft() {
      this.$router.back()
      // TODO:完成模糊查询以及文章具体展示
    },
    async add(id) {
      if (this.kong) {
        this.xuhao += 1
        this.arrdata.push({ id: id })
        const arr2 = []
        this.bjList.forEach((item) => {
          const o = { id: item.id }
          arr2.push(o)
        })
        const newarr = [...this.arrdata, ...arr2]
        console.log(newarr)
        const token = sessionStorage.getItem('token')
        const userdata = {
          'channels': newarr
        }
        const { data: res } = await request.put('/v1_0/user/channels', userdata, {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        })
        // 完成具体的设置频道
        console.log(res)
        location.reload()
        // console.log(this.bjList)
      }
    },
    // 点击编辑做的事
    bianji() {
      this.kong = true
      if (this.flag === false) {
        // 一点击编辑就让叉号出现
        this.chahao = true
        // 让文字变化
        this.$refs.chanchu.innerHTML = '点击删除频道'
        // 让自己的文字变成完成
        this.$refs.edite.innerHTML = '完成'
        this.flag = true
      } else {
        // 一点击编辑就让叉号出现
        this.chahao = false
        // 让文字变化
        this.$refs.chanchu.innerHTML = '点击进入频道'
        // 让自己的文字变成完成
        this.$refs.edite.innerHTML = '编辑'
        this.flag = false
      }
    },
    // 点击叉号的回调函数
    async del(index) {
    //   const msgid = this.bjList[index].id
      this.bjList.splice(index, 1)
      this.bjList.forEach((item) => {
        this.arrmsg.push({ id: item.id })
      })
      const token = sessionStorage.getItem('token')
      const userdata = {
        'channels': this.arrmsg
      }
      console.log(userdata)
      const { data: res } = await request.put('/v1_0/user/channels', userdata, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      })
      this.$router.go(0)
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar__title {
  color: #fff;
  font-size: 4.2667vw;
  font-weight: 500;
}
.main-top {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 44.248vw;
  .top {
    display: flex;
    justify-content: space-between;
    height: 7.4667vw;
    .yi {
      width: 40vw;
      height: 7.4667vw;
      line-height: 7.4667vw;
      font-size: 3.7333vw;
      padding-left: 2.6667vw;
      .yi-yi {
        color: grey;
        font-size: 2.6667vw;
      }
    }
    .er {
      width: 7.4667vw;
      height: 7.4667vw;
      line-height: 7.4667vw;
      color: rgb(5, 4, 4);
      font-size: 3.7333vw;
      padding-right: 1.3333vw;
    }
  }
  .bottom {
    height: 36.7813vw;
    ul {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      margin-left: 1.3333vw;
      li {
        position: relative;
        width: 25%;
        height: 12.2613vw;
        font-size: 2.9333vw;
      }
      .cha {
        position: absolute;
        top: -1.6vw;
        right: 6px;
        color: lightcoral;
        font-size: 5.8667vw;
      }
      .lison {
        position: absolute;
        top: 0;
        left: 0;
        width: 22.3547vw;
        height: 9.6vw;
        background-color: #fafafa;
        border: 0.2667vw solid rgb(255, 218, 218);
        text-align: center;
        line-height: 9.6vw;
      }
    }
  }
}
</style>
