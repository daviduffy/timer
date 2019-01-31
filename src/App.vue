<template>
  <div class="App" id="app">
    <div class="Nav" id="nav">
      <router-link to="/">Timer</router-link> |
      <router-link to="/history">History</router-link>
    </div>
    <router-view class="Main" />
    <Total />
  </div>
</template>

<script>
import Total from '@/components/Total';
export default {
  name: 'App',
  components: { Total },
  beforeMount: function() {
    this.$store.dispatch('startRetrieveEvents');
  }
};
</script>

<style lang="sass">
body
  font-family: Helvetica, Tahoma, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  font-size: 16px
  margin: 0
  color: #444

ul
  list-style: none
  margin: 0
  padding: 0
  
.App
  display: flex
  flex-direction: column
  text-align: center
  height: 100vh
  width: 100%
  display: flex

.Nav
  padding: 2rem
  a
    font-weight: bold
    color: #444
    &.router-link-exact-active
      color: #ff9900

.Main
  flex: 1

</style>
