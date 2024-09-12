import request from "@/utils/request"

export function logout (){
    return request({
        url: '/logout',
        method: 'post'
    })
}
export function getInfo (){
    return request({
        url: '/users/@me',
        method: 'get'
    })
}

export function refreshUser(token) {
    return request({
        url: '/refresh?token=' + token,
        method: 'post'
    })
}

export function setLang(lang) {
    return request({
        url: `/users/@me/setLang/${lang}`,
        method: 'post'
    })
}

export function getPlayers (){
    return request({
        url: '/users/@me/players',
        method: 'get'
    })
}

export function getLinks (){
    return request({
        url: '/users/@me/binds',
        method: 'get'
    })
}

export function getClans (){
    return request({
        url: '/users/@me/clans',
        method: 'get'
    })
}

export function unlinkPlayer(server_id) {
    return request({
        url: `/users/@me/unlink/${server_id}/player`,
        method: 'post'
    })
}

export function unlinkClan(server_id) {
    return request({
        url: `/users/@me/unlink/${server_id}/clan`,
        method: 'post'
    })
}
