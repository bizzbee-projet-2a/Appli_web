<template lang="html">
  <div class="Ruche" v-if="isLoaded">
      <div class="card rucheContent">
            <img :src="'data:image/png;base64,' + actualData.img" alt="Image de la ruche" v-if="actualData.img != ''" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">{{data.nom}}</h5>
              <div class="card-text">
                <hr>
                Humidite: {{ actualData.actual.humidite.val }}
                <br>
                Temperature: {{ actualData.actual.temperature.val }}
                <br>
                Poids: {{ actualData.actual.poids.val }}
                <br>
                <router-link :to="{ name: 'Composant', params: { id: data.id, name: data.nom }}">Plus d'informations</router-link>
              </div>
            </div>
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
  border-radius: 4px;
  margin: 1em;
  width: 23rem;
}

</style>
