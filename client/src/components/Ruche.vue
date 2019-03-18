<template lang="html">
  <div class="Ruche" v-if="isLoaded">
      <div class="rucheContent">
          {{data.nom}}
          Humidite: {{ actualData.actual.humidite.val }}
          <br>
          <router-link :to="{ name: 'Composant', params: { id: data.id, name: data.nom }}">Plus d'informations</router-link>
      </div>
  </div>
</template>
<script>
import Endpoint from '@/services/Endpoint'
export default {
  name: 'Ruche',
  data () {
    return {
      isLoaded: false,
      actualData: ''
    }
  },
  props: {
    data: Object
  },
  created: async function () {
    this.actualData = await Endpoint.rucheActualData(this.$props.data.id)
    this.actualData = this.actualData.data
    this.isLoaded = true
  }
}
</script>

<style lang="css" scoped>
.rucheContent {
  border :1px solid black;
  border-radius: 4px;
  margin-top: 1em;
  width: 10em;
}
</style>
