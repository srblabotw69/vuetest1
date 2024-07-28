<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HelloWorld from './components/HelloWorld.vue'
import Home from "./eas/Home"
import { Root } from "./Root"
import Connections from "./Connections"
import Schema from "./eas/Schema"

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
