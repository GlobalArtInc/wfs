<template>
  <div>
    <v-text-field label="Никнейм" v-model="name" outlined append-icon="mdi-account-search" @click:append="onSearch"/>
  </div>
</template>

<script>
import {getPlayer} from '@/api/stats'

export default {
  data: () => ({
    name: ""
  }),
  methods: {
    onSearch() {
      if (this.name.length <= 2) {
        this.$toast("Недопустимый никнейм", {
          type: 'error'
        });
      } else {
        getPlayer(this.name).then((player) => {
          this.$router.push(`/stats/${player.player.nickname}/view`)
        }).catch((err) => {
          this.$toast(err.message, {
            type: 'error'
          });
        })
      }
    }
  }
}
</script>
