<template>
    <div>

        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>医生诊疗</el-breadcrumb-item>
            <el-breadcrumb-item>更新病历 开具检查</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>

            <el-divider>患者信息</el-divider>

            <el-tag type="primary">病历号：{{register.registerId}} </el-tag>
            <el-tag type="success">患者姓名：{{register.patientName}} </el-tag>
            <el-tag type="warning">患者性别：{{register.patientGender}} </el-tag>

            <el-divider>患者主诉</el-divider>

            <el-input v-model="speak" placeholder="患者主诉" type="textarea" row="2" style="width: 800px"></el-input>
            <el-button type="primary" class="button-update" @click="modify">更新病历</el-button>

            <el-divider>开局检查</el-divider>

            <el-button type="primary" @click="openDialog">添加新检查项目</el-button>

            <el-button type="success" @click="addCheck" class="add-button">开具检查</el-button>


            <!--数据表格-->
            <el-table
                    :data="checkList"
                    stripe
                    border
            >
                <el-table-column prop="checkName" label="检查项目名称"/>
                <el-table-column prop="checkAmount" label="检查项目费用"/>


                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">

                        <el-button
                                type="danger" size="mini"
                                @click="deleteCheck(scope.row.checkId,scope.row.checkName )">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <!--对话框-->

            <el-dialog :visible.sync="openDialogFlag" width="60%" center>

                <!--查询条件-->
                <el-input v-model="queryCondition.checkName" placeholder="检查名称" clearable/>
                <el-input v-model="queryCondition.checkCode" placeholder="检查编码" clearable/>

                <el-button type="primary" @click="getCheckList">查询</el-button>

                <el-button type="primary" @click="clear">清空</el-button>


                <!--数据表格-->
                <el-table
                        :data="checkListDialog"
                        style="width: 80%"
                        stripe
                        border
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection"/>
                    <el-table-column prop="checkName" label="检查项目名称"/>
                    <el-table-column prop="checkCode" label="检查项目编码"/>
                    <el-table-column prop="checkAmount" label="检查项目费用"/>


                </el-table>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="openDialogFlag = false">取 消</el-button>
                    <el-button type="primary" @click="addCheckDialog">确 定</el-button>
                </div>
            </el-dialog>

        </el-card>

    </div>
</template>

<script>
    export default {

        data(){
            return{

                register: this.$route.query.register,

                speak:'',

                checkList: [],

                openDialogFlag: false,

                queryCondition: {
                    checkName:'',
                    checkCode:'',
                },

                checkListDialog:[],

                checksDialog:[],


            }
        },

        methods:{

            modify(){

                let fd = new FormData();
                fd.append("registerId",this.register.registerId)
                fd.append("speak",this.speak)

                this.$http.put("/api/register/modify" , fd).then(

                    res=>{
                        if (res.data.status == 1){
                            this.$message.success(res.data.message)
                        }else {
                            this.$message.error(res.data.message)
                        }
                    }

                )

            },

            openDialog(){

                this.queryCondition.checkName = ''
                this.queryCondition.checkCode = ''
                this.openDialogFlag = true

                this.getCheckList()

            },



            getCheckList(){

                this.$http.get('/api/check/listAll' , {params: this.queryCondition}).then(

                    res=>{
                        this.checkListDialog  = res.data.data.checkList
                    }

                )

            },

            clear(){

                this.queryCondition.checkName = ''
                this.queryCondition.checkCode = ''

                this.checkListDialog = []

            },

            async addCheck(){

                if (this.checkList.length == 0){
                    this.$message.error('至少要选择一个检查项目')
                    return
                }

                let checkIds = ''

                this.checkList.forEach(check =>{
                    checkIds += check.checkId + ','
                })

                checkIds = checkIds.substring(0,checkIds.length-1)



                const result = await this.$confirm('是否确认开具检查', '开具确认').catch(()=>{})

                if (result == 'confirm'){

                    let fd = new FormData();
                    fd.append("registerId",this.register.registerId)
                    fd.append("checkIds",checkIds)

                    this.$http.post('/api/request/add',fd).then(
                        res=>{
                            if (res.data.status == 1){
                                this.$message.success(res.data.message)
                                this.checkList = []
                            }else {
                                this.$message.error(res.data.message)
                            }


                        }
                    )

                }


            },

            //将内层检查项目添加到外层
            async addCheckDialog(){

                const result = await this.$confirm('是否确定添加检查项目', '添加确认')

                if (result == 'confirm'){
                    this.checksDialog.forEach(check =>{
                        let existFlag = false
                        this.checkList.forEach(checkItem =>{
                            if (checkItem.checkId == check.checkId){
                                existFlag = true
                            }
                        })
                        
                        if (!existFlag){
                            this.checkList.push(check)
                        }
                        
                    })
                }
                this.openDialogFlag = false

            },

            handleSelectionChange(val){
                this.checksDialog = val
            },

            async deleteCheck(checkId,checkName){
                const result = await this.$confirm('是否确定删除【' + checkName + '】检查项目','删除确认')

                if (result == 'confirm'){
                    const  index = this.checkList.findIndex(check=>{
                        return check.checkId == checkId
                    })

                    this.checkList.splice(index,1)
                }

            }

        },

        mounted(){
        },

    }
</script>

<style scoped>
    .el-tag{
        margin: 10px;
    }
    .button-update{
        margin-left: 20px;
    }

    .add-button{
        position: absolute;
        right: 223px;
    }

</style>