import request from "@/utils/request"

export function getServers() {
    return request({
        url: "/protected/servers",
        method: "get"
    })
}