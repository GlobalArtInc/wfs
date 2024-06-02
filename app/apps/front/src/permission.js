import router from "./router"

import store from "./store"

import getPageTitle from '@/utils/get-page-title'
/* eslint-disable */
import i18n from "@/utils/setup-i18n";
import {refreshUser} from "@/api/user";

const whiteList = ['/social'] // no redirect whitelist

var cookie = require('vue-cookie')
import Toast from "vue-toastification";


router.beforeEach(async (to, from, next) => {
    if (whiteList.indexOf(to.path) !== -1 || to.path === '/') {
        //  await store.dispatch('header/hide')
    } else {
        //  await store.dispatch('header/show')
    }

    document.title = getPageTitle(to.meta);

    if (to.meta.publicRoute === true) next()

    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('state') === 'logged') {
        cookie.set("token", searchParams.get("token"))
        await store.dispatch('user/getInfo', {
            token: searchParams.get('token'),
            refresh_token: searchParams.get('refresh_token')
        }).then((response) => {
            i18n.locale = response.user.language
            cookie.set('token', searchParams.get('token'))
            cookie.set('refresh_token', searchParams.get('refresh_token'))
            if (to.path === '/') {
                next({path: '/dashboard'})
            } else {
                next()
            }
        }).catch(err => {

        })
    }
    if (cookie.get('token')) {
        let getInfo = () => store.dispatch('user/getInfo', {
            token: cookie.get('token'),
            refresh_token: cookie.get('refresh_token')
        }).then((response) => {
            i18n.locale = response.user.language
            if (to.path === '/') {
                next({path: '/dashboard'})
            } else {
                next()
            }
        }).catch(() => {
            /*if (cookie.get('refresh_token')) {
                refreshUser(cookie.get('refresh_token')).then(res => {
                    cookie.set('token', res.access_token)
                    cookie.set('refresh_token', res.refresh_token)
                }).catch((err) => {
                    cookie.delete('token')
                    cookie.delete('refresh_token')
                    next("/")
                })
            } else {
                cookie.delete('token')
                next("/")
            } */
            //cookie.delete('token')
            //next("/")
        })
        await getInfo()
    } else {
        await store.dispatch('user/load')
        if (to.meta.protected === true) {
            next('/')
        } else {
            next()
        }
    }
})

