import Vue from 'vue'
import VueRouter from 'vue-router'
import Timeline from './../components/timeline.vue'

Vue.use(VueRouter)
// Vue.use(BootstrapVue)
// Vue.use(IconsPlugin)
const routes = [
    // {
    //     path: '/timeline', component: Timeline
    // },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.Base_URL,
    routes
})

export default router
