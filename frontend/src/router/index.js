import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/pages/Home.vue'
import About from '../components/pages/About.vue'

Vue.use(VueRouter)

const routes = [
    {path: '/home', name: 'home', component: Home},
    {path: '/about', name: 'about', component: About}
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
