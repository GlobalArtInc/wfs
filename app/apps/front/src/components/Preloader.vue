<template>
  <v-app>
    <v-progress-circular
        style="margin: 0 auto; margin-top: 3em"
        :size="70"
        :width="7"
        color="red"
        indeterminate
    />
  </v-app>
</template>

<script>

export default {
  name: 'preloader',
  data(){
    return {
      show: true
    }
  },
  mounted(){
    if(this.show) this.showToggle()
  },
  methods: {
    showToggle(){
      setTimeout(() => {
        this.show = false
      }, 700)
    }
  }
}
</script>