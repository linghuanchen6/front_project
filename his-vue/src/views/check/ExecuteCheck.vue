<template>
	<div>
		
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>检查检验</el-breadcrumb-item>
		  <el-breadcrumb-item>执行检查</el-breadcrumb-item>
		</el-breadcrumb>
        <el-input v-model="queryCondition.registerId" placeholder="请输入病历号" clearable style="width: 240px"/>
        <el-select v-model="queryCondition.status" placeholder="请选择" style="width: 160px;margin-right: 20px">
            <el-option label="全部状态" value=""/>
            <el-option label="未缴费" value="1"/>
            <el-option label="已缴费" value="2"/>
            <el-option label="已出结果" value="3"/>
        </el-select>
        <el-button type="primary" @click="getCheckList">查询</el-button>
        <el-table :data="checkRequestVOList" stripe border >

            <el-table-column type="index" label="序号" align="center"/>

            <el-table-column prop="requestId" label="病历号" />
            <el-table-column prop="patientName" label="患者姓名" />
            <el-table-column prop="checkName" label="检查名称" />
            <el-table-column prop="status" label="检查状态" />
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini"
                               @click="execute(scope.row)" v-if="scope.row.status=='已缴费'"> <!--若已缴费则可进行检查-->
                        执行检查
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

	</div>
</template>

<script>

    export default {

        data() {

            return {
                //分页对象！

                checkRequestVOList: [],
                //查询条件对象
                queryCondition: {
                    status: '2',
                    registerId: '',

                },
            }
        },

      methods: {

          //
        getCheckList() {

              this.$http.get('/api/request/list', {params: this.queryCondition}).then(
                  res => {

                    console.log(res.data.data.checkRequestVOList)
                      this.checkRequestVOList = res.data.data.checkRequestVOList
                      console.log(this.checkRequestVOList)
                      this.checkRequestVOList.forEach(check => {
                          if (check.status == 1) {
                              check.status = "未缴费"
                          } else if (check.status == 2) {
                              check.status = "已缴费"
                          } else {
                              check.status = "已出结果"
                          }
                      })

                  }
              )
          },
          execute(checkRequest) {

              // console.log(checkRequest)
              this.$router.push({path: '/inputResult', query: {checkRequest: checkRequest}})
          },
      },
      mounted() {
        this.getCheckList();
      }
    }
</script>

<style scoped>
.add-button{
	position: absolute;
	right: 40px;
}
.delete-button{
	position: absolute;
	right: 160px;
}
</style>
