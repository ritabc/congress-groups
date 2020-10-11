import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App.vue', () => {
    it('renders the app title', () => {
        const wrapper = mount(App)
        expect(wrapper.text()).toMatch("Minority Groups In Congress")
    })
})