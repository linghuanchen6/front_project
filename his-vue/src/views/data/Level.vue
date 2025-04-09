<template>
	<div>
		
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>基础数据</el-breadcrumb-item>
		  <el-breadcrumb-item>挂号级别管理</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片容器 -->
		<el-card>

      <el-input v-model="queryCondition.levelName" placeholder="挂号级别名称" style="width: 250px"></el-input>
      <el-button type="primary" style="margin-left: 30px" @click="getLevelList">查询</el-button>
      <el-button type="primary"  @click="add" class="add-button">添加挂号级别</el-button>
      <el-button type="danger" @click="deleteBatch" class="delete-button">批量删除</el-button>
			<!-- 数据表格 -->
			<el-table :data="levelPage.records" style="width: 80%" stripe border @selection-change="handleSelectionChange">

        <el-table-column type="selection"/>
          <el-table-column prop="levelId" label="级别编号">
          </el-table-column>

          <el-table-column prop="levelName" label="级别名称">
          </el-table-column>

          <el-table-column prop="levelAmount" label="级别费用">
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="modify(scope.row.levelId)" ></el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="remove(scope.row.levelId,scope.row.levelName)"></el-button>
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
          :total="levelPage.total">
      </el-pagination>

		</el-card>


    <el-dialog :title="actionType" :visible.sync="OpenDialog" width="30%" center>
      <el-form :model="formData" :rules="formRules" ref="formRef">
        <el-form-item label="级别名称" label-width="100px" :label-width="levelName">
          <el-input v-model="formData.levelName"></el-input>
        </el-form-item>
        <el-form-item label="级别费用" label-width="100px" :label-width="levelAmount">
          <el-input v-model.number="formData.levelAmount"></el-input>
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

            levelPage: {},

            queryCondition:{
              levelName:'',
              currentPage:1,
              pageSize:10,
            },
            OpenDialog:false,

            formData:{
              levelId:0,
              levelName: '',
              levelAmount:'',
            },
            formRules:{
              levelName:[
                { required:true, message:'请输入挂号级别名称',trigger:'blur'},
                { max:10, message: '挂号级别的长度不能超过十个字符',trigger:'blur'}
              ],

              levelAmount:[
                { required:true, message:'请输入挂号级别费用',trigger:'blur'},
                { type:'number', message: '挂号级别费用必须是数字',trigger:'blur'}
              ]
            },
            actionType:'',
            levels:[],
	        }
	    },
  methods: {
        //查询 挂号级别
        getLevelList(){
          this.$http.get('/api/level/list', {params:this.queryCondition}).then(
              res => {
                console.log(res)
                this.levelPage = res.data.data.levelPage
              }
          )
        },

        handleSizeChange(val) {
          this.queryCondition.pageSize = val;
          this.getLevelList();
        },
        handleCurrentChange(val) {
          this.queryCondition.currentPage = val;
          this.getLevelList();
        },

        handleSelectionChange(val){
          this.levels = val
        },
        add(){
          this.formData={}

          this.actionType='添加挂号级别'

          this.OpenDialog=true
        },
        addOrModify(){
          this.$refs.formRef.validate(
              valid =>{
                if(valid){
                  if(this.actionType=='添加挂号级别'){
                    this.$http.post('/api/level/add', this.formData).then(
                        res => {
                          if(res.data.status == 1){
                            this.$message.success(res.data.message)

                            this.getLevelList()
                          }else{
                            this.$message.error(res.data.message)
                          }
                        }
                    )
                  }else{
                    this.$http.put('/api/level/modify', this.formData).then(
                        res => {
                          if(res.data.status == 1){
                            this.$message.success(res.data.message)

                            this.getLevelList()
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
        modify(levelId){
          this.$http.get('/api/level/get/'+levelId).then(
              res => {
                if(res.data.status == 1){
                  this.formData = res.data.data.level;

                  this.actionType='修改挂号级别';

                  this.OpenDialog=true;

                }else{
                  this.$message.error(res.data.message)
                }
              }
          )
        },

        async remove(levelId, levelName){
          let removeEnableFlag = false;

          await this.$http.get('/api/level/removeEnable/' + levelId).then(
              res => {
                removeEnableFlag = (res.data.status == 1)
              }
          )

          if(removeEnableFlag){

            const result = await this.$confirm(
                '是否确认删除【'+levelName+'】','删除确认',
                {
                  confirmButtonText:'删除',
                  cancelButtonText:'取消',
                  type:'warning'
                }
            )

            if(result == 'confirm'){
              this.$http.delete('/api/level/remove/'+levelId).then(
                  res => {
                    if(res.data.status == 1){
                      this.$message.success(res.data.message)

                      this.getLevelList()
                    }else{
                      this.$message.error(res.data.message)
                    }
                  }
              )
            }
          }else{
            this.$message.error('当前挂号级别下存在医生，不能删除')
          }
        },
        async deleteBatch(){

          let levelIds = ''
          let levelNames = ''

          this.levels.forEach( level => {
            levelIds += level.levelId + ','
            levelNames += level.levelName + ','
          })

          levelIds = levelIds.substring(0, levelIds.length - 1)
          levelNames = levelNames.substring(0, levelNames.length - 1)

          const result = await this.$confirm(
              '是否确认删除【' + levelNames + '】','删除确认',
              {
                confirmButtonText:'删除',
                cancelButtonText:'取消',
                type:'warning'
              }
          )
          if(result == 'confirm'){
            this.$http.delete('/api/level/deleteBatch?levelIds='+levelIds).then(
                res => {
                  if(res.data.status == 1){
                    this.$message.success(res.data.message)

                    this.getLevelList()
                  }else{
                    this.$message.error(res.data.message)
                  }
                }
            )
          }
        },
      },
      mounted(){

        this.getLevelList();
      }
	}
</script>

<style scoped>
.add-button{
  position: absolute;
  right: 80px;
  width: 120px;
}
.delete-button{
  position: absolute;
  right: 240px;
}

</style>
