<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础数据</el-breadcrumb-item>
      <el-breadcrumb-item>科室管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片容器 -->
    <el-card>

      <el-input v-model="queryCondition.deptName" placeholder="科室名称" style="width: 250px"></el-input>
      <el-input v-model="queryCondition.deptType" placeholder="科室类型" style="width: 250px"></el-input>
      <el-button type="primary" style="margin-left: 20px" @click="getDeptList">查询</el-button>
      <el-button type="danger" @click="deleteBatch" >批量删除</el-button>
      <el-button type="primary"  @click="add">添加科室</el-button>
      <!-- 数据表格 -->
      <el-table :data="deptPage.records" style="width: 80%" stripe border @selection-change="handleSelectionChange">

        <el-table-column type="selection"/>
        <el-table-column prop="deptId" label="科室编号">
        </el-table-column>

        <el-table-column prop="deptName" label="科室名称">
        </el-table-column>

        <el-table-column prop="deptType" label="科室类型">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="modify(scope.row.deptId)" ></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="remove(scope.row.deptId,scope.row.deptName)"></el-button>
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
          :total="deptPage.total">
      </el-pagination>

    </el-card>


    <el-dialog :title="actionType" :visible.sync="OpenDialog" width="30%" center>
      <el-form :model="formData" :rules="formRules" ref="formRef">
        <el-form-item label="科室名称" label-width="100px" :label-width="deptName">
          <el-input v-model="formData.deptName"></el-input>
        </el-form-item>
        <el-form-item label="科室类型" label-width="100px" :label-width="deptType">
          <el-input v-model="formData.deptType"></el-input>
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
      deptPage:{},
      queryCondition:{
        deptName:'',
        deptType:'',
        currentPage:1,
        pageSize:10,
      },
      OpenDialog:false,

      formData:{
        deptId:0,
        deptName:'',
        deptType:'',
      },
      formRules:{
        deptName:[
          { required:true, message:'请输入科室名称',trigger:'blur'},
          { max:10, message: '科室名称的长度不能超过十个字符',trigger:'blur'}
        ],

        deptType:[
          { required:true, message:'请输入科室类型',trigger:'blur'},
          { trigger:'blur'}
        ]
      },
      actionType:'',
      depts:[],
    }
  },

  //事件处理方法
  methods: {
    getDeptList(){
      this.$http.get('/api/dept/list', {params:this.queryCondition}).then(
          res => {
            console.log(res)
            this.deptPage = res.data.data.deptPage
          }
      )
    },
    add(){
      this.formData={}

      this.actionType='添加科室'

      this.OpenDialog=true
    },
    handleSizeChange(val) {
      this.queryCondition.pageSize = val;
      this.getDeptList();
    },
    handleCurrentChange(val) {
      this.queryCondition.currentPage = val;
      this.getDeptList();
    },

    handleSelectionChange(val){
      this.depts = val
    },

    deleteBatch(){

      let deptIds = ''
      let deptNames = ''

      this.depts.forEach( dept => {
        deptIds += dept.deptId + ','
        deptNames += dept.deptName + ','
      })

      deptIds = deptIds.substring(0, deptIds.length - 1)
      deptNames = deptNames.substring(0, deptNames.length - 1)

      const result = this.$confirm(
          '是否确认删除【' + deptNames + '】','删除确认',
          {
            confirmButtonText:'删除',
            cancelButtonText:'取消',
            type:'warning'
          }
      ).then(() => {
        console.log(deptIds)
        this.$http.delete('/api/dept/deleteBatch?deptIds='+deptIds).then(
            res => {
              if(res.data.status == 1){
                this.$message.success(res.data.message)

                this.getDeptList()
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
              if(this.actionType=='添加科室'){
                this.$http.post('/api/dept/add', this.formData).then(
                    res => {
                      if(res.data.status == 1){
                        this.$message.success(res.data.message)

                        this.getDeptList()
                      }else{
                        this.$message.error(res.data.message)
                      }
                    }
                )
              }else{
                this.$http.put('/api/dept/modify', this.formData).then(
                    res => {
                      if(res.data.status == 1){
                        this.$message.success(res.data.message)

                        this.getDeptList()
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
    modify(deptId){
      this.$http.get('/api/dept/get/'+deptId).then(
          res => {
            if(res.data.status == 1){
              this.formData = res.data.data.dept;

              this.actionType='修改科室';

              this.OpenDialog=true;

            }else{
              this.$message.error(res.data.message)
            }
          }
      )
    },
    remove(deptId, deptName){

      this.$confirm(
          '是否确认删除【'+deptName+'】','删除确认',
          {
            confirmButtonText:'删除',
            cancelButtonText:'取消',
            type:'warning'
          }
      ).then(() => {
        this.$http.delete('/api/dept/remove/'+deptId).then(
            res => {
              if(res.data.status == 1){
                this.$message.success(res.data.message)

                this.getDeptList()
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
    this.getDeptList()
  }
}

</script>

<style scoped>

</style>
