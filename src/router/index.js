import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from './../views/homepage.vue'
import Timeline from './../components/timeline.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/', component: HomePage
},
{
    path: '/timeline', component: Timeline, props: true
}]

const router = new VueRouter({
    mode: 'history',
    base: process.env.Base_URL,
    routes
})

export default router
