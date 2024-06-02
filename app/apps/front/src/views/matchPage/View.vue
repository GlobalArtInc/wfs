<template>
  <v-progress-linear indeterminate absolute top color="success" v-if="!isLoading" />
  <div style="margin: 0 auto;" v-else>

    <v-row style="margin-bottom: 1em">
      <v-col cols="12">
        <v-card>
          <v-img
              :src="data.image"
              height="125"
              class="grey darken-4"
          ></v-img>
          <v-card-title class="title">
            [{{ data.mode }}] {{ data.name }}
            <v-spacer />
            {{ data.date }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <h2 style="text-align: center" v-text="data.winner"/>

    <div style="margin-top: 1em">
      BlackWood
      <Table :items="data.blackWood" />
    </div>

    <div style="margin-top: 1em">
      Warface
      <Table :items="data.warFace" />
    </div>

  </div>
</template>

<script>
import {getView} from "@/api/match";
import Table from "@/views/matchPage/Table";

export default {
  components: {Table},
  props: {
    id: {type: String}
  },
  data: () => ({
    isLoading: false,
    data: {}
  }),
  created() {
    getView(this.id).then(data => {
      this.data = data
      this.isLoading = true
    })
  }
}
</script>
