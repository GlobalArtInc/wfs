<template>
  <v-card
      class="mx-auto"
      outlined
      elevation="2"
  >
    <v-card-title>
      {{ $t('home.all_servers') }}
    </v-card-title>
    <v-list v-if="isLoading && data.length > 0">
      <v-card-title>
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            filled
        ></v-text-field>
      </v-card-title>
      <v-data-table
          :headers="headers"
          :items="data"
          :search="search">
        <template #item.name="{item}">
          <v-avatar v-if="item.icon === null" color="indigo" style="margin-top: 0.5em;margin-bottom: 0.5em;margin-right: 1em">
            <span class="white--text">{{ setAvatar(item.name) }}</span>
          </v-avatar>
          <v-avatar v-else style="margin-top: 0.5em;margin-bottom: 0.5em;margin-right: 1em">
            <v-img :src="item.icon"/>
          </v-avatar>
          {{ item.name }}
        </template>
      </v-data-table>
    </v-list>
    <v-skeleton-loader v-else-if="isLoading === false" type="list-item-two-line, list-item-two-line"/>
    <v-card-text v-else>
      <h2 style="text-align: center">{{ $t('home.empty') }}</h2>
    </v-card-text>
  </v-card>
</template>

<script>
import {getServers} from "@/api/protected/servers";

export default {
  methods: {
    setAvatar(name) {
      const server = name.split(" ")
      if (server[0] && server[1]) {
        return `${server[0].substr(0, 1).toUpperCase()}${server[1].substr(0, 1).toLowerCase()}`
      } else {
        return name.substr(0, 3)
      }
    },
  },
  data: () => ({
    isLoading: false,
    data: [],
    search: "",
    headers: [
      {text: 'name', sortable: false, align: 'left', value: 'name'}
    ],
  }),
  created() {
    getServers().then(res => {
      this.isLoading = true
      this.data = res
    })
  }
}

</script>