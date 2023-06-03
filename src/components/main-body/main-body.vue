<template>
  <div class="main-body-container">
    <div class="main" @click="detail">
      <!-- //只有一张图情况时候的插槽-->
      <slot name="yi"></slot>
      <!-- //有三张图情况时候的插槽-->
      <slot name="er"></slot>
      <!-- //没有图情况时候的插槽-->
      <slot name="san"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      itemId: this.id
    }
  },
  methods: {
    // 点击每一个进入详情页
    detail() {
      const id = this.itemId
      this.$router.push('/detail/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
.main-body-container {
  color: aqua;
}
.main {
  width: 100%;
  .main-one {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 2.6667vw;
  }
  .main-one-yi {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 18.6667vw;
  }
  .main-one-yi .wenzi {
    max-width: 59.7813vw;
    word-wrap: break-word;
    color: #323233;
    font-size: 4vw;
  }
  .main-one-yi img {
    width: 30.1333vw;
    height: 18.6667vw;
    border: 0.2667vw solid #969799;
  }
  .main-one-er {
    width: 100%;
    height: 4.8vw;
    margin-top: 0.8vw;
    span {
      color: #969799;
      font-size: 2.6667vw;
      line-height: 4.8vw;
      margin-right: 1.3333vw;
    }
  }
  .main-two {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 3.2vw;
    // min-height: 116px;
    .main-two-yi {
      width: 100%;
      min-height: 6.4vw;
      flex: 1;
      word-wrap: break-word;
      color: #323233;
      font-size: 4vw;
    }
    .main-two-er {
      width: 100%;
      height: 18.6667vw;
      flex: 1;
      img {
        width: 30.1333vw;
        height: 18.6667vw;
        border: 0.2667vw solid #969799;
        margin: 0.8vw 0px 0px 0px;
      }
    }
    .main-two-san {
      width: 100%;
      height: 4.8vw;
      flex: 1;
    }
    .main-two-san span {
      color: #969799;
      font-size: 2.6667vw;
      line-height: 4.8vw;
      margin-right: 1.3333vw;
    }
  }
  .main-three {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
    margin: 2.6667vw 0;
    .main-three-yi {
      width: 100%;
      flex: 1;
      min-height: 6.4vw;
      color: #323233;
      font-size: 4vw;
      word-wrap: break-word;
    }
    .main-three-er {
      width: 100%;
      height: 4.8vw;
      flex: 1;
      margin-top: -1.3333vw;
      span {
        color: #969799;
        font-size: 2.6667vw;
        line-height: 4.8vw;
        margin-right: 1.3333vw;
      }
    }
  }
}
</style>
