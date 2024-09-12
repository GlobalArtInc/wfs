<template>
  <v-row v-if="isLoaded">
    <v-col :cols="12">
      <v-card class="mx-auto" outlined>
        <v-card-title>
          {{ $t("serversList.server_settings") }}
          <v-spacer />
        </v-card-title>
        <v-card-text>
          <v-select
            :items="guild.channels"
            multiple
            v-model="guild.settings.default_channel"
            @change="changeChannel"
            item-text="name"
            item-value="id"
            filled
            :label="$t('serversList.default_channel')"
          >
          </v-select>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col :cols="12">
      <v-card class="mx-auto" outlined>
        <v-card-title>
          {{ $t("serversList.bot_settings") }}
          <v-spacer />
          <v-dialog
            light
            v-model="dialog.onLeave"
            :persistent="loading.onLeave"
            max-width="300"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                color="error"
                :loading="loading.onLeave"
                v-bind="attrs"
                v-on="on"
              >
                {{ $t("serversList.leave") }}
              </v-btn>
            </template>
            <v-card>
              <template v-if="loading.onLeave">
                <v-card-text style="padding: 1em">
                  <div class="text-center">
                    <h4>{{ $t("serversList.leave_process") }}</h4>
                    <v-progress-circular indeterminate size="50" color="blue" />
                  </div>
                </v-card-text>
              </template>
              <template v-else>
                <v-card-title class="headline">
                  {{ $t("serversList.leave") }}?
                </v-card-title>
                <v-card-text>
                  {{ $t("serversList.leave_text", { name: guild.name }) }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :loading="loading.onLeave"
                    color="green darken-1"
                    text
                    @click="dialog.onLeave = false"
                  >
                    {{ $t("button.cancel") }}
                  </v-btn>
                  <v-btn
                    :loading="loading.onLeave"
                    color="green darken-1"
                    text
                    @click="leaveGuild"
                  >
                    {{ $t("button.leave") }}
                  </v-btn>
                </v-card-actions>
              </template>
            </v-card>
          </v-dialog>
        </v-card-title>
        <v-card-text>
          <v-text-field
            :loading="loading.setNick"
            v-model="guild.bot_name"
            :label="$t('username')"
            filled
            hide-details="auto"
          >
            <template slot="append-outer">
              <v-btn
                @click="setNick"
                text
                icon
                small
                :loading="loading.setNick"
              >
                <v-icon color="green"> mdi-send </v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-progress-linear v-else absolute top indeterminate color="green" />
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { leaveGuild, setNick, setChannels } from "@/api/guilds";
import {getToken} from "@/utils/auth";

export default {
  data: () => ({
    ws: null,
    ws_state: null,
    isLoaded: false,
    loading: {
      setNick: false,
      setPrefix: false,
      onLeave: false,
    },
    dialog: {
      onLeave: false,
    },
    guild: {},
  }),
  methods: {
    changeChannel() {
      let arr = [];
      this.guild.channels.forEach((i) => {
        if (this.guild.settings.default_channel.indexOf(i.id) >= 0)
          arr.push(i.id);
      });
      this.ws.send(
        JSON.stringify({ type: "setChannels", channels: arr.join(", ") })
      );
    },
    setNick() {
      this.loading.setNick = true;
      this.ws.send(
        JSON.stringify({ type: "setNick", name: this.guild.bot_name })
      );
    },
    leaveGuild() {
      this.loading.onLeave = true;
      this.ws.send(JSON.stringify({ type: "leaveGuild" }));
    },
    getWebSocketUrl(urlAdress) {
      return urlAdress
        .replace("http://", "ws://")
        .replace("https://", "wss://");
    },
    onConnect() {
      if (!this.$route.params.guild_id) return;
      this.ws = new WebSocket(
        this.getWebSocketUrl(
          `${process.env.VUE_APP_BASE_API ?? 'https://wfs.globalart.dev/api'}/gateway?guildId=${this.$route.params.guild_id}&access_token=${getToken()}`
        )
      );

      this.ws.onclose = () => {
        this.ws_state = "close";
        this.onConnect();
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.ws_state = null;
        if (data.type === "getGuild") {
          this.isLoaded = true;
          this.guild = data.data;
        } else if (data.type === "setChannels") {
          //
        } else if (data.type === "leaveGuild") {
          setTimeout(() => {
            this.loading.onLeave = false;
          }, 500);

          if (data.message === "bot_leave") {
            this.dialog.onLeave = false;
            this.loading.onLeave = false;
            this.$router.push("/dashboard");

            this.$toast("Бот вышел с сервера", {
              type: "success",
            });
          } else {
            this.$toast(data.message, {
              type: "error",
            });
          }
        } else if (data.type === "setNick") {
          setTimeout(() => {
            this.loading.setNick = false;
          }, 500);
          if (data.message === "nickname_changed") {
            this.$toast("Никнейм изменен", {
              type: "success",
            });
          } else {
            this.$toast(data.message, {
              type: "error",
            });
          }
        }
      };
    },
  },
  beforeDestroy() {
    this.ws.close();
  },
  created() {
    this.onConnect();
  },
};
</script>
