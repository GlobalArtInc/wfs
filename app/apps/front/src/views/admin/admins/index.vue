<template>
  <v-list>
    <v-list-item :key="item.user_id" v-for="(item, key) in data">
      <v-list-item-content>
        {{key+1}})
        ID: {{ item.user_id }}
      </v-list-item-content>
      <v-list-item-action>
        <template v-if="user.id === item.user_id">
          Это вы
        </template>
        <v-btn color="error" icon v-else>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
import {getAdmins} from '@/api/protected/admins'
import {mapGetters} from 'vuex';

export default {
  data: () => ({
    data: []
  }),
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    getAdmins().then(res => {
      this.data = res;
    })
  }
}
</script>