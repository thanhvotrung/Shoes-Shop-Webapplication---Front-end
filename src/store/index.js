import {createStore} from 'vuex';

const store = createStore({
    state: {
        isAuthenticated: false,
        user: null,
    },
    mutations: {
        SET_AUTHENTICATION(state, isAuthenticated) {
            state.isAuthenticated = isAuthenticated;
        },
        SET_USER(state, user) {
            state.user = user;
        },
        SET_LOCAL(state) {
            localStorage.setItem('AUTH', JSON.stringify(state));
        },
    },
    actions: {
        login({ commit }, { username, role }) {
            // Thực hiện logic đăng nhập và cập nhật trạng thái
            commit('SET_AUTHENTICATION', true);
            commit('SET_USER', { username, role });
            commit('SET_LOCAL');

        },
        logout({ commit }) {
            // Thực hiện logic đăng xuất và cập nhật trạng thái
            commit('SET_AUTHENTICATION', false);
            commit('SET_USER', null);
            commit('SET_LOCAL');
        },
    },
});

export default store;
