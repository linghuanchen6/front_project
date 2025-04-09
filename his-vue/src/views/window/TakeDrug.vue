<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>挂号收费</el-breadcrumb-item>
      <el-breadcrumb-item>窗口取药</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片容器 -->
    <el-card>

      <!--查询条件-->
      <el-input v-model="registerId" placeholder="请输入病历号" style="width: 200px;"/>
      <el-button type="primary" @click="getDrugList" >查询</el-button>


      <!-- 数据表格 -->
      <el-table :data="drugVOList" stripe border>

        <el-table-column type="index" label="序号" align="center" width="100"/>
        <el-table-column prop="drugName" label="药品名称"/>
        <el-table-column prop="drugPrice" label="药品单价"/>
        <el-table-column prop="quantity" label="药品数量"/>
        <el-table-column prop="totalPrice" label="价格小计(元)"/>
        <el-table-column prop="createTime" label="开药时间"/>

      </el-table>

      <el-button type="primary" @click="takeDrug" :disabled="drugVOList.length==0">立即取药</el-button>
    </el-card>
  </div>
</template>

<script>
export default {

  data() {
    return {
      drugVOList: [],
      registerId: '',
    }
  },

  methods: {
    //
    getDrugList() {
      this.$http.get('/api/prescription/list/'+ this.registerId + '/2').then(

          res => {
            this.drugVOList = res.data.data.drugVOList

          }
      )
    },

    async takeDrug() {
      const result = await this.$confirm('是否确定取出药品' , '取药确认');
      if (result == 'confirm') {
        this.$http.put('/api/prescription/take/' + this.registerId).then(
            res => {
              if (res.data.status == 1) {
                this.$message.success(res.data.message)
                this.registerId = ''
                this.drugVOList = []
              } else {
                this.$message.error(res.data.message)
              }
            }
        )
      }
    },

  },

  mounted() {

  }
}
</script>

<style scoped>

</style>
