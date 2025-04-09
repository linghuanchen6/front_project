<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础数据</el-breadcrumb-item>
      <el-breadcrumb-item>医生排班管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片容器 -->
    <el-card>

      <el-input v-model="queryCondition.scheduleName" placeholder="医生排班名称" style="width: 250px"></el-input>
      <el-button type="primary" style="margin-left: 30px" @click="getScheduleList">查询</el-button>
      <el-button type="danger" @click="deleteBatch" class="delete-button">批量删除</el-button>
      <el-button type="primary" @click="add" class="add-button">添加医生排班</el-button>
      <!-- 数据表格 -->
      <el-table :data="schedulePage.records" style="width: 80%" stripe border @selection-change="handleSelectionChange">

        <el-table-column type="selection" />
        <el-table-column prop="scheduleId" label="医生排班编号">
        </el-table-column>

        <el-table-column prop="scheduleName" label="医生排班名称">
        </el-table-column>

        <el-table-column prop="scheduleRule" label="医生排班规则">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="modify(scope.row.scheduleId)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"
              @click="remove(scope.row.scheduleId, scope.row.scheduleName)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryCondition.currentPage" :page-sizes="[2, 4, 5, 10]" :page-size="queryCondition.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="schedulePage.total">
      </el-pagination>

    </el-card>


    <el-dialog :title="actionType" :visible.sync="OpenDialog" width="30%" center>
      <el-form :model="formData" :rules="formRules" ref="formRef">
        <el-form-item label="医生排班名称" label-width="100px" :label-width="scheduleName">
          <el-input v-model="formData.scheduleName" readonly></el-input>
        </el-form-item>
        <el-form-item label="医生排班规则">
          <el-checkbox-group v-model="scheduleRules">
            <el-checkbox v-for="rule in rules" :label="rule.value" @change="handleChange">
              {{ rule.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="OpenDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrModify">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {

  data() {

    return {

      schedulePage: {},

      queryCondition: {
        scheduleName: '',
        currentPage: 1,
        pageSize: 10,
      },
      OpenDialog: false,

      formData: {
        scheduleId: 0,
        scheduleName: '',
        scheduleRule: '',
      },
      formRules: {
        scheduleName: [
          { required: true, message: '请输入医生排班名称名称', trigger: 'blur' },
          { max: 50, message: '医生排班名称的长度不能超过五十个字符', trigger: 'blur' }
        ],
      },
      actionType: '',
      schedules: [],
      scheduleRules: [],
      rules: [
        { label: '周日上午', value: 8192 },
        { label: '周日下午', value: 4096 },
        { label: '周一上午', value: 2048 },
        { label: '周一下午', value: 1024 },
        { label: '周二上午', value: 512 },
        { label: '周二下午', value: 256 },
        { label: '周三上午', value: 128 },
        { label: '周三下午', value: 64 },
        { label: '周四上午', value: 32 },
        { label: '周四下午', value: 16 },
        { label: '周五上午', value: 8 },
        { label: '周五下午', value: 4 },
        { label: '周六上午', value: 2 },
        { label: '周六下午', value: 1 },
      ]
    }
  },
  methods: {
    getScheduleList() {
      this.$http.get('/api/schedule/list', { params: this.queryCondition }).then(
        res => {
          console.log(res)
          this.schedulePage = res.data.data.schedulePage
        }
      )
    },

    handleSizeChange(val) {
      this.queryCondition.pageSize = val;
      this.getScheduleList();
    },
    handleCurrentChange(val) {
      this.queryCondition.currentPage = val;
      this.getScheduleList();
    },

    handleSelectionChange(val) {
      this.schedules = val
    },
    add() {
      this.formData = {}
      this.scheduleRules = []

      this.actionType = '添加医生排班'

      this.OpenDialog = true
    },
    addOrModify() {
      this.$refs.formRef.validate(
        valid => {
          if (valid) {
            if (this.actionType == '添加医生排班') {
              this.$http.post('/api/schedule/add', this.formData).then(
                res => {
                  if (res.data.status == 1) {
                    this.$message.success(res.data.message)

                    this.getScheduleList()
                  } else {
                    this.$message.error(res.data.message)
                  }
                }
              )
            } else {
              this.$http.put('/api/schedule/modify', this.formData).then(
                res => {
                  if (res.data.status == 1) {
                    this.$message.success(res.data.message)

                    this.getScheduleList()
                  } else {
                    this.$message.error(res.data.message)
                  }
                }
              )
            }
            this.OpenDialog = false
          } else {
            this.$message.error("输入数据有误，请检查后再提交")
          }
        }
      )
    },
    modify(scheduleId) {
      this.$http.get('/api/schedule/get/' + scheduleId).then(
        res => {
          if (res.data.status == 1) {
            this.formData = res.data.data.schedule;

            this.actionType = '修改医生排班';

            this.OpenDialog = true;

          } else {
            this.$message.error(res.data.message)
          }
        }
      )
    },

    async remove(scheduleId, scheduleName) {
      let removeEnableFlag = false;

      await this.$http.get('/api/schedule/removeEnable/' + scheduleId).then(
        res => {
          removeEnableFlag = (res.data.status == 1)
        }
      )

      if (removeEnableFlag) {

        const result = await this.$confirm(
          '是否确认删除【' + scheduleName + '】', '删除确认',
          {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        if (result == 'confirm') {
          this.$http.delete('/api/schedule/remove/' + scheduleId).then(
            res => {
              if (res.data.status == 1) {
                this.$message.success(res.data.message)

                this.getScheduleList()
              } else {
                this.$message.error(res.data.message)
              }
            }
          )
        }
      } else {
        this.$message.error('当前挂号级别下存在医生，不能删除')
      }
    },
    async deleteBatch() {

      let scheduleIds = ''
      let scheduleNames = ''

      this.schedules.forEach(schedule => {
        scheduleIds += schedule.scheduleId + ','
        scheduleNames += schedule.scheduleName + ','
      })

      scheduleIds = scheduleIds.substring(0, scheduleIds.length - 1)
      scheduleNames = scheduleNames.substring(0, scheduleNames.length - 1)

      const result = await this.$confirm(
        '是否确认删除【' + scheduleNames + '】', '删除确认',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      if (result == 'confirm') {
        this.$http.delete('/api/schedule/deleteBatch?scheduleIds=' + scheduleIds).then(
          res => {
            if (res.data.status == 1) {
              this.$message.success(res.data.message)

              this.getScheduleList()
            } else {
              this.$message.error(res.data.message)
            }
          }
        )
      }
    },
    handleChange() {
      let weight = 0
      this.scheduleRules.forEach(n => {
        weight += n
      })
      let scheduleRule = weight.toString(2)

      let zero = ''
      for (let i = 0; i < 14 - scheduleRule.length; i++) {
        zero += '0'
      }
      scheduleRule = zero + scheduleRule
      this.formData.scheduleRule = scheduleRule

      let rules = scheduleRule.split("")
      const week = ['日', '一', '二', '三', '四', '五', '六']
      let ruleDay = ''
      for (let i = 0; i < rules.length; i = i + 2) {
        if (rules[i] == '1' && rules[i + 1] == '1') {
          ruleDay = week[i / 2]
          rules[i] = '0'
          rules[i + 1] = '0'
        }
      }
      if (ruleDay != '') {
        ruleDay += '全天'
      }

      let ruleAM = ''
      let rulePM = ''
      for (let i = 0; i < rules.length; i++) {
        if (rules[i] === '1' && i % 2 === 0) {
          ruleAM += week[i / 2]
        }
        if (rules[i] === '1' && i % 2 === 1) {
          rulePM += week[(i - 1) / 2]
        }
      }

      if (ruleAM !== '') {
        ruleAM += '上午'
      }
      if (rulePM !== '') {
        rulePM += '下午'
      }
      this.formData.scheduleName = ruleDay + ' ' + ruleAM + ' ' + rulePM
    }
  },
  mounted() {

    this.getScheduleList();
  }
}
</script>

<style scoped>
.add-button {
  position: absolute;
  right: 80px;
  width: 120px;
}

.delete-button {
  position: absolute;
  right: 240px;
}
</style>