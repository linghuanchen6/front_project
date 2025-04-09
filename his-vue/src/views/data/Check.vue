<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>检查检验</el-breadcrumb-item>
      <el-breadcrumb-item>执行检查</el-breadcrumb-item>
    </el-breadcrumb>
    <el-input v-model="queryCondition.registerId" placeholder="请输入病历号" style="width:100px;margin-right: 10px"/>
    <el-select v-model="queryCondition.checkResult" placeholder="请选择">
      <el-option label="已缴费" value=""></el-option>
      <el-option v-for="checkResult in Results" :label="checkResult.resultName" :value="checkResult.resultId">
      </el-option>
    </el-select>
    <el-button type="primary" @click="getcheckList">查询</el-button>
    <el-table :data="checkResultList" stripe border >

      <el-table-column type="index" align="center"/>

      <el-table-column prop="checkId" label="序号" />
      <el-table-column prop="checkName" label="病历号" />
      <el-table-column prop="checkCode" label="患者姓名" />
      <el-table-column prop="checkAmount" label="检查名称" />
      <el-table-column prop="checkAmount" label="检查状态" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small"
                     @click="checkRequest(scope.row)" v-if="scope.row.status=='进行检查'">
            执行检查
          </el-button>
        </template>
      </el-table-column>


      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="modify(scope.row.checkId)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row.checkId,scope.row.checkName)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 卡片容器 -->
    <el-card>

      <!--			&lt;!&ndash;查询条件&ndash;&gt;
            <el-input v-model="queryCondition.checkName" placeholder="项目名称" style="width:100px;margin-right: 10px"/>
            <el-input v-model="queryCondition.checkCode" placeholder="项目编码" style="width:100px;margin-right: 10px"/>
            <el-input v-model="queryCondition.minAmount" placeholder="最低费用" style="width:100px;"/>
            到
            <el-input v-model="queryCondition.maxAmount" placeholder="最高费用" style="width:100px;margin-right: 10px"/>


            <el-button type="primary" @click="getcheckList" >查询</el-button>

            <el-button type="primary" @click="add" class="add-button">添加检查项目</el-button>

            <el-button type="danger" @click="deleteBatch" class="delete-button">批量删除</el-button>

            <el-table :data="checkPage.records" stripe border @selection-change="handleSelectionChange">

              <el-table-column type="selection"/>

              <el-table-column prop="checkId" label="检查项目编号" />
              <el-table-column prop="checkName" label="检查项目名称" />
              <el-table-column prop="checkCode" label="检查项目编码" />
              <el-table-column prop="checkAmount" label="检查项目费用" />

              <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="modify(scope.row.checkId)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row.checkId,scope.row.checkName)"></el-button>
                    </template>
                </el-table-column>
                </el-table>

              &lt;!&ndash;分页组件&ndash;&gt;
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryCondition.currentPage"
                :page-sizes="[2,3,5,10]"
                :page-size="queryCondition.pageSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="checkPage.total">
              </el-pagination>-->
    </el-card>

    <!--对话框-->
    <el-dialog :title="actionType" :visible.sync="openDialogFlag" width="30%" center>

      <el-form :model="formData" label-width="100px" :rules="formRules" ref="formRef">

        <el-form-item label="检查项目名称" prop="checkName">
          <el-input v-model="formData.checkName"></el-input>
        </el-form-item>

        <el-form-item label="检查项目编码" prop="checkCode">
          <el-input v-model="formData.checkCode"></el-input>
        </el-form-item>

        <el-form-item label="检查项目费用" prop="checkAmount">
          <el-input v-model.number="formData.checkAmount"></el-input>
        </el-form-item>

      </el-form>

      <!--底部区域-->
      <div slot="footer">

        <el-button @click="openDialogFlag=false">取消</el-button>

        <el-button type="primary" @click="addOrModify">确定</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {

  data() {

    return {

      //分页对象！

      checkPage:{},

      //查询条件对象
      queryCondition:{

        checkName:'',

        checkCode:'',

        minAmount:'',

        maxAmount:'',

        currentPage:1,

        pageSize:10,

      },

      //是否打开对话框的标志变量
      openDialogFlag:false,

      //表单数据对象
      formData:{
        checkId:0,
        checkName:'',
        checkCode:'',
        checkAmount:0,
      },

      //表单数据校验规则对象
      formRules:{
        checkName:[
          {required:true,message:'请输入检查项目名称',trigger:'blur'},
          {max:10,message:'检查项目名称的长度不能超过10个字符',trigger:'blur'}
        ],
        checkCode:[
          {required:true,message:'请输入检查项目编码',trigger:'blur'},
          {max:10,message:'检查项目编码的长度不能超过10个字符',trigger:'blur'}
        ],
        checkAmount:[
          { required:true,message:'请输入检查项目费用',trigger:'blur' },
          {type:'number',message:'检查项目费用必须是数字',trigger:'blur'}
        ],
      },

      //操作类型
      actionType:'',

      checks:[],

    }
  },

  methods:{
    checkRequest() {
      return checkRequest
    },
    //
    getcheckList(){

      this.$http.get('/api/check/list',{params:this.queryCondition}).then(

          res => {

            this.checkPage=res.data.data.checkPage

          }
      )
    },

    //分页大小改变时
    handleSizeChange(val){

      this.queryCondition.pageSize = val

      this.getcheckList();

    },

    //当前页码改变时
    handleCurrentChange(val){

      this.queryCondition.currentPage = val

      this.getcheckList();

    },

    //打开添加的对话框
    add(){

      this.formData={}

      this.actionType='添加检查项目'

      this.openDialogFlag = true

    },

    addOrModify(){
      this.$refs.formRef.validate(

          valid => {

            if(valid){

              if(this.actionType=='添加检查项目'){

                this.$http.post('/api/check/add',this.formData).then(

                    res => {

                      if(res.data.status==1){

                        this.$message.success(res.data.message)

                        this.getcheckList()

                      }else{

                        this.$message.error(res.data.message)
                      }
                    }
                )
              }else{
                this.$http.put('/api/check/modify',this.formData).then(

                    res => {

                      if(res.data.status==1){

                        this.$message.success(res.data.message)

                        this.getcheckList();

                      }else{

                        this.$message.error(res.data.message)
                      }
                    }
                )
              }

              this.openDialogFlag=false

            }else{

              this.$message.error("输入的数据有误，请检查后再提交")
            }
          }
      )
    },

    //打开修改对话框
    modify(checkId) {

      this.$http.get('/api/check/get/' + checkId).then(

          res => {
            if(res.data.status==1){

              this.formData =res.data.data.check

              this.actionType='修改检查项目';

              this.openDialogFlag=true;

            }else{

              this.$message.error(res.data.message);

            }
          }
      )
    },

    //删除
    async remove(checkId,checkName){

      let removeEnableFlag = false;

      await this.$http.get('/api/check/removeEnable/' + checkId).then(

          res => {

            removeEnableFlag = (res.data.status==1)

          })

      if(removeEnableFlag){

        const result = await this.$confirm(

            '是否确认删除【'+ checkName + '】',
            '确认删除',

            {
              confirmButtonText:'删除',
              cancelButtonText:'取消',
              type:'warning'

            })

        if(result=='confirm'){

          this.$http.delete('/api/check/remove/'+checkId).then(

              res => {

                if(res.data.status==1){

                  this.$message.success(res.data.message)

                  this.getcheckList()

                }else{

                  this.$message.error(res.data.message)

                }
              }
          )
        }
      }else{

        this.$message.error('当前检查项目下存在挂号，不能删除')

      }
    },

    //多选操作
    handleSelectionChange(val){

      this.checks=val
    },

    //批量删除
    async deleteBatch(){

      let checkIds=''
      let checkNames=''

      this.checks.forEach(check =>{
        checkIds += check.checkId + ','
        checkNames += check.checkName + ','
      })

      checkIds=checkIds.substring(0,checkIds.length - 1)
      checkNames=checkNames.substring(0,checkNames.length - 1)

      const result =await this.$confirm(
          '是否确认删除【'+ checkNames + '】',
          '确认删除',
          {
            confirmButtonText:'删除',
            cancelButtonText:'取消',
            type:'warning'
          })

      if(result=='confirm'){

        this.$http.delete('/api/check/deleteBatch?checkIds='+checkIds).then(

            res => {

              if(res.data.status==1){

                this.$message.success(res.data.message)

                this.getcheckList()

              }else{

                this.$message.error(res.data.message)

              }
            }
        )
      }
    }
  },


  mounted(){
    this.getcheckList();
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
  right: 200px;
}
</style>
