<template>
  <v-row>
    <v-col
        v-for="(item, i) in data"
        :key="i"
        cols="4"
    >
      <v-card
          :color="item.color"
          dark>
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title
                class="headline"
                v-text="item.title"
            ></v-card-title>
            <v-card-subtitle v-text="item.data"></v-card-subtitle>
            <v-card-actions>
              <v-btn
                  v-if="item.href"
                  :to="item.href"
                  class="ml-2"
                  outlined>
                Управлять
              </v-btn>
            </v-card-actions>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>

</template>

<script>
import {getProtected} from "@/api/protected/main";

export default {
  data: () => ({
    isLoading: false,
    data: []
  }),
  created() {
    getProtected().then((res) => {
      this.data = [
        {color: '#1F7087', title: "Количество пользователей", href: '/admin/users', data: res.users},
        {color: '#1F7087', title: "Количество серверов", href: '/admin/servers', data: `${res.servers} / ${res.total_servers}`},
        {color: '#1F7087', title: "Сохраненные пользователи", data: res.saved_users},
        {color: '#1F7087', title: "Админов", href: '/admin/admins', data: res.admins}
      ]
    })
  },
  methods: {
    setAvatar(name) {
      const server = name.split(" ")
      if (server[0] && server[1]) {
        return `${server[0].substr(0, 1).toUpperCase()}${server[1].substr(0, 1).toLowerCase()}`
      } else {
        return name.substr(0, 3)
      }
    },
    onGuildClick(guild) {
      this.$router.push(`/admin/${guild.id}`)
    }
  }
}
</script>
