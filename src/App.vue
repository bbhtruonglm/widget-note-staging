<template>
  <div id="app">
    <DashBoard/>
  </div>
</template>

<script>
import DashBoard from './components/DashBoard.vue'

export default {
  name: 'App',
  components: {
    DashBoard
  }
}
</script>

<style lang="scss">
#app {
  font-family: Arial;
}
</style>
