<template>
  <v-app v-if="isLoaded">
    <v-app-bar
        app
        color="darken"
        dark
    >
      <v-container style="width: 100%;padding: 0">
        <div class="d-flex align-center">
          <Left/>
          <router-link :to="is_logged ? `/dashboard` : '/'">
            <v-img
                class="shrink mr-2"
                contain
                src="./assets/wf-logo.png"
                width="40"/>
          </router-link>
          <router-link :to="is_logged ? `/dashboard` : '/'">
            <v-img
                class="shrink mt-1 hidden-sm-and-down"
                contain
                min-width="100"
                src="./assets/wfs-dark.png"
                width="100"
            />
          </router-link>
          <v-spacer></v-spacer>
          <v-btn icon target="_blank" href="https://discord.gg/BBFhU8g">
            <v-img
                class=""
                contain
                src="https://cdn.globalart.dev/web/imgs/discord_round.png"
                max-width="50"
            />
          </v-btn>
          <template v-if="is_logged === true">
            <v-dialog
                v-model="dialog.language"
                width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon x-large v-bind="attrs" v-on="on" style="margin-left: 0.5em">
                  <v-avatar>
                    <v-img :src="`https://cdn.globalart.dev/web/flags/round/svg/${getLanguage(user.language)}.svg`"/>
                  </v-avatar>
                </v-btn>
              </template>
              <template v-slot:default="dialog">
                <v-card>
                  <v-toolbar
                      color="primary"
                      dark
                  >Select language
                  </v-toolbar>
                  <v-card-text style="padding: 0">
                    <v-list>
                      <v-list-item @click="setLanguage('ru')">
                        <v-list-item-icon>
                          <v-avatar>
                            <v-img src="https://cdn.globalart.dev/web/flags/round/svg/ru.svg"/>
                          </v-avatar>
                        </v-list-item-icon>
                        <v-list-item-content>
                          Russian
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item @click="setLanguage('en')">
                        <v-list-item-icon>
                          <v-avatar>
                            <v-img src="https://cdn.globalart.dev/web/flags/round/svg/us.svg"/>
                          </v-avatar>
                        </v-list-item-icon>
                        <v-list-item-content>
                          English
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item @click="setLanguage('se')">
                        <v-list-item-icon>
                          <v-avatar>
                            <v-img src="https://cdn.globalart.dev/web/flags/round/svg/se.svg"/>
                          </v-avatar>
                        </v-list-item-icon>
                        <v-list-item-content>
                          Swedish
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item @click="setLanguage('uk')">
                        <v-list-item-icon>
                          <v-avatar>
                            <v-img src="https://cdn.globalart.dev/web/flags/round/svg/ua.svg"/>
                          </v-avatar>
                        </v-list-item-icon>
                        <v-list-item-content>
                          Ukraine
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item @click="setLanguage('de')">
                        <v-list-item-icon>
                          <v-avatar>
                            <v-img src="https://cdn.globalart.dev/web/flags/round/svg/de.svg"/>
                          </v-avatar>
                        </v-list-item-icon>
                        <v-list-item-content>
                          Germany
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn
                        text
                        @click="dialog.value = false"
                    >Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>

            <v-menu
                bottom
                min-width="200px"
                rounded
                offset-y
            >
              <template v-slot:activator="{ on }">
                <v-btn
                    icon
                    x-large
                    v-on="on"
                    style="margin-left: 0.5em"
                >
                  <v-avatar>
                    <v-img :src="user.avatar"/>
                  </v-avatar>
                </v-btn>
              </template>
              <v-card>
                <v-list-item-content class="justify-center">
                  <div class="mx-auto text-center">
                    <v-avatar>
                      <v-img :src="user.avatar"/>
                    </v-avatar>
                    <h3>{{ user.username }}#{{ user.discriminator }}</h3>
                    <p class="caption mt-1">
                      {{ user.email }}
                    </p>
                    <v-divider class="my-3"></v-divider>
                    <v-btn
                        @click="onLogout()"
                        depressed
                        rounded
                        text
                    >
                      Выйти
                    </v-btn>
                  </div>
                </v-list-item-content>
              </v-card>
            </v-menu>
          </template>
          <template v-else>
            <v-btn
                :href="auth_url"
                text
                style="margin-left: 0.5em"
            >
              <span class="mr-2">Авторизация</span>
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>

        </div>
      </v-container>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
  <Preloader v-else />
</template>

<script>
import {mapGetters} from 'vuex'
import {setLang} from "@/api/user";
import Left from "@/components/Header/Left";
import Preloader from "@/components/Preloader";
import {getLanguage} from "@/utils/global";

export default {
  name: 'App',
  components: {Preloader, Left},
  created() {
    // this.auth_url = `${process.env.VUE_APP_BASE_API}/api/login`
  },
  computed: {
    ...mapGetters([
      'isLoaded',
      'is_logged',
      'user',
    ]),
  },
  methods: {
    getUrlParameter(sParam) {
      var sPageURL = window.location.search.substring(1),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i;

      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
      }
      return false;
    },
    getLanguage(lang) {
      return getLanguage(lang)
    },
    async setLanguage(lang) {
      try {
        await setLang(lang)
        this.$i18n.locale = lang
        this.dialog.language = false
        await this.$store.dispatch('user/setLang', lang)
      } catch (err) {
        this.$toast("Возникла ошибка", {
          type: "error",
        });
      }
    },
    async onLogout() {
      try {
        await this.$store.dispatch('user/logout')
        await this.$router.push('/')
      } catch (err) {
        this.$toast("Возникла ошибка", {
          type: "error",
        });
      }
    }
  },
  data: () => ({
    dialog: {
      language: false
    },
    auth_url: `${process.env.VUE_APP_BASE_API ?? 'https://wfs.globalart.dev/api'}/login?url=${document.location.pathname}`
  }),
};
</script>
