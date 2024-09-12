<template>
  <v-list subheader v-if="isLoaded">
    <v-subheader>Recent Matches</v-subheader>
    <v-data-table
        :headers="headers"
        :items="matches"
        hide-default-footer
        :items-per-page="15"
    >
      <template #item.img="{item}" >
        <v-img
            style="margin-top: 1em;margin-bottom: 1em"
            :src="item.image"
            max-width="180"
            max-height="48"
        >
          <template v-slot:default>
            <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
            >
              <div class="text-center">
                <h3 style="text-decoration: none">{{ item.name }}</h3>
              </div>
            </v-row>
          </template>
        </v-img>
      </template>
      <template #item.action="{item}">
        <router-link :to="`/match_page/${item.id}`" target="_blank">
          Сводка
        </router-link>
      </template>
    </v-data-table>
  </v-list>
  <div class="text-center" v-else>
    <v-progress-circular color="primary" size="50" indeterminate/>
  </div>
</template>

<script>
import {fetchMatches} from "@/api/match";

export default {
  data: () => ({
    isLoaded: false,
    matches: [],
    headers: [
      {
        text: "Название",
        value: "img",
        sortable: false,
        align: 'start'
      },
      {
        text: "Дата",
        value: "date",
        sortable: false,
        align: 'start'
      },
      {
        text: "Время",
        sortable: false,
        value: "time"
      },
      {
        text: "У/С",
        value: "kd",
        sortable: false,
      },
      {
        text: "Класс",
        sortable: false,
        value: "class"
      },
      {
        text: "Действие",
        sortable: false,
        value: "action"
      }
    ]
  }),
  props: {
    name: {type: String}
  },
  created() {
    fetchMatches(this.name).then((list) => {
      this.isLoaded = true
      this.matches = list.data
    })
  }
}
</script>
