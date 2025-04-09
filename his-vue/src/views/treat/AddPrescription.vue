<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>医生诊疗</el-breadcrumb-item>
      <el-breadcrumb-item>确诊病历和开具处方</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片容器 -->
    <el-card>
      <el-divider>患者信息</el-divider>
      <el-tag>病历号：{{ register.registerId }}</el-tag>
      <el-tag type="success">患者姓名：{{ register.patientName }}</el-tag>
      <el-tag type="warning">患者性别：{{ register.patientGender }}</el-tag>

      <el-divider>确诊信息</el-divider>

      诊断结果
      <el-input v-model="result" placeholder="请输入诊断结果" style="width:450px"/>

      确诊疾病
      <el-select v-model="diseaseId" style="width:150px;margin-right: 30px;margin-left: 10px">

        <el-option v-for="disease in diseaseList" :label="disease.diseaseName" :value="disease.diseaseId"/>

      </el-select>

      <el-button type="primary" @click="insure">确诊病历</el-button>

      <el-divider>开具处方</el-divider>

      <el-button type="primary" @click="openDialog">添加新药品</el-button>

      <el-button type="seccuss" @click="addPrescription" class="add-button">开具处方</el-button>

      <el-table :data="drugList" stripe border>

        <el-table-column type="index" label="序号" width="100px" align="center"/>

        <el-table-column prop="drugName" label="药品名称"/>
        <el-table-column prop="drugPrice" label="药品单价(元)"/>
        <el-table-column prop="quantity" label="药品数量"/>
        <el-table-column prop="times" label="每日次数"/>
        <el-table-column prop="count" label="每日用量"/>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteDrug(scope.row.drugId,scope.row.drugName)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--对话框-->
    <el-dialog title="添加新药品" :visible.sync="openDialogFlag" width="50%" center>

      <el-input v-model="queryCondition.drugName" placeholder="药品名称" style="width: 180px;" clearable/>
      <el-input v-model="queryCondition.drugCode" placeholder="药品编码" style="width: 180px;" clearable/>

      <el-button type="primary" @click="getDrugList">查询</el-button>
      <el-button type="primary" @click="clear">清空</el-button>

      <el-table :data="drugListDialog" stripe border @selection-change="handleSelectionChange">

        <el-table-column type="selection"/>

        <el-table-column label="expand">
          <template slot-scope="scope">
            <el-input v-model="scope.row.quantity" placeholder="药品数量" style="width: 150px;" class="drug-usage"/>
            <el-input v-model="scope.row.times" placeholder="每日次数" style="width: 150px;" class="drug-usage"/>
            <el-input v-model="scope.row.count" placeholder="每日用量" style="width: 150px;" class="drug-usage"/>
          </template>
        </el-table-column>

        <el-table-column prop="drugName" label="药品名称"/>
        <el-table-column prop="drugCode" label="药品编码"/>
        <el-table-column prop="drugPrice" label="药品单价(元)"/>

      </el-table>
      <!--底部区域-->
      <div slot="footer">

        <el-button @click="openDialogFlag=false">取消</el-button>

        <el-button type="primary" @click="addDrugDialog">确定</el-button>

      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {

  data() {

    return {

      register: this.$route.query.register,

      result: '',

      diseaseId: '',

      diseaseList: [],

      drugList: [],

      openDialogFlag: false,

      queryCondition: {
        drugName: '',
        drugCode: '',
      },

      drugListDialog: [],

      drugsDialog: [],


    }
  },

  methods: {
    insure() {
      let fd = new FormData();

      fd.append('registerId', this.register.registerId);
      fd.append('result', this.result);
      fd.append('diseaseId', this.diseaseId);

      this.$http.put('/api/register/insure', fd).then(
          res => {

            if (res.data.status == 1) {

              this.$message.success('病历号【' + this.register.registerId + '】确诊成功');

            } else {

              this.$message.error('病历号【' + this.register.registerId + '】确诊失败');

            }
          }
      )
    },

    openDialog() {
      this.queryCondition.drugCode = ''
      this.queryCondition.drugName = ''

      this.drugListDialog = []
      this.openDialogFlag = true
    },

    getDrugList() {
      this.$http.get('/api/drug/listAll', {params: this.queryCondition}).then(
          res => {
            this.drugListDialog = res.data.data.drugList

          }
      )
    },

    clear() {
      this.queryCondition.drugCode = ''
      this.queryCondition.drugName = ''

      this.drugListDialog = []
    },


    //多选操作
    handleSelectionChange(val) {

      this.drugsDialog = val;
    },


    async addDrugDialog() {

      const result = await this.$confirm('是否确认添加药品', '确认添加')
      if (result == 'confirm') {

        this.drugsDialog.forEach(drug => {
          let existFlag = false;
          this.drugList.forEach(drugItem => {
            if (drugItem.drugId == drug.drugId) {
              existFlag = true
            }
          })
          if (!existFlag) {
            drug.registerId = this.register.registerId
            this.drugList.push(drug)
          }

        })

        this.openDialogFlag = false

      }
    },


    async deleteDrug(drugId, drugName) {

      const result = await this.$confirm('是否确认删除【' + drugName + '】', '确认删除')

      if (result == 'confirm') {

        const index = this.drugList.findIndex(drug => {
          return drug.drugId == drugId
        })
        this.drugList.splice(index, 1)

      }
    },

    //
    async addPrescription() {

      if (this.drugList.length == 0) {

        this.$message.error("至少要选择一种药品")
        return
      }

      const result = await this.$confirm('是否确认开具处方', '确认开具')

      if (result == 'confirm') {

        this.$http.post('/api/prescription/add', this.drugList).then(
            res => {

              if (res.data.status == 1) {

                this.$message.success(res.data.message)

                this.$router.push('/insure')

              } else {

                this.$message.error(res.data.message)

              }
            }
        )
      }
    }
  },


  mounted() {
    this.$http.get('/api/disease/listAll').then(
        res => {
          this.diseaseList = res.data.data.diseaseList
        }
    )
  }
}
</script>

<style scoped>
.el-tag {
  margin: 10px;
}

.add-button {
  position: absolute;
  right: 84px;
}

.drug-usage {
  margin-left: 22px;
}
</style>
