import request from "@/utils/request"

export function getGuilds() {
    return request({
        url: '/guilds',
        method: 'get'
    })
}

export function getGuild(guild_id) {
    return request({
        url: `/guilds/${guild_id}`,
        method: 'get'
    })
}

export function setChannels(guild_id, channels) {
    return request({
        url: `/guilds/${guild_id}/channel${channels ? `?channels=${channels}` : ''}`,
        method: 'post'
    })
}

export function setNick(guild_id, nick) {
    return request({
        url: `/guilds/${guild_id}/nick?nick=${nick}`,
        method: 'post'
    })
}

export function leaveGuild(guild_id) {
    return request({
        url: `/guilds/${guild_id}/leave`,
        method: 'post'
    })
}
