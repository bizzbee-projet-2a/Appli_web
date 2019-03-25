<template>
  <li class="node-tree">
    <div v-if="node.isrucher > -1">
      <details>
        <summary>{{node.nom}}</summary>
        <ul v-if="node.child && node.child.length">
          <div class="innerContent">
              <node v-for="child in node.child" :node="child" v-bind:key="child.label"></node>
          </div>
        </ul>
        <ul v-if="node.isrucher > -1 && !node.child">
            Désolé, ce rucher n'a pas de ruches !
        </ul>

      </details>
    </div>
    <div v-else>
      <Ruche :data="node"></Ruche>
    </div>
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
ul {
  list-style: none;
}
li {
  list-style: none;
}

.innerContent{
  margin-left: 10px;
}

</style>
