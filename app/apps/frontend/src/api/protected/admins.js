import request from "@/utils/request"

export function getAdmins() {
    return request({
        url: "/protected/admins",
        method: "get"
    })
}