<template>
  <el-container>
    <el-header>
      <div class="logo-box">
        <img src="../assets/heima.png" alt>
        <span>电商管理平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isshow?'65px':'200px'">
        <div class="toggle_bar" @click="isshow=!isshow" :style="{width:isshow?'65px':'200px'}">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse-transition="false"
          :collapse="isshow"
        >
          <el-submenu
            :index="item.path"
            :width="isshow?'65px':'200px'"
            v-for="(item , k) in Menulist "
            :key="item.id"
          >
            <template slot="title">
              <i :class="'iconfont icon-' +iconlist[k]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="item2 in item.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              {{ item2.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.getmenulist()
  },
  methods: {
    logout () {
      this.$confirm('确定要退出吗', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {})
    },
    async getmenulist () {
      const { data: dt } = await this.$http.get('/menus')
      // console.log(dt)
      if (dt.meta.status === 200) {
        return (this.Menulist = dt.data)
        // console.log(this.Menulist)
      }
    }
  },
  data () {
    return {
      iconlist: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao'],
      Menulist: [],
      isshow: false
    }
  }
}
</script>

<style lang="less" scoped>
.toggle_bar {
  color: #fff;
  text-align: center;
  height: 25px;
  line-height: 25px;
  font-size: 12px;
  //鼠标小手
  cursor: pointer;
  // 字间距
  letter-spacing: 0.1em;
  // 用户选中 禁止
  user-select: none;
}
.el-container {
  height: 100%;
  .el-aside {
    background-color: #333744;
  }
}
.el-header {
  background-color: #373d41;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 20px;
  .logo-box {
    display: flex;
    font-size: 22px;
    color: #fff;
    align-items: center;
    user-select: none;
    img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
  }
}
</style>
