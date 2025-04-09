<template>
	<div>
		
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{path: '/welcome'}">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>挂号收费</el-breadcrumb-item>
		  <el-breadcrumb-item>窗口挂号</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片容器 -->
		<el-card>
                <el-form :model="formData" label-width="100px" :rules="formRules" ref="formRef">
                    <el-row>
                    <el-col :span="12">
                        <el-form-item label="患者姓名" prop="patientName">
                            <el-input v-model="formData.patientName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="患者性别" prop="patientName">
                            <el-radio-group v-model="formData.patientGender">
                                <el-radio label="男">男</el-radio>
                                <el-radio label="女">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="看诊日期" prop="regiserDate">
                                <el-input v-model="formData.registerDate" type="date"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="看诊午别">
                                <el-radio-group v-model="formData.registerNoon">
                                    <el-radio label="0">上午</el-radio>
                                    <el-radio label="1">下午</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="结算方式">
                                <el-radio-group v-model="formData.settleMode">
                                    <el-radio label="1">医保</el-radio>
                                    <el-radio label="2">自费</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="收费方式" prop="feeMode">
                                <el-select v-model="formData.feeMode" placeholder="请选择缴费方式">
                                    <el-option v-for="feeType in feeTypes" :value="feeType.typeId" :label="feeType.typeName"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="挂号科室">
                                <el-select v-model="formData.deptId" placeholder="请选择科室类型" prop="deptId">
                                    <el-option v-for="dept in deptList" :value="dept.deptId" :label="dept.deptName"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="挂号级别">
                                <el-select v-model="formData.levelId" placeholder="请选择挂号级别" prop="levelId" @change="changeLevel">
                                    <el-option v-for="level in levelList" :value="level.levelId" :label="level.levelName"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="医生列表">
                                <el-select v-model="formData.doctorId" placeholder="请选择医生" prop="doctorId">
                                    <el-option v-for="doctor in doctorList" :value="doctor.doctorId" :label="doctor.doctorName"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" @click="selectDoctor">选择医生</el-button>
                        </el-col>
                        <el-col :span="4">
                           <el-form-item label="病历本">
                               <el-switch v-model="formData.needBook" @change="changeBook"/>
                           </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-tag>挂号金额：{{formData.registerAmount}}元</el-tag>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" @click="addRegister">挂号</el-button>
                        </el-col>
                    </el-row>
                </el-form>
        </el-card>
		

	</div>
</template>

<script>
	export default {

        data() {

            return {

                //分页对象！


                //查询条件对象
                queryCondition: {

                    registerDate: '',
                    registerNoon: '',
                    deptId: '',
                    levelId: '',

                },


                //表单数据对象
                formData: {
                    patientName: '',
                    patientGender: '',
                    registerDate: '',
                    registerNoon: '',
                    settleMode: '',
                    feeMode: '',
                    deptId: '',
                    levelId: '',
                    doctorId: '',
                    needBook: '',
                    registerAmount: 0,
                },

                //表单数据校验规则对象
                formRules: {
                    patientName: [
                        {required: true, message: '请输入患者姓名', trigger: 'blur'},
                        {max: 10, message: '患者姓名的长度不能超过10个字符', trigger: 'blur'}
                    ],
                    registerDate: [
                        {required: true, message: '请选择看诊日期', trigger: 'blur'},
                    ],
                    feeMode: [
                        {required: true, message: '请选择收费方式', trigger: 'blur'},
                    ],
                    deptId: [
                        {required: true, message: '请选择挂号科室', trigger: 'blur'},
                    ],
                    levelId: [
                        {required: true, message: '请选择挂好级别', trigger: 'blur'},
                    ],
                    doctorId: [
                        {required: true, message: '请选择门诊医生', trigger: 'blur'},
                    ],
                },
                feeTypes: [
                    {typeId: 1, typeName: '医保卡'},
                    {typeId: 2, typeName: '现金'},
                    {typeId: 3, typeName: '微信'},
                    {typeId: 4, typeName: '支付宝'},
                ],
                deptList: [],
                levelList: [],
                doctorList: [],


            }
        },

        methods: {
            //
            changeLevel(levelId) {
                this.levelList.forEach(level => {
                    if (level.levelId == levelId) {
                        this.formData.registerAmount = level.levelAmount
                    }
                })
            },

            changeBook(needBook) {
                if (needBook) {
                    this.formData.registerAmount++;
                } else {
                    this.formData.registerAmount--
                }
            },
            selectDoctor() {
                this.queryCondition.registerDate = this.formData.registerDate
                this.queryCondition.registerNoon = this.formData.registerNoon
                this.queryCondition.deptId = this.formData.deptId
                this.queryCondition.levelId = this.formData.levelId
                console.log(this.queryCondition)
                this.$http.get('/api/doctor/listReg', {params: this.queryCondition}).then(
                    res => {
                        this.doctorList = res.data.data.doctorList
                    }
                )
            },
            addRegister() {
                this.$http.post('/api/register/add', this.formData).then(
                    res => {
                        if (res.data.status == 1) {
                            this.$message.success(res.data.message)
                            this.formData = {}
                        } else {
                            this.$message.error(res.data.message)
                        }
                    }
                )
            },

        },
        mounted() {
            this.$http.get('/api/dept/listAll/1').then(
                res => {
                    this.deptList=res.data.data.deptList
                }
            )
            this.$http.get('/api/level/listAll').then(
                res => {
                    this.levelList=res.data.data.levelList
                }
            )
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
