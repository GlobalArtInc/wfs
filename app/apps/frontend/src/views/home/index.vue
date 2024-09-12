<template>
  <v-row class="text-center">
    <v-col cols="12">
      <v-img
          class="my-3"
          contain
          height="200"
      />
    </v-col>

    <v-col class="mb-4">
      <h1 class="display-2 font-weight-bold mb-3">
        Warface BOT Stat
      </h1>

      <p class="subheading font-weight-regular">
        Бот для отображения вывода статистики игроков Warface
      </p>
      <v-btn color="primary" v-if="is_logged" to="/dashboard" large>
        <v-icon dark large style="margin-right: 0.5em">mdi-discord</v-icon>
        Добавить в Discord
      </v-btn>
      <v-btn color="primary" v-else :href="this.auth_url" large>
        <v-icon dark large style="margin-right: 0.5em">mdi-discord</v-icon>
        Добавить в Discord
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'HelloWorld',
  computed: {
    ...mapGetters([
      'is_logged'
    ]),
  },
  data: () => ({
    auth_url: `${process.env.VUE_APP_BASE_API ?? 'https://wfs.globalart.dev/api'}/login`,
    ecosystem: [
      {
        text: 'vuetify-loader',
        href: 'https://github.com/vuetifyjs/vuetify-loader',
      },
      {
        text: 'github',
        href: 'https://github.com/vuetifyjs/vuetify',
      },
      {
        text: 'awesome-vuetify',
        href: 'https://github.com/vuetifyjs/awesome-vuetify',
      },
    ],
    importantLinks: [
      {
        text: 'Documentation',
        href: 'https://vuetifyjs.com',
      },
      {
        text: 'Chat',
        href: 'https://community.vuetifyjs.com',
      },
      {
        text: 'Made with Vuetify',
        href: 'https://madewithvuejs.com/vuetify',
      },
      {
        text: 'Twitter',
        href: 'https://twitter.com/vuetifyjs',
      },
      {
        text: 'Articles',
        href: 'https://medium.com/vuetify',
      },
    ],
    whatsNext: [
      {
        text: 'Explore components',
        href: 'https://vuetifyjs.com/components/api-explorer',
      },
      {
        text: 'Select a layout',
        href: 'https://vuetifyjs.com/layout/pre-defined',
      },
      {
        text: 'Frequently Asked Questions',
        href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
      },
    ],
  }),
}
</script>
