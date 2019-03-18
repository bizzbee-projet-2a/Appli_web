<template>
  <li class="node-tree">
    <div v-if="node.isrucher > -1">
      <Rucher :data="node"></Rucher>
    </div>
    <div v-else>
      <Ruche :data="node"></Ruche>
    </div>
    <ul v-if="node.child && node.child.length">
      <node v-for="child in node.child" :node="child" v-bind:key="child.label"></node>
    </ul>
  </li>
</template>
<script>
import Rucher from './Rucher'
import Ruche from './Ruche'
export default {
  name: 'node',
  props: {
    node: Object
  },
  components: {
    Ruche: Ruche,
    Rucher: Rucher
  }
}
</script>

<style lang="css" scoped>
</style>
