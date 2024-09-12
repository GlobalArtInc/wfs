<template>
  <v-container class="container">
    <router-view/>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  created() {
    if (this.user.permission < 4) {
      this.$toast("У вас недостаточно прав для просмотра", {
        type: 'error'
      });
      this.$router.push('/')
    }
  },
  computed: {
    ...mapGetters([
      'user',
    ])
  }
}
</script>

<style>
.container {
  max-width: 60%;
}

@media screen and (max-width: 1080px) {
  .container {
    max-width: 100%;
  }
}
</style>
