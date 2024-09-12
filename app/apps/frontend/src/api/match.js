import request from "@/utils/request"

export function fetchMatches(name) {
    return request({
        url: `/match/${name}`,
        method: 'get'
    })
}

export function getView(id) {
    return request({
        url: `/match/view/${id}`,
        method: 'get'
    })
}
