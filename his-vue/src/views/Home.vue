<template>
  <!-- 顶层容器 -->
  <el-container class="root_container">

    <!-- 头部区 -->
    <el-header>

      <img src="@/assets/image/logo.png" />
      <span>东软云医院HIS管理系统</span>
      <span class="user-info">
        <i class="el-icon-user"></i>用户名：【{{ currentUser.doctorName }}】
      </span>
      <span class="user-info">
        <i class="el-icon-bank-card"></i>用户类型：【{{ doctorType }}】
      </span>
      <span class="user-info" v-if="currentUser.doctorType == 1 || currentUser.doctorType == 2">
        <i class="el-icon-copy-document"></i>科室名称：【{{ deptName }}】
      </span>
      <el-button type="primary" @click="logout">退出</el-button>

    </el-header>

    <el-container>

      <!-- 左侧菜单区  -->
      <el-aside width="200px">

        <el-menu background-color="#48c0a3" text-color="white" active-text-color="#ffd04b" unique-opened router>

          <!-- 基础数据维护 -->
          <el-submenu index="1" v-if="currentUser.doctorType == 1">

            <template slot="title">
              <i class="el-icon-location"></i>
              <span>医生诊疗</span>
            </template>
            <el-menu-item index="receive">
              <i class="el-icon-menu"></i>
              <span>医生接诊</span>
            </el-menu-item>
            <el-menu-item index="insure">
              <i class="el-icon-menu"></i>
              <span>医生确诊</span>
            </el-menu-item>

          </el-submenu>
          <el-submenu index="2" v-if="currentUser.doctorType == 2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>检查检验</span>
            </template>
            <el-menu-item index="execute">
              <i class="el-icon-menu"></i>
              <span>执行检查</span>
            </el-menu-item>
            <el-menu-item index="inputResult">
              <i class="el-icon-menu"></i>
              <span>录入结果</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3" v-if="currentUser.doctorType == 3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>挂号收费</span>
            </template>
            <el-menu-item index="register">
              <i class="el-icon-menu"></i>
              <span>窗口挂号</span>
            </el-menu-item>
            <el-menu-item index="fee">
              <i class="el-icon-menu"></i>
              <span>窗口收费</span>
            </el-menu-item>
            <el-menu-item index="takeDrug">
              <i class="el-icon-menu"></i>
              <span>窗口取药</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4" v-if="currentUser.doctorType == 4">

            <template slot="title">
              <i class="el-icon-location"></i>
              <span>基础数据维护</span>
            </template>
            <el-menu-item index="level" style="height:40px">
              <i class="el-icon-menu"></i>
              <span>挂号级别</span>
            </el-menu-item>

            <el-menu-item index="dept" style="height:40px">
              <i class="el-icon-menu"></i>
              <span>科室管理</span>
            </el-menu-item>

            <el-menu-item index="disease" style="height:40px">
              <i class="el-icon-menu"></i>
              <span>疾病管理</span>
            </el-menu-item>

            <el-menu-item index="drug" style="height:40px">
              <i class="el-icon-menu"></i>
              <span>药品管理</span>
            </el-menu-item>

            <el-menu-item index="check" style="height:40px">
              <i class="el-icon-menu"></i>
              <span>检查项目管理</span>
            </el-menu-item>

            <el-menu-item index="schedule" style="height:40px">
              <i class="el-icon-menu"></i>
              <span>医生排班管理</span>
            </el-menu-item>

            <el-menu-item index="doctor" style="height:40px">
              <i class="el-icon-menu"></i>
              <span>医生管理</span>
            </el-menu-item>

          </el-submenu>

        </el-menu>

      </el-aside>

      <!-- 右侧主体区 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view />
      </el-main>


    </el-container>
  </el-container>
</template>

<script>

export default {
  data() {
    return {
      currentUser: {},

      doctorType: this.$route.query.doctorType,

      deptName: this.$route.query.deptName,
    }
  },
  methods: {
    logout() {
      const result = this.$confirm(
        '是否确认退出系统', '退出确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$http.post('/api/doctor/logout').then(
          res => {
            if (res.data.status == 1) {
              sessionStorage.removeItem("currentUser")

              localStorage.removeItem("loginInfo")

              this.$message.success(res.data.message)

              this.$router.push("/login")
            }
          }
        )
      }).catch(() => { })

    }
  },
  mounted() {

    if (sessionStorage.getItem("currentUser") != null) {
      this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"))
    }
  }
}

</script>

<style scoped>
.el-header {
  background-color: #48c0a3;
  color: white;
  font-size: 24px;

  /* 弹性布局 */
  display: flex;
  justify-content: space-between;
  align-items: center;

}

.el-aside {
  background-color: #48c0a3;
}

.root_container {
  height: 100%;
}

.el-menu {
  border-right: none;
}

.user-info {
  color: ffffff;
  font-size: 16px;
}
</style>
