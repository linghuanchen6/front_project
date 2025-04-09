import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Disease from "@/views/data/Disease.vue";
import Level from '../views/data/Level.vue'
import Dept from '../views/data/Dept.vue'
import Drug from "@/views/data/Drug.vue";
import Check from "@/views/data/Check.vue";
import Schedule from "@/views/data/Schedule.vue";
import Doctor from "@/views/data/Doctor.vue";
import Register from "@/views/window/Register.vue";
import Login from "@/views/Login.vue";
import Fee from "@/views/window/Fee.vue";
import Receive from "@/views/treat/Receive.vue";
import AddCheck from "@/views/treat/AddCheck.vue";
import InputResult from "@/views/check/InputResult.vue";
import Insure from "@/views/treat/Insure.vue";
import AddPrescription from "@/views/treat/AddPrescription.vue";
import ExecuteCheck from "@/views/check/ExecuteCheck.vue";
import TakeDrug from "@/views/window/TakeDrug.vue";


Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
	component: Home,
	redirect: '/welcome',   //重定向到欢迎页面
	children: [     //子路由,path属性对应菜单项的index属性值
		 {path: '/welcome', component: Welcome},
	     {path: '/level', component: Level},
		 {path: '/dept', component: Dept},
		 {path: '/drug', component: Drug},
		 {path: '/disease', component: Disease},
		 {path: '/check', component: Check},
		 {path: '/schedule', component: Schedule},
		 {path: '/register', component: Register},
		 {path: '/doctor', component: Doctor},
		 {path: '/fee', component: Fee},
		 {path: '/receive', component: Receive},
		 {path: '/addCheck', component: AddCheck},
		 {path: '/inputResult', component: InputResult},
		 {path: '/insure', component: Insure},
		 {path: '/addPrescription', component: AddPrescription},
		 {path: '/execute', component: ExecuteCheck},
		 {path: '/takeDrug', component: TakeDrug},
	]
  },
	{ path: '/login', component: Login},
	{ path: '/', redirect: '/login'}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(
	(to, from, next) => {
		if(to.path != '/login'){
			if(sessionStorage.getItem("currentUser")== null){
				alert("未登录，请先登录")
				next("/login")
			}else{
				next()
			}
		}else {
			next()
		}
	}
)
export default router
