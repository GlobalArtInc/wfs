<template>
  <v-row>
    <v-col :cols="12" :md="12">
      <v-card
          class="mx-auto"
          outlined
      >
        <v-card-title>
          Привязанный клан
          <v-btn icon :loading="loading" @click="Reload"><v-icon>mdi-reload</v-icon></v-btn>
        </v-card-title>

        <v-card-text>
          <v-list v-if="clans.length > 0">
            <v-list-item :key="key" v-for="(clan, key) in clans">
              <v-list-item-content>
                <v-list-item-title>
                  Сервер: {{ clan.server }}
                </v-list-item-title>
                <v-list-item-content>
                  Клан: {{ clan.name }}
                </v-list-item-content>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn small color="error" fab>
                  <v-icon @click="unlinkClan(clan.server)">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <h3 v-else>Привязанных кланов нет: !set clan клан</h3>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="12" :md="12">
      <v-card
          class="mx-auto"
          outlined
      >
        <v-card-title>
          Привязанные аккаунты
          <v-btn icon :loading="loading" @click="Reload"><v-icon>mdi-reload</v-icon></v-btn>
        </v-card-title>

        <v-card-text>
          <v-list v-if="players.length > 0">
            <v-list-item :key="key" v-for="(player, key) in players">
              <v-list-item-content>
                <v-list-item-title>
                  Сервер: {{ player.server }}
                </v-list-item-title>
                <v-list-item-content>
                  Ник: {{ player.name }}
                </v-list-item-content>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn small color="error" fab>
                  <v-icon @click="unlinkPlayer(player.server)">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <h3 v-else>Привязанных аккаунтов нет: !set nickname ник</h3>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {unlinkPlayer, unlinkClan} from "@/api/user";
import {mapGetters} from 'vuex';

export default {
  data: () => ({
    loading: false
  }),
  computed: {
    ...mapGetters(['players', 'clans'])
  },
  methods: {
    Reload () {
      this.loading = true
      this.$store.dispatch('user/getLinks').then(() => {
        setTimeout(() => {
          this.loading = false
        }, 1000)
      })
    },

    unlinkPlayer(server) {
      unlinkPlayer(server).then(() => {
        this.$store.dispatch('user/getPlayers');
      })
    },
    unlinkClan(server) {
      unlinkClan(server).then(() => {
        this.$store.dispatch('user/getClans');
      })
    }
  }
}
</script>
