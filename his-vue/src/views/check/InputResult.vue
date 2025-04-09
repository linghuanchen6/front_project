<template>
	<div>
		
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>检查检验</el-breadcrumb-item>
		  <el-breadcrumb-item>录入检查管理</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片容器 -->
		<el-card>
			<el-divider>患者信息</el-divider>
			<el-tag type="primary">病历1号：{{checkRequest.registerId}}</el-tag>
			<el-tag type="seccess">患者姓名：{{checkRequest.patientName}}</el-tag>
			<el-tag type="warning">检查名称：{{checkRequest.checkName}}</el-tag>
	
			<el-divider>录入检查结果</el-divider>
				
			<el-input v-model="checkResult" placeholder="检查结果" type="textarea" row="2"  style="width:800px"/>
			
			<el-button type="primary" @click="upload" class="upload-button">上传检查结果</el-button>
			
			<el-divider>上传检查图片</el-divider>
			
			<el-upload
			ref="upload"
			action=""
			list-type="picture-card"
			:auto-upload="false"
			multiple>
			<i slot="default" class="el-icon-plus"></i>
			</el-upload>
		</el-card>
	</div>
</template>

<script>
	export default {
		
	    data() {
			
	        return {

				
					checkRequest:this.$route.query.checkRequest,
					
					checkResult:'',
				
	        }
	    },
		
    methods:{
      upload(){
        // console.log(this.checkRequest)
        let fd= new FormData();

        fd.append('requestId',this.checkRequest.requestId);
        fd.append('checkResult',this.checkResult);

        let files=this.$refs.upload.uploadFiles;
        console.log(files)
        files.forEach(file =>{   fd.append("files",file.raw)  })


        this.$http.post('/api/request/upload',fd,{  headers:{'Content-Type':'multipart/form-data'}}).then(

          res => {

            if(res.data.status==1){

               this.$message.success(res.data.message)

               this.$router.push("/execute")

            }else{

              this.$message.error(res.data.message)

              }
            }
          )

      },
    },

		mounted(){
			
		}
	}
</script>

<style scoped>
.el-tag{
	margin-left:30px;
}
.upload-button{
	margin-left:30px;
}
</style>
