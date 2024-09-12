<template>
  <div>
    <div class="player-skills">
      {{ data.player }}
    </div>
  </div>
</template>
<style>

#pve_playtime .foreground-circle {
  stroke: #ff4400;
}

.player-skills {
  text-align: center;
  margin: 25px auto 50px;
  max-width: 1060px;
}
.player-skills .playtime-circles {
  float: left;
  width: 100%;
  max-width: 125px;
  height: 255px;
  margin-right: 20px;
}
.player-skills .playtime-circles > div {
  display: inline-block;
  max-width: 125px;
}
</style>

<script>
export default {
  props: {data: Object},
  mounted() {
 //  const player = this.data

 //  const pvpPlayTime = number(player.fullPlayer['[class]Rifleman [mode]PVP [stat]player_playtime']) +
 //      number(player.fullPlayer['[class]Recon [mode]PVP [stat]player_playtime']) +
 //      number(player.fullPlayer['[class]Medic [mode]PVP [stat]player_playtime']) +
 //      number(player.fullPlayer['[class]Engineer [mode]PVP [stat]player_playtime']) +
 //      number(player.fullPlayer['[class]Heavy [mode]PVP [stat]player_playtime'])

 //  const pvePlayTime = number(player.fullPlayer['[class]Rifleman [mode]PVE [stat]player_playtime']) +
 //      number(player.fullPlayer['[class]Recon [mode]PVE [stat]player_playtime']) +
 //      number(player.fullPlayer['[class]Medic [mode]PVE [stat]player_playtime']) +
 //      number(player.fullPlayer['[class]Engineer [mode]PVE [stat]player_playtime']) +
 //      number(player.fullPlayer['[class]Heavy [mode]PVE [stat]player_playtime'])

 //  const totalTime = pvePlayTime+pvpPlayTime
 //  const x1 = totalTime/100


   // circliful.newCircle({
   //   percent: Math.ceil(pvpPlayTime/x1),
   //   text: "PVP",
   //   id: 'pvp_playtime',
   //   type: 'simple',
   //   foregroundCircleWidth: 10,
   //   backgroundCircleWidth: 10,
   //   strokeLinecap: "round"
   // })
//
   // circliful.newCircle({
   //   percent: Math.ceil(pvePlayTime/x1),
   //   text: "PVE",
   //   id: 'pve_playtime',
   //   type: 'simple',
   //   color: "#ff4400",
   //   foregroundCircleWidth: 10,
   //   backgroundCircleWidth: 10,
   //   strokeLinecap: "round"
   // })
  }
}
</script>
