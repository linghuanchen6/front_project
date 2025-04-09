<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础数据</el-breadcrumb-item>
      <el-breadcrumb-item>药品管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片容器 -->
    <el-card>

      <el-input v-model="queryCondition.drugName" placeholder="药品名称" style="width: 150px"></el-input>
      <el-input v-model="queryCondition.drugCode" placeholder="药品编码" style="width: 150px"></el-input>
      <el-input v-model="queryCondition.minPrice" placeholder="最低价格" style="width: 150px"></el-input>
      <el-input v-model="queryCondition.maxPrice" placeholder="最高价格" style="width: 150px"></el-input>
      <el-select style="width: 160px;margin-right: 25px" v-model="queryCondition.drugType" placeholder="请选择药品类型">
<!--        <el-option label="全部药品类型" value=""></el-option>-->
        <el-option v-for="drugType in drugTypes" :value="drugType" :label="drugType"/>
      </el-select>
      <el-button type="primary" style="margin-right: 30px" @click="getDrugList">查询</el-button>
      <el-button type="danger" @click="deleteBatch" >批量删除</el-button>
      <el-button type="primary" @click="add">添加药品</el-button>
      <!-- 数据表格 -->
      <el-table :data="drugPage.records" style="width: 80%" stripe border @selection-change="handleSelectionChange">

        <el-table-column type="selection"/>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-tag class="tag" type="warning">药品规格:  {{ props.row.drugFormat }}</el-tag>
              <el-tag class="tag" type="success">生产厂家:  {{ props.row.drugFactory }}</el-tag>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="drugId" label="药品编号" width="180">
        </el-table-column>

        <el-table-column prop="drugName" label="药品名称" width="180">
        </el-table-column>

        <el-table-column prop="drugCode" label="药品编码">
        </el-table-column>
        <el-table-column prop="drugPrice" label="药品单价">
        </el-table-column>
        <el-table-column prop="drugType" label="药品类型">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="modify(scope.row.drugId)" ></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="remove(scope.row.drugId,scope.row.drugName)"></el-button>
          </template>
        </el-table-column>
      </el-table>


      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryCondition.currentPage"
          :page-sizes="[1, 4, 5, 10]"
          :page-size="queryCondition.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="drugPage.total">
      </el-pagination>

    </el-card>
    <el-dialog :title="actionType" :visible.sync="OpenDialog" width="30%" center>
      <el-form :model="formData" :rules="formRules" ref="formRef">
        <el-form-item label="药品名称" label-width="100px" :label-width="drugName">
          <el-input v-model="formData.drugName"></el-input>
        </el-form-item>
        <el-form-item label="药品编码" label-width="100px" :label-width="drugCode">
          <el-input v-model.number="formData.drugCode"></el-input>
        </el-form-item>
        <el-form-item label="药品单价" label-width="100px" :label-width="drugPrice">
          <el-input v-model.number="formData.drugPrice"></el-input>
        </el-form-item>
        <el-form-item label="药品类型" label-width="100px" :label-width="drugType">
          <el-input v-model.number="formData.drugType"></el-input>
        </el-form-item>

        <el-form-item label="药品规格" label-width="100px" :label-width="drugFormat">
        <el-input v-model.number="formData.drugFormat"></el-input>
      </el-form-item>
        <el-form-item label="生产厂家" label-width="100px" :label-width="drugFactory">
          <el-input v-model.number="formData.drugFactory"></el-input>
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

