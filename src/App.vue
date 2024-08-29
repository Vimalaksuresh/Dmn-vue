<!-- src/App.vue -->
<template>
  <div id="app">
    <h1>DMN Webapp with Vue.js</h1>
    <DMNViewer />
  </div>
</template>

<script>
import DMNViewer from './components/DMNViewer.vue';

export default {
  name: 'App',
  components: {
    DMNViewer,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
