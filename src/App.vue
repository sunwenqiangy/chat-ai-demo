<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <OpenAIDemo/>
</template>

<script>
import OpenAIDemo from "./components/OpenAIDemo.vue";

export default {
  name: 'App',
  components: {
    OpenAIDemo
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
  /* background: #000;
  height: 100vh; */
}
</style>
