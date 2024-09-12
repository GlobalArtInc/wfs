<template>
  <v-menu
      bottom
      min-width="200px"
      offset-y
  >
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on" class="d-flex" style="margin-right: 1em">
        <v-icon>mdi-apps</v-icon>
      </v-btn>
    </template>
    <v-card light>
      <v-list style="padding: 0" nav>
        <v-list-item to="/stats" link>
          <v-list-item-title>Поиск статистики</v-list-item-title>
        </v-list-item>
        <v-list-item to="/linked" link v-if="is_logged">
          <v-list-item-title>Привязанные аккаунты</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  computed: {
    ...mapGetters(['user', 'is_logged'])
  }
}

</script>
