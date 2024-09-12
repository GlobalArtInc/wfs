<template>
  <v-list v-if="guilds_arr.length > 0">
    <v-list-item :key="key" v-for="(guild, key) in guilds_arr" @click="onGuildClick(guild)"
                 style="/*border-top: 1px solid;border-color: rgba(255, 255, 255, 0.12); */">
      <v-list-item-icon>
        <v-avatar v-if="guild.icon === null" color="indigo">
          <span class="white--text">{{ setAvatar(guild.name) }}</span>
        </v-avatar>
        <v-avatar v-else>
          <v-img :src="guild.icon"/>
        </v-avatar>
      </v-list-item-icon>
      <v-list-item-title v-text="guild.name"/>
      <v-list-item-action v-if="admin === true">
        <v-btn color="green" text style="margin-right: 5em">
          {{ $t('serversList.management') }}
        </v-btn>
      </v-list-item-action>
      <template v-else>
        <v-list-item-action v-if="guild.is_have === true">
          <v-btn color="green" text style="margin-right: 5em">
            {{ $t('serversList.management') }}
          </v-btn>
        </v-list-item-action>
        <v-list-item-action v-else>
          <v-btn text style="margin-right: 5em">
            {{ $t('serversList.to_configure') }}
          </v-btn>
        </v-list-item-action>
      </template>
    </v-list-item>
  </v-list>
</template>

<script>
import {getGuilds} from "@/api/guilds";

export default {
  props: {
    guilds: {
      type: Array,
      required: true,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    admin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      guilds_arr: this.guilds
    }
  },
  methods: {
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
      if (this.admin === true) {
        this.$router.push(`/admin/servers/${guild.id}`)
      } else {
        if (guild.is_have === true) {
          this.$router.push(`/dashboard/${guild.id}`)
        } else {
          const url = `${process.env.VUE_APP_BASE_API ?? 'https://wfs.globalart.dev/api'}/authorize/${guild.id}`
          var params = "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no, width=0,height=0,left=-1000,top=-1000"
          let open = window.open(url, "WF-BOT-ADD", params)
          // eslint-disable-next-line no-unused-vars
          let timer = setInterval(() => {
            try {
              if (open.location.pathname === '/guild-oauth') {
                let params = this.URLToArray(open.location.search);

                open.close()
                if (params['code']) {
                  this.$router.push(`/dashboard/${params['guild_id']}`)
                }
                getGuilds().then(guilds => {
                  this.guilds_arr = guilds;
                })
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
}
</script>
