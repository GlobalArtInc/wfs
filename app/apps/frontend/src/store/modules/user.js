import {getInfo, getPlayers, getClans, getLinks, logout} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import router, {resetRouter} from '@/router'

const state = {
    token: getToken(),
    refresh_token: '',
    name: '',
    avatar: '',
    isLoaded: false,
    is_logged: false,
    user: {
        id: "",
        username: "",
        avatar: "",
        discriminator: "",
        email: "",
        language: "",
        permission: 0
    },
    players: [],
    clans: [],
    email: '',
    introduction: '',
    roles: []
}

const mutations = {
    SET_LOADED: (state, data) => {
        setTimeout(() => {
            state.isLoaded = data
        }, 500)
    },
    SET_LANG: (state, data) => {
        state.user.language = data
    },
    SET_USER: (state, data) => {
        state.is_logged = true;
        state.user = data
    },
    SET_PLAYERS: (state, data) => {
        state.players = data;
    },
    SET_CLANS: (state, data) => {
        state.clans = data;
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    LOGOUT: (state) => {
        state.is_logged = false;
    }
}

const actions = {
    setLang({commit}, lang) {

        commit('SET_LANG', lang)
    },
    load({commit}) {
        commit('SET_LOADED', true)
    },
    // get user info
    getInfo({commit}, data) {
        commit('SET_TOKEN', data.token)
        return new Promise((resolve, reject) => {
            getInfo(data).then(response => {
                const {user, linked} = response
                commit('SET_LOADED', true)
                commit('SET_PLAYERS', linked.players)
                commit('SET_CLANS', linked.clans)
                commit('SET_USER', user)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    getLinks({commit}) {
        return new Promise((resolve, reject) => {
            getLinks().then(response => {
                commit('SET_CLANS', response.clans)
                commit('SET_PLAYERS', response.players)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    getPlayers({commit}) {
        return new Promise((resolve, reject) => {
            getPlayers().then(response => {
                commit('SET_PLAYERS', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    getClans({commit}) {
        return new Promise((resolve, reject) => {
            getClans().then(response => {
                commit('SET_CLANS', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    logout({commit}) {
        return new Promise((resolve, reject) => {
            logout().then(response => {
                removeToken();
                commit('SET_USER', {})
                commit('LOGOUT')
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({commit}) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
        })
    },

    // dynamically modify permissions
    changeRoles({commit, dispatch}, role) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            const token = role + '-token'

            commit('SET_TOKEN', token)
            setToken(token)

            const {roles} = await dispatch('getInfo')

            resetRouter()

            // generate accessible routes map based on roles
            const accessRoutes = await dispatch('permission/generateRoutes', roles, {root: true})

            // dynamically add accessible routes
            router.addRoutes(accessRoutes)

            // reset visited views and cached views
            dispatch('tagsView/delAllViews', null, {root: true})

            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