export default{

  //组件使用的数据

  data() {

    return {

      drugPage: {},

      queryCondition:{
        drugName:'',
        drugCode:'',
        drugType:'',
        minPrice:'',
        maxPrice:'',
        currentPage:1,
        pageSize:10,
      },
      drugTypes:['','2', '1'],
      OpenDialog:false,
      actionType:'',
      formData:{
        drugId:0,
        drugName: '',
        drugCode:'',
        drugPrice:0,
        drugType:'',
        drugFormat:'',
        drugFactory:'',
        minPrice:0,
        maxPrice:0,
      },
      formRules:{
        drugName:[
          { required:true, message:'请输入药品名称',trigger:'blur'},
          { max:10, message: '药品名称的长度不能超过十个字符',trigger:'blur'}
        ],

        drugCode:[
          { required:true, message:'请输入药品编码',trigger:'blur'},
          { max:10, message: '药品编码的长度不能超过十个字符',trigger:'blur'}
        ],
        drugPrice:[
          { required:true, message:'请输入药品单价',trigger:'blur'},
          { type:'number', message: '药品单价必须是数字',trigger:'blur'}
        ],
        drugType:[
          { required:true, message:'请输入药品类型',trigger:'blur'},
          { max:10, message: '药品类型的长度不能超过十个字符',trigger:'blur'}
        ],
        drugFormat:[
          { required:true, message:'请输入药品规格',trigger:'blur'},
          { max:20, message: '药品规格的长度不能超过二十个字符',trigger:'blur'}
        ],
        drugFactory:[
          { required:true, message:'请输入生产厂家',trigger:'blur'},
          { trigger:'blur'}
        ],
      },
      drugs:[],
    }
  },
  methods: {
    getDrugList(){
      this.$http.get('/api/drug/list', {params:this.queryCondition}).then(
          res => {
            console.log(res)
            this.drugPage = res.data.data.drugPage
          }
      )
    },
    handleSizeChange(val) {
      this.queryCondition.pageSize = val;
      this.getDrugList();
    },
    handleCurrentChange(val) {
      this.queryCondition.currentPage = val;
      this.getDrugList();
    },
    handleSelectionChange(val){
      this.drugs = val
    },

    add(){
      this.formData={}

      this.actionType='添加药品'

      this.OpenDialog=true
    },
    modify(drugId){
      this.$http.get('/api/drug/get/'+drugId).then(
          res => {
            if(res.data.status == 1){
              this.formData = res.data.data.drug;

              this.actionType='修改药品';

              this.OpenDialog=true;

            }else{
              this.$message.error(res.data.message)
            }
          }
      )
    },
    addOrModify(){
      this.$refs.formRef.validate(
          valid =>{
            if(valid){
              if(this.actionType=='添加药品'){
                this.$http.post('/api/drug/add', this.formData).then(
                    res => {
                      if(res.data.status == 1){
                        this.$message.success(res.data.message)

                        this.getDrugList()
                      }else{
                        this.$message.error(res.data.message)
                      }
                    }
                )
              }else{
                this.$http.put('/api/drug/modify', this.formData).then(
                    res => {
                      if(res.data.status == 1){
                        this.$message.success(res.data.message)

                        this.getDrugList()
                      }else{
                        this.$message.error(res.data.message)
                      }
                    }
                )
              }
              this.OpenDialog= false
            }else{
              this.$message.error("输入数据有误，请检查后再提交")
            }
          }
      )
    },
    deleteBatch(){

      let drugIds = ''
      let drugNames = ''

      this.drugs.forEach( drug => {
        drugIds += drug.drugId + ','
        drugNames += drug.drugName + ','
      })

      drugIds = drugIds.substring(0, drugIds.length - 1)
      drugNames = drugNames.substring(0, drugNames.length - 1)

      const result = this.$confirm(
          '是否确认删除【' + drugNames + '】','删除确认',
          {
            confirmButtonText:'删除',
            cancelButtonText:'取消',
            type:'warning'
          }
      ).then(() => {
        console.log(drugIds)
        this.$http.delete('/api/drug/deleteBatch?drugIds='+drugIds).then(
            res => {
              if(res.data.status == 1){
                this.$message.success(res.data.message)

                this.getDrugList()
              }else{
                this.$message.error(res.data.message)
              }
            }
        )
      }).catch(() => {})
    },

    remove(drugId, drugName){

      this.$confirm(
          '是否确认删除【'+drugName+'】','删除确认',
          {
            confirmButtonText:'删除',
            cancelButtonText:'取消',
            type:'warning'
          }
      ).then(() => {
        this.$http.delete('/api/drug/remove/'+drugId).then(
            res => {
              if(res.data.status == 1){
                this.$message.success(res.data.message)

                this.getDrugList()
              }else{
                this.$message.error(res.data.message)
              }
            }
        )
      }).catch(() => {})
    },
  },

  mounted(){

    this.getDrugList();
  }
}

</script>

<style scoped>
.tag{
  margin-right: 20px;
  margin-left: 10px;
}
</style>
