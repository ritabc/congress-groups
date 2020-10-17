import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from './../views/homepage.vue'
import Timeline from './../components/timeline.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
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
