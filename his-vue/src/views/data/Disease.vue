<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础数据</el-breadcrumb-item>
      <el-breadcrumb-item>疾病管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片容器 -->
    <el-card>

      <el-input v-model="queryCondition.diseaseName" placeholder="疾病名称" style="width: 250px"></el-input>
      <el-input v-model="queryCondition.diseaseCode" placeholder="疾病编码" style="width: 250px"></el-input>
      <el-button type="primary" style="margin-left: 20px" @click="getDiseaseList">查询</el-button>
      <el-button type="danger" @click="deleteBatch" >批量删除</el-button>
      <el-button type="primary"  @click="add">添加疾病</el-button>
      <!-- 数据表格 -->
      <el-table :data="diseasePage.records" style="width: 80%" stripe border @selection-change="handleSelectionChange">

        <el-table-column type="selection"/>
        <el-table-column prop="diseaseId" label="疾病编号">
        </el-table-column>

        <el-table-column prop="diseaseName" label="疾病名称">
        </el-table-column>

        <el-table-column prop="diseaseCode" label="疾病编码">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="modify(scope.row.diseaseId)" ></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="remove(scope.row.diseaseId,scope.row.diseaseName)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryCondition.currentPage"
          :page-sizes="[2, 4, 5, 10]"
          :page-size="queryCondition.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="diseasePage.total">
      </el-pagination>

    </el-card>


    <el-dialog :title="actionType" :visible.sync="OpenDialog" width="30%" center>
      <el-form :model="formData" :rules="formRules" ref="formRef">
        <el-form-item label="疾病名称" label-width="100px" :label-width="diseaseName">
          <el-input v-model="formData.diseaseName"></el-input>
        </el-form-item>
        <el-form-item label="疾病编码" label-width="100px" :label-width="diseaseCode">
          <el-input v-model="formData.diseaseCode"></el-input>
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
  data(){
    return{
      diseasePage:{},
      queryCondition:{
        diseaseName:'',
        diseaseCode:'',
        currentPage:1,
        pageSize:10,
      },
      OpenDialog:false,

      formData:{
        diseaseId:0,
        diseaseName:'',
        diseaseCode:'',
      },
      formRules:{
        diseaseName:[
          { required:true, message:'请输入疾病名称',trigger:'blur'},
          { max:10, message: '疾病名称的长度不能超过十个字符',trigger:'blur'}
        ],

        diseaseCode:[
          { required:true, message:'请输入疾病编码',trigger:'blur'},
          { trigger:'blur'}
        ]
      },
      actionType:'',
      diseases:[],
    }
  },

  //事件处理方法
  methods: {
    getDiseaseList(){
      this.$http.get('/api/disease/list', {params:this.queryCondition}).then(
          res => {
            console.log(res)
            this.diseasePage = res.data.data.diseasePage
          }
      )
    },
    add(){
      this.formData={}

      this.actionType='添加疾病'

      this.OpenDialog=true
    },
    handleSizeChange(val) {
      this.queryCondition.pageSize = val;
      this.getDiseaseList();
    },
    handleCurrentChange(val) {
      this.queryCondition.currentPage = val;
      this.getDiseaseList();
    },

    handleSelectionChange(val){
      this.diseases = val
    },

    deleteBatch(){

      let diseaseIds = ''
      let diseaseNames = ''

      this.diseases.forEach( disease => {
        diseaseIds += disease.diseaseId + ','
        diseaseNames += disease.diseaseName + ','
      })

      diseaseIds = diseaseIds.substring(0, diseaseIds.length - 1)
      diseaseNames = diseaseNames.substring(0, diseaseNames.length - 1)

      const result = this.$confirm(
          '是否确认删除【' + diseaseNames + '】','删除确认',
          {
            confirmButtonText:'删除',
            cancelButtonText:'取消',
            type:'warning'
          }
      ).then(() => {
        console.log(diseaseIds)
        this.$http.delete('/api/disease/deleteBatch?diseaseIds='+diseaseIds).then(
            res => {
              if(res.data.status == 1){
                this.$message.success(res.data.message)

                this.getDiseaseList()
              }else{
                this.$message.error(res.data.message)
              }
            }
        )
      }).catch(() => {})
    },
    addOrModify(){
      this.$refs.formRef.validate(
          valid =>{
            if(valid){
              if(this.actionType=='添加疾病'){
                this.$http.post('/api/disease/add', this.formData).then(
                    res => {
                      if(res.data.status == 1){
                        this.$message.success(res.data.message)

                        this.getDiseaseList()
                      }else{
                        this.$message.error(res.data.message)
                      }
                    }
                )
              }else{
                this.$http.put('/api/disease/modify', this.formData).then(
                    res => {
                      if(res.data.status == 1){
                        this.$message.success(res.data.message)

                        this.getDiseaseList()
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
    modify(diseaseId){
      this.$http.get('/api/disease/get/'+diseaseId).then(
          res => {
            if(res.data.status == 1){
              this.formData = res.data.data.disease;

              this.actionType='修改疾病';

              this.OpenDialog=true;

            }else{
              this.$message.error(res.data.message)
            }
          }
      )
    },
    remove(diseaseId, diseaseName){

      this.$confirm(
          '是否确认删除【'+diseaseName+'】','删除确认',
          {
            confirmButtonText:'删除',
            cancelButtonText:'取消',
            type:'warning'
          }
      ).then(() => {
        this.$http.delete('/api/disease/remove/'+diseaseId).then(
            res => {
              if(res.data.status == 1){
                this.$message.success(res.data.message)

                this.getDiseaseList()
              }else{
                this.$message.error(res.data.message)
              }
            }
        )
      }).catch(() => {})
    },
  },

  //页面加载时
  mounted(){
    this.getDiseaseList()
  }
}

</script>

<style scoped>

</style>
