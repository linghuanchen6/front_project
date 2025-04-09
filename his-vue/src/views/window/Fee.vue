<template>
	<div>
		
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>挂号收费</el-breadcrumb-item>
		  <el-breadcrumb-item>窗口收费</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片容器 -->
		<el-card>
			
			<!--查询条件-->
			<el-input v-model="registerId" placeholder="请输入病历号" style="width: 200px;"/>
			<el-button type="primary" @click="getCheckList" >查询</el-button>

			
			<!-- 数据表格 -->
			<el-table :data="checkVOList" stripe border>

        <el-table-column type="index" align="center" width="100"/>
        <el-table-column prop="checkName" label="检查项目名称"/>
        <el-table-column prop="checkAmount" label="检查项目费用"/>
        <el-table-column prop="checkTime" label="检查项目时间"/>

      </el-table>
      <el-tag>总计金额：{{totalAmount}}元</el-tag>
      <el-button type="primary" @click="charge" :disabled="checkVOList.length==0">立即缴费</el-button>

      <el-table :data="drugVOList" stripe border>

        <el-table-column type="index" label="序号" align="center" width="100"/>
        <el-table-column prop="drugName" label="药品名称"/>
        <el-table-column prop="drugPrice" label="药品单价"/>
        <el-table-column prop="quantity" label="药品数量"/>
        <el-table-column prop="totalPrice" label="价格小计(元)"/>
        <el-table-column prop="createTime" label="开药时间"/>

      </el-table>

      <el-tag>总计金额：{{totalAmountDrug}}元</el-tag>

      <el-button type="primary" @click="chargeDrug" :disabled="drugVOList.length==0">立即缴费</el-button>
		</el-card>
	</div>
</template>

<script>
	export default {

      data() {
          return {
            checkVOList: [],
            registerId: '',
            drugVOList:[],
          }
      },

        methods: {
            //
            getCheckList() {
                this.$http.get('/api/request/list/'+ this.registerId).then(

                    res => {
                      this.checkVOList = res.data.data.checkVOList
                      console.log(this.checkVOList)
                    }
                )

              this.$http.get('/api/prescription/list/' + this.registerId + '/1').then(
                  res => {
                    this.drugVOList = res.data.data.drugVOList
                  }
              )
            },

            async charge() {
                const result = await this.$confirm('是否确定缴费【' + this.totalAmount + '】元', '缴费确定');
                if (result == 'confirm') {
                    this.$http.put('/api/request/fee/' + this.registerId).then(
                        res => {
                            if (res.data.status == 1) {
                                this.$message.success(res.data.message)
                                this.registerId = ''
                                this.checkVOList = []
                            } else {
                                this.$message.error(res.data.message)
                            }
                        }
                    )
                }
            },

            async chargeDrug(){
              const  result = await this.$confirm('是否确定药品缴费【' + this.totalAmountDrug + '】元','缴费确认' )

              if(result == 'confirm'){

                this.$http.put('/api/prescription/fee/' + this.registerId).then(
                    res => {
                      if(res.data.status == 1){
                        this.$message.success(res.data.message)

                        this.registerId = ''

                        this.drugVOList = []
                      }else {
                        this.$message.error(res.data.message)
                      }
                    }
                )
              }
            }
        },
        computed: {
            totalAmount() {
                let checkAmount = 0
                this.checkVOList.forEach(checkVO => {
                        checkAmount += checkVO.checkAmount
                    }
                )
                return checkAmount
            },

          totalAmountDrug(){

              let drugAmount = 0

            this.drugVOList.forEach(drugVO => {
              console.log(drugVO)
              drugAmount += drugVO.totalPrice
            })

            return drugAmount
          }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .el-tag{
        margin: 0px 60px;
    }
</style>
