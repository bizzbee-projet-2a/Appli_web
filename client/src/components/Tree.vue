<template>
  <div class="Tree">
    <div v-for="element in treeData" v-bind:key="element.id">
      <ul class="tree-list">
        <node-tree :node="element"></node-tree>
      </ul>
    </div>
  </div>
</template>
<script>
import NodeTree from './NodeTree'
export default {
  props: {
    treeData: Array
  },
  components: {
    NodeTree
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .tree-list .element {
    padding-left: 16px;
    margin: 6px 0;
  }
</style>
