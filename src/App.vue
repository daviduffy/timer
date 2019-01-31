<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Timer</router-link> |
      <router-link to="/history">History</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="sass">
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #444
  max-width: 600px
  margin: 0 auto

#nav
  padding: 30px
  a
    font-weight: bold
    color: #444
    &.router-link-exact-active
      color: #ff9900

</style>
