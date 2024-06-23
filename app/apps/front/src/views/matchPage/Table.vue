<template>
  <v-data-table
    :headers="headers"
    :items="items"
    item-key="name"
    class="elevation-1"
    hide-default-footer
  >
    <template v-for="h in headers" v-slot:[`header.${h.value}`]>
      <v-tooltip :key="h.value" top v-if="h.tooltip">
        <template v-slot:activator="{ on }">
          <span v-on="on">{{ h.text }}</span>
        </template>
        <span>{{ h.tooltip }}</span>
      </v-tooltip>
      <span :key="h.value" v-else>{{ h.text }}</span>
    </template>

    <template #item.rank="{ item }">
      <div
        class="rank"
        :style="`background-image: url(https://s3.globalart.dev/api/s3/wfs/ranks_all.png);background-position: 0 -${
          (item.rank - 1) * 32
        }px;`"
      ></div>
    </template>
    <template #item.class="{ item }">
      <div
        class="gameClass"
        :style="`background-image: url(https://s3.globalart.dev/api/s3/wfs/class${item.class}.png);`"
      ></div>
    </template>
    <template #item.name="{ item }">
      <div style="display: inline-block">
        {{ item.name }}
      </div>
    </template>
  </v-data-table>
</template>

<style>
.rank {
  width: 32px;
  height: 32px;
}
.gameClass {
  width: 32px;
  height: 32px;
  background-size: cover;
}
</style>

<script>
export default {
  props: {
    items: {
      type: Array,
    },
  },
  data: () => ({
    headers: [
      {
        text: "Ранг",
        value: "rank",
        sortable: false,
      },
      {
        text: "Класс",
        value: "class",
        sortable: false,
      },
      {
        text: "Ник",
        value: "name",
        sortable: false,
      },
      {
        text: "Клан",
        value: "clan",
        sortable: false,
      },
      {
        text: "Убийств",
        value: "kills",
        sortable: false,
        align: "center",
      },
      {
        text: "ХШ",
        tooltip: "Убийств в голову",
        value: "headshots",
        sortable: false,
        align: "center",
      },
      {
        text: "Смертей",
        value: "deaths",
        sortable: false,
        align: "center",
      },
      {
        text: "У/С",
        tooltip: "Убийств / Смертей",
        value: "kd",
        sortable: false,
        align: "center",
      },
      {
        text: "Б/бой",
        tooltip: "Убийств в ближнем бою",
        value: "melee",
        sortable: false,
        align: "center",
      },
      {
        text: "Мины",
        tooltip: "Убийств минами",
        value: "mines",
        sortable: false,
        align: "center",
      },
      {
        text: "УПр",
        tooltip: "Убийств прикладом",
        value: "meleeWeapon",
        sortable: false,
        align: "center",
      },
      {
        text: "УПк",
        tooltip: "Убийств в подкате",
        value: "slides",
        sortable: false,
        align: "center",
      },
      {
        text: "УГр",
        tooltip: "Убийств гранатами",
        value: "grenades",
        sortable: false,
        align: "center",
      },
    ],
  }),
};
</script>
