<template>
  <div id="app">
    <nav-bar/>
    <router-view/>
  </div>
</template>
<script>
import NavBar from "./components/layout/NavBar";
export default {
    name: "App",
    components: {NavBar}
};
</script>
<style lang="scss">
@import "./styles/global.scss";
</style>
