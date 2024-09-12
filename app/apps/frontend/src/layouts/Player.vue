<template>
  <div v-if="isLoaded">
    <div class="player-profile">
      <UserBar :player="player"/>
      <v-tabs hide-slider style="margin-top: 2em" grow>
        <v-tab :key="0" :to="{name: 'statsView'}">Сводка</v-tab>
        <v-tab :key="1" :to="{name: 'statsPVP'}">PVP</v-tab>
      </v-tabs>
      {{ player.state }}
    </div>
    <router-view :data="player"/>
  </div>
  <v-progress-linear v-else indeterminate color="success" absolute top/>
</template>

<script>
import {getPlayer} from "@/api/stats"
//import UserBar from "@/components/Player/UserBar";

export default {
  //components: {UserBar},
  props: {
    name: {type: String}
  },
  data: () => ({
    isLoaded: false,
    player: {}
  }),
  created() {
    getPlayer(this.name).then((data) => {
      this.isLoaded = true
      this.player = data
    })
  }
}
</script>
