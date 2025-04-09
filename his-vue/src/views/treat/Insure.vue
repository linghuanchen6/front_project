<template>
	<div>
		
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>医生诊断</el-breadcrumb-item>
		  <el-breadcrumb-item>查看检查结果</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片容器 -->
		<el-card>
			
			<!--查询条件-->
			<el-input v-model="queryCondition.registerId" placeholder="请输入病历号" clearable style="width: 200px"></el-input>
      <el-input v-model="queryCondition.patientName" placeholder="请输入患者姓名" clearable style="width: 200px"></el-input>
			<el-select v-model="queryCondition.status" placeholder="看诊状态" style="width: 160px;margin-right: 20px">
				<el-option label="全部状态" value=""/>
				<el-option label="新挂号" value="1"/>
				<el-option label="已接诊" value="2"/>
				<el-option label="看诊结束" value="3"/>
			</el-select>
			
			<!--查询按钮-->
			<el-button type="primary" @click="getRegisterList">查询</el-button>
			
			<!--确诊按钮-->
			<el-button type="primary" class="insure-button" @click="insure" :disabled="!enableInsure">确诊</el-button>
			<!-- 挂号数据表格 -->
			<el-table :data="registerList" stripe border>
                <el-table-column type="index"  label="序号" width="100px" align="center" />
                <el-table-column prop="registerId" label="病历号"/>
                <el-table-column prop="patientName" label="患者姓名"/>
                <el-table-column prop="patientGender" label="患者性别"/>
				<el-table-column prop="status" label="看诊状态"/>

                <el-table-column label="操作" align="center">
					
					<template slot-scope="scope">
						<!--查看检查结果按钮-->
						<el-button type="success" size="mini" @click="view(scope.row)" v-if="scope.row.status=='已接诊'">查看结果</el-button>
					</template>
					
					</el-table-column>
			    </el-table>
			<el-divider>病历号【{{register.registerId}}】的检查结果</el-divider>
			<!-- 检查结果数据表格 -->
			<el-table :data="checkResultVOList" stripe border>
			    <el-table-column type="index"  label="序号" width="100px" align="center" />
				<el-table-column type="expand">
					<template slot-scope="scope">
				//		<img v-for="photo in scope.row.checkPhotos" :src="'/api/image/check/'+photo" class="check-photo" @click="zoomVisible">
					</template>
				</el-table-column>
			    <el-table-column prop="checkName" label="检查名称"width="150"/>
			    <el-table-column prop="status" label="检查状态"width="100"/>
			    <el-table-column prop="checkResult" label="检查结果"width="300"/>
				<el-table-column prop="checkTime" label="检查时间"width="200"/>
			    <el-table-column prop="doctorName" label="检查医师"width="100"/>
					
				</el-table>
				<!--放大检查结果插片的对话框-->
				<el-dialog :title="'【'+checkName+'】检查结果照片'" :visible.sync="zoomVisible" width="50%">
					<img :src="imageUrl" width="100%"/>
				</el-dialog>
		</el-card>
	</div>
</template>

<script>
	export default {

        data() {
           return{
			
			//挂号数据列表
					registerList:[],	
					//查询条件
					queryCondition:{						
						registerId:'',	//病历号名称
						patientName:'',//患者名称
						status:'2', //看诊状态 默认是已接诊的
					},
					
					//当前病例对象
					register:'',
					//检查结果列表
					checkResultVOList:[],
					//是否允许确诊的标志变量
					enableInsure:false,
					//控制放大对话框的显示和关闭
					zoomVisible:false,
					//检查结果照片路径
					imageUrl:'',
					//当前检查项目的名称
					checkName:'',
			   
		   }
		   
	},	

        methods: {
          //查询挂号列表
          getRegisterList() {
              this.$http.get('/api/register/list', {params:this.queryCondition}).then(
                  res => {
                    console.log(res.data.data)
                      this.registerList = res.data.data.registerList
                  //将检查状态由int转换成string
                      this.registerList.forEach(register=>{
                        if(register.status==1){
                          register.status="新挂号";
                        }else if(register.status==2){
                          register.status="已接诊";
                        }else{
                          register.status="看诊结束";
                        }
                      })
                  }
              )
				      //禁用确诊按钮
				      this.enableInsure=false
            },
          //查看检查结果列表
          view(register) {

			      this.register=register;

			      //发送axios请求
             this.$http.get('/api/request/view/'+ register.registerId).then(
                 res => {
					  //接受检查结果列表
                 this.checkResultVOList = res.data.data.checkResultVOList
                 //统计已出结果的检查数量
                 let resultCount=0
                 //遍历检查结果列表
                   this.checkResultVOList.forEach(checkResultVO=>{
                 //已出结果的检查数量+1
                 if(checkResultVO.status==3){
                   resultCount++
                 }
                 //添加一个照片文件名的数组
                 checkResultVO.checkPhotos=[]
                 //将检查状态由int转换成string
                 if(checkResultVO.status==1){
                  checkResultVO.status="未缴费"
                 }else if(checkResultVO.status==2){
                  checkResultVO.status="未出结果"
                 }else{
                  checkResultVO.status="已出结果"
                  //将照片文件名的字符串拆分成数组
                  if(checkResultVO.checkPhoto!=''){
                    checkResultVO.checkPhotos=checkResultVO.checkPhoto.split("#")
                  }
                 }
               })
         			//只有全部检查结果都已出结果，才能确诊
         			this.enableInsure= (resultCount==this.checkResultVOList.length)
                 }
             )
         }, 
           //放大检查结果图片
			zoom(imageUrl,checkName){
				//设置图片的url
				this.imageUrl=imageUrl
				//设置检查项目的名称
				this.checkName=checkName
				//打开对话框
				this.zoomVisible=true
			},
			//确诊
			insure(){
				//跳转到确诊病例和开具处方页面
				this.$router.push({path:'/addPrescription',query:{register:this.register}})
			},
        },
        mounted() {
         //页面加载时，查询数据列表
		       this.getRegisterList();
        }
    }
</script>

<style scoped>
    .check-photo{
       width: 100px;
	   cursor: pointer;
	   margin-right: 20px;
    }
	.insure-button{
		position: absolute;
		right: 90px;
	}
</style>
