import request from "@/utils/request"

export function getProtected() {
    return request({
        url: "/protected",
        method: "get"
    })
}