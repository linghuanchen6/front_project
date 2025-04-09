<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础数据</el-breadcrumb-item>
      <el-breadcrumb-item>医生管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片容器 -->
    <el-card>
      <el-input v-model="queryCondition.doctorName" placeholder="请输入医生名称" style="width: 200px"/>
      <el-select style="width: 160px;margin-right: 25px" v-model="queryCondition.doctorType" placeholder="请选择医生类型" @change="changeDoctorType">
        <el-option label="全部类型" value=""></el-option>
        <el-option v-for="doctorType in doctorTypes" :value="doctorType.typeId" :label="doctorType.typeName"/>
      </el-select>
      <el-select style="width: 160px;margin-right: 25px" v-model="queryCondition.deptId" placeholder="请选择所属科室" v-if="queryCondition.doctorType===1 || queryCondition.doctorType === 2">
        <el-option label="全部科室" value=""></el-option>
        <el-option v-for="dept in deptList" :value="dept.deptId" :label="dept.deptName"/>
      </el-select>
      <el-select style="width: 160px;margin-right: 25px" v-model="queryCondition.doctorType" placeholder="请选择医生级别" v-if="queryCondition.doctorType===1">
        <el-option label="全部级别" value=""></el-option>
        <el-option v-for="level in levelList" :value="level.levelId" :label="level.levelName"/>
      </el-select>
      <el-button type="primary" style="margin-right: 30px" @click="getDoctorList">查询</el-button>
      <el-button type="danger" @click="deleteBatch" >批量删除</el-button>
      <el-button type="primary" @click="add">添加医生</el-button>
      <!-- 数据表格 -->
      <el-table :data="doctorVOPage.records" style="width: 80%" stripe border @selection-change="handleSelectionChange">

        <el-table-column type="selection"/>
        <el-table-column label="医生头像">
          <template slot-scope="scope" v-if="scope.row.photo != null">
            <el-avatar :src="'/api/image/photo/'+scope.row.photo" :size="50"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="doctorName" label="医生名称">
        </el-table-column>
        <el-table-column prop="doctorType" label="医生类型">
        </el-table-column>
        <el-table-column prop="deptName" label="所属科室">
        </el-table-column>
        <el-table-column prop="levelName" label="医生级别">
        </el-table-column>
        <el-table-column prop="scheduleName" label="医生排班">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="modify(scope.row.doctorId)" ></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="remove(scope.row.doctorId,scope.row.doctorName)"></el-button>
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
          :total="doctorVOPage.total">
      </el-pagination>

    </el-card>
    <el-dialog :title="actionType" :visible.sync="OpenDialog" width="30%" center>
      <el-form :model="formData" :rules="formRules" ref="formRef">
        <el-form-item label="医生名称" label-width="100px" prop="doctorName">
          <el-input v-model="formData.doctorName"></el-input>
        </el-form-item>
        <el-form-item label="登陆密码" prop="password">
          <el-input v-model.number="formData.password"></el-input>
        </el-form-item>
        <el-form-item label="医生类型" prop="doctorType">
          <el-select v-model="formData.doctorType" placeholder="请选择医生类型" @change="changeDoctorType">
            <el-option v-for="doctorType in doctorTypes" :value="doctorType.typeId" :label="doctorType.typeName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属科室" prop="deptId" v-if="formData.doctorType==1">
          <el-select v-model="formData.deptId" placeholder="请选择医生科室">
            <el-option v-for="dept in deptList" :value="dept.deptId" :label="dept.deptName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医生级别" prop="levelId" v-if="formData.doctorType==1">
          <el-select v-model="formData.levelId" placeholder="请选择医生级别">
            <el-option v-for="level in levelList" :value="level.levelId" :label="level.levelName"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="医生排班" prop="scheduleId" v-if="formData.doctorType==1">
          <el-select v-model="formData.scheduleId" placeholder="请选择医生排班">
            <el-option v-for="schedule in scheduleList" :value="schedule.scheduleId" :label="schedule.scheduleName"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="医生照片">
          <el-upload action="/api/doctor/upload" :on-success="uploadSuccess" :before-upload="beforeUpload" list-type="picture" :limit="1">
            <el-button size="small" type="primary">选择头像</el-button>
            <div slot="tip" style="color: red;font-size: 12px">文件格式必须是图片，大小不能超过100KB</div>
          </el-upload>
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

      doctorVOPage: {},

      queryCondition:{
        doctorName:'',
        doctorType:'',
        levelId:'',
        deptId:'',
        currentPage:1,
        pageSize:10,
      },
      drugTypes:['','2', '1'],
      OpenDialog:false,
      actionType:'',
      formData:{
        doctorName:'',
        doctorId: 0,
        password:'',
        levelId:0,
        deptId:'',
        scheduleId:'',
        doctorType: ''
      },
      formRules:{
        doctorName:[
          { required:true, message:'请输入医生名称',trigger:'blur'},
          { max:10, message: '医生名称的长度不能超过十个字符',trigger:'blur'}
        ],
        password:[
          { required:true, message:'请输入登陆密码',trigger:'blur'},
          { max:10, message: '登陆密码的长度不能超过十个字符',trigger:'blur'}
        ],

        doctorType:[
          { required:true, message:'请选择医生类型',trigger:'blur'},
        ],
        levelId:[
          { required:true, message:'请选择医生级别',trigger:'blur'},
        ],
        deptId:[
          { required:true, message:'请选择医生科室',trigger:'blur'},
        ],
        scheduleId:[
          { required:true, message:'请选择医生排班',trigger:'blur'},
        ],
      },
      doctors:[],
      doctorTypes:[
        {typeId:1,typeName: '门诊医生'},
        {typeId:2,typeName: '检查医生'},
        {typeId:3,typeName: '挂号收费'},
        {typeId:4,typeName: '管理员'}
      ],
      doctorDeptList:[],
      checkDeptList:[],
      deptList:[],
      levelList:[],
      scheduleList:[]
    }
  },
  methods: {

    beforeUpload(file){
      if(file.type.substring(0,5) != 'image'){
        this.$message.error("医生照片的文件格式必须是图片")
        return false
      }
      if(file.size > 1024 * 100){
        this.$message.error("大小不能超过100KB")
        return false
      }
      return true
    },
    uploadSuccess(res,file,fileList){
      if(res.status == 1){
        console.log(res)
        this.formData.photo = res.data.serverFilename
        this.$message.success(res.message)
      }
    },
    changeDoctorType(doctorType){
      if(doctorType == 1){
        this.deptList = this.doctorDeptList
        console.log(this.deptList)
      }else if(doctorType == 2){
        this.deptList = this.checkDeptList
      }
      this.queryCondition.deptId = ''
      this.queryCondition.levelId = ''
      this.queryCondition.scheduleId = ''
    },
    getDoctorList(){
      this.$http.get('/api/doctor/list', {params:this.queryCondition}).then(
          res => {

            this.doctorVOPage = res.data.data.doctorVOPage

            this.doctorVOPage.records.forEach(doctor =>{
              if(doctor.doctorType === 1){
                doctor.doctorType= '门诊医生'
              }else if(doctor.doctorType === 2){
                doctor.doctorType= '检查验医生'
              }else if(doctor.doctorType === 3){
                doctor.doctorType= '挂号收费'
              }else {
                doctor.doctorType= '管理员'
              }
            })
          }
      )
    },
    handleSizeChange(val) {
      this.queryCondition.pageSize = val;
      this.getDoctorList();
    },
    handleCurrentChange(val) {
      this.queryCondition.currentPage = val;
      this.getDoctorList();
    },
    handleSelectionChange(val){
      this.doctors = val
    },

    add(){
      this.formData={}

      this.actionType='添加医生'

      this.OpenDialog=true
    },
    modify(doctorId){
      this.$http.get('/api/doctor/get/'+doctorId).then(
          res => {
            if(res.data.status == 1){
              this.formData = res.data.data.doctor;

              this.actionType='修改医生';

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
              if(this.actionType==='添加医生'){
                this.$http.post('/api/doctor/add', this.formData).then(
                    res => {
                      if(res.data.status == 1){
                        this.$message.success(res.data.message)

                        this.getDoctorList()
                      }else{
                        this.$message.error(res.data.message)
                      }
                    }
                )
              }else{
                this.$http.put('/api/doctor/modify', this.formData).then(
                    res => {
                      if(res.data.status === 1){
                        this.$message.success(res.data.message)

                        this.getDoctorList()
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

      let doctorIds = ''
      let doctorNames = ''

      this.doctors.forEach( doctor => {
        doctorIds += doctor.doctorId + ','
        doctorNames += doctor.doctorName + ','
      })

      doctorIds = doctorIds.substring(0, doctorIds.length - 1)
      doctorNames = doctorNames.substring(0, doctorNames.length - 1)

      const result = this.$confirm(
          '是否确认删除【' + doctorNames + '】','删除确认',
          {
            confirmButtonText:'删除',
            cancelButtonText:'取消',
            type:'warning'
          }
      ).then(() => {

        this.$http.delete('/api/doctor/deleteBatch?doctorIds='+doctorIds).then(
            res => {
              if(res.data.status == 1){
                this.$message.success(res.data.message)

                this.getDoctorList()
              }else{
                this.$message.error(res.data.message)
              }
            }
        )
      }).catch(() => {})
    },

    remove(doctorId, doctorName){

      this.$confirm(
          '是否确认删除【'+doctorName+'】','删除确认',
          {
            confirmButtonText:'删除',
            cancelButtonText:'取消',
            type:'warning'
          }
      ).then(() => {
        this.$http.delete('/api/doctor/remove/'+doctorId).then(
            res => {
              if(res.data.status == 1){
                this.$message.success(res.data.message)

                this.getDoctorList()
              }else{
                this.$message.error(res.data.message)
              }
            }
        )
      }).catch(() => {})
    },
  },

  mounted(){
    this.$http.get('/api/dept/listAll/1').then( res => {
      this.doctorDeptList = res.data.data.deptList
    })
    this.$http.get('/api/dept/listAll/2').then(
        res => {
      this.checkDeptList = res.data.data.deptList
    })
    this.$http.get('/api/level/listAll').then( res => {

      this.levelList = res.data.data.levelList
    })
    this.$http.get('/api/schedule/listAll').then( res => {
      this.scheduleList = res.data.data.scheduleList
    })
    console.log(this.doctorDeptList)
    this.getDoctorList();
  }
}

</script>

<style scoped>
.tag{
  margin-right: 20px;
  margin-left: 10px;
}
</style>
