import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        hasLogin: false,
        loginName: '',
        breadcrumb: []
    },
    mutations: {
        login(state, data) {
            state.hasLogin = true;
            state.loginName = data.loginName;
            state.role = data.role;
        },
        logout(state) {
            state.hasLogin = false;
        }
    },
    actions: {

    }
})
