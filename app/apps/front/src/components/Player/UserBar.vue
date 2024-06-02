<template>
  <div class="player">
    <table class="ts-userbar">
      <tbody><tr>

        <td rowspan="2" class="rank"><div :style="`background-position: 0 -${(player.player.rank_id-1)*32}px;`"></div></td>
        <td class="nickname">{{ player.player.nickname }}</td>

      </tr>
      <tr>

        <td class="server">Сервер: «{{ getServer(player.server_id) }}»</td>
      </tr>
      </tbody></table>
  </div>
</template>

<script>
export default {
  props: {
    player: {type: Object}
  },
  methods: {
    getServer(server_id) {
      switch (server_id) {
        case 1:
          return "Альфа"
        case 2:
          return "Браво"
        case 3:
          return "Чарли"
      }
    }
  }
}
</script>

<style>
.player-profile .player,
.players .player {
  margin: 0 auto 10px;
}
table {
  margin: 0 auto;
  max-width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

table.ts-userbar {}

table.ts-userbar .rank {
  width: 64px;
}

table.ts-userbar .rank div {
  margin: 0 auto;
  width: 32px;
  height: 32px;
  background-image: url(https://cdn.globalart.dev/web/imgs/wfru/ranks_all.png);
}

table.ts-userbar .nickname {
  font-size: 1.76em;
  color: #FFF !important;
  white-space: nowrap;
}

table.ts-userbar .server {
  font-size: 0.968em;
  color: #ABABAB !important;
  white-space: nowrap;
}

table.ts-userbar .title {
  padding-left: 35px;
  font-size: 2.376em;
}

table.ts-userbar .title.vip {
  color: rgb(255, 215, 0);
}

@media(max-width: 800px) {
  table.ts-userbar .title {
    display: none;
  }
}



table.ts-userbar.last-found {
  position: relative;
  line-height: 16px;
  margin: 11px 0;
  width: 100%;
  height: 55px;
  padding: 5px 0;
}

table.ts-userbar.last-found .clan {
  font-size: 0.968em;
  color: #EED502 !important;
  white-space: nowrap;
}

table.ts-userbar.last-found .noclan {
  font-size: 0.968em;
  color: #ABABAB !important;
  white-space: nowrap;
  opacity: 0.5;
}

table.ts-userbar.last-found .nickname {
  width: 170px;
  font-size: 1.1em;
}

table.ts-userbar.last-found .nickname a {
  color: #FFF !important;
}

table.ts-userbar.last-found .stats {
  position: relative;
  padding: 5px 0 5px 15px;
  color: #FFF !important;
  font-family: 'Courier New';
  font-size: 0.704em;
  line-height: 0.9em;
  vertical-align: middle;
}

table.ts-userbar.last-found.vip .stats span {
  display: none !important;
}

table.ts-userbar.last-found.vip .stats a {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

table.ts-userbar.last-found.truesight .stats {
  background: url(/images/search/vip-truesight.png) center center no-repeat;
}

table.ts-userbar.last-found.warface .stats {
  background: url(/images/search/vip-warface.png) center center no-repeat;
}

table.ts-userbar.last-found.crown .stats {
  background: url(/images/search/vip-crown.png) center center no-repeat;
}

table.ts-userbar.last-found.youtube .stats {
  background: url(/images/search/vip-youtube.png) center center no-repeat;
}

</style>
