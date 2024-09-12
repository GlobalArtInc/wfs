<template>
  <v-card
      class="mx-auto"
      outlined
      elevation="2"
  >
    <v-card-title>
      {{ $t('home.my_servers') }}
    </v-card-title>
    <v-card v-if="isError">
      <v-card-text style="text-align: center">
        <h3>Возникла ошибка</h3>
        <v-btn @click="getGuilds">Список серверов</v-btn>
      </v-card-text>
    </v-card>
    <template v-else>
      <v-list v-if="isLoading && guilds.length > 0">
        <ServersList :guilds="guilds" :admin="false"/>
      </v-list>
      <v-skeleton-loader v-else-if="isLoading === false" type="list-item-two-line, list-item-two-line"/>
      <v-card-text v-else>
        <h2 style="text-align: center">{{ $t('home.empty') }}</h2>
      </v-card-text>
    </template>
  </v-card>

</template>

<script>
import {getGuilds} from "@/api/guilds";
import ServersList from "@/components/ServersList";

export default {
  components: {ServersList},
  data: () => ({
    isLoading: false,
    isError: false,
    isErrorLoad: false,
    guilds: []
  }),
  created() {
    this.getGuilds();
  },
  methods: {
    getGuilds() {
      getGuilds().then(guilds => {
        this.isLoading = true
        this.guilds = guilds
        this.isError = false
      }).catch(() => {
        this.isError = true
      }).finally(() => {
        this.isErrorLoad = false
      })
    },
    URLToArray(url) {
      var request = {};
      var pairs = url.substring(url.indexOf('?') + 1).split('&');
      for (var i = 0; i < pairs.length; i++) {
        if (!pairs[i])
          continue;
        var pair = pairs[i].split('=');
        request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }
      return request;
    },
    setAvatar(name) {
      const server = name.split(" ")
      if (server[0] && server[1]) {
        return `${server[0].substr(0, 1).toUpperCase()}${server[1].substr(0, 1).toLowerCase()}`
      } else {
        return name.substr(0, 3)
      }
    },
    onGuildClick(guild) {
      if (guild.is_have === true) {
        this.$router.push(`/dashboard/${guild.id}`)
      } else {
        const url = `${process.env.VUE_APP_BASE_API ?? 'https://wfs.globalart.dev/api'}/authorize/${guild.id}`
        const params = "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no, width=0,height=0,left=-1000,top=-1000";
        let open = window.open(url, "WF-BOT-ADD", params)
        // eslint-disable-next-line no-unused-vars
        let timer = setInterval(async () => {
          try {
            if (open.location.pathname === '/guild-oauth') {
              let params = this.URLToArray(open.location.search);

              open.close()
              try {
                this.guilds = await getGuilds();
                setTimeout(async () => {
                  if (params['code']) {
                    await this.$router.push(`/dashboard/${params['guild_id']}`)
                  }
                }, 500)
              } catch (err) {
                //
              } finally {
                clearInterval(timer)
              }
              clearInterval(timer)
            }
          } catch (e) {
            return false;
          }
        })
      }
    }
  }
}
</script>
