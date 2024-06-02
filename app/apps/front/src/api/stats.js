import request from "@/utils/request"

export function getPlayer(name) {
    return request({
        url: `/stats/${name}/player`,
        method: 'GET'
    })
}
