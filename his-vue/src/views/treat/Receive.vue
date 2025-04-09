<template>
    <div>

        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>医生诊疗</el-breadcrumb-item>
            <el-breadcrumb-item>医生接诊</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片-->
        <el-card>

            <!--查询条件-->
            <el-input v-model="queryCondition.registerId" placeholder="病历号" style="width: 250px"/>
            <el-input v-model="queryCondition.patientName" placeholder="患者姓名" style="width: 250px" />
            <el-select v-model="queryCondition.status" placeholder="请选择看诊状态" style="width: 220px;margin-right: 20px">
                <el-option label="全部状态" value=""></el-option>
                <el-option
                        v-for="status in statuses"
                        :value="status.statusId"
                        :label="status.statusName"
                        :key="statuses">
                </el-option>
            </el-select>

            <el-button type="primary" @click="getRegisterList">查询</el-button>


            <!--数据表格-->
            <el-table
                    :data="registerList"
                    style="width: 80%"
                    stripe
                    border
            >
                <el-table-column type="index" align="center"/>
                <el-table-column prop="registerId" label="病历号"/>

                <el-table-column prop="patientName" label="患者姓名" />
                <el-table-column prop="patientGender" label="患者性别"/>
                <el-table-column prop="status" label="看诊状态"/>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope" >
                        <!--把register整个对象传递-->
                        <el-button type="primary" size="small" @click="receive(scope.row)" v-if="scope.row.status == '新挂号' ">接诊</el-button>

                    </template>
                </el-table-column>

            </el-table>

            <el-row>
                <el-col :span="5"><el-tag type="primary">新挂号：{{newCount}}</el-tag></el-col>
                <el-col :span="5"><el-tag type="success">已接诊：{{receiveCount}}</el-tag></el-col>
                <el-col :span="5"><el-tag type="warning">已结束：{{finishCount}}</el-tag></el-col>
                <el-col :span="5"><el-tag type="danger">合计：{{totalCount}}</el-tag></el-col>
            </el-row>


        </el-card>

    </div>
</template>

<script>
    export default {
        data() {
            return {

                registerList: [],

                //查询条件   疾病名称 编码
                queryCondition:{
                    registerId: '',
                    patientName: '',
                    status: 1,
                },


                //看诊状态数组
                statuses:[
                    { statusId: 1, statusName: '新挂号'},
                    { statusId: 2, statusName: '已接诊'},
                    { statusId: 3, statusName: '看诊结束'},
                ],

                newCount:0,
                receiveCount:0,
                finishCount:0,
                totalCount:0,
            }
        },

        methods:{

            getRegisterList(){

                this.$http.get('/api/register/list' ,{params: this.queryCondition}).then(

                    res =>{
                        this.registerList = res.data.data.registerList
                        console.log(this.registerList)
                        this.registerList.forEach(register =>{
                            if (register.status == 1){
                                register.status = '新挂号'
                            } else if (register.status == 2) {
                                register.status = '已接诊'
                            } else {
                                register.status = '看诊结束'
                            }
                        })
                    }
                )
            },

            getRegisterCount(){


                this.$http.get('/api/register/count').then(

                    res =>{
                        this.newCount = res.data.data.newCount
                        this.receiveCount = res.data.data.receiveCount
                        this.finishCount = res.data.data.finishCount
                        this.totalCount = res.data.data.totalCount


                    }
                )
            },

            receive(register){

                this.$router.push({path: '/addCheck' , query:{register: register}})

            },

        },

        mounted(){

            this.getRegisterList()

            this.getRegisterCount()

            // window.setInterval(()=>{this.getRegisterCount()},1000*5)

        }
    }
</script>

<style scoped>

    .el-tag{
        margin: 0 60px;
    }

</style>