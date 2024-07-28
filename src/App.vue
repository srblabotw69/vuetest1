<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HelloWorld from './components/HelloWorld.vue'
import Home from "./eas/Home.tsx"
import { Root } from "./Root.tsx"
import Connections from "./Connections.tsx"
import Schema from "./eas/Schema.tsx"


const router = createBrowserRouter([
  {
    path: "/happyattest/",
    element: <Root />,
    children: [
      {
        path: "/happyattest/",
        element: <Home />,
      },
      {
        path: "/happyattest/schema",
        element: <Schema />,
      }, 
      {
        path: "/happyattest/connections",
        element: <Connections />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default {
  name: 'App',
  components: {
    HelloWorld,
    App
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
