<template>
  <v-container class="container">
    <router-view />
  </v-container>
</template>

<style>
.container {
  max-width: 60%;
}
@media screen and (max-width: 1080px) {
  .container {
    max-width: 100%;
  }
}
</style>
