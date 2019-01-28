<template>
  <div class="Composant">
    <div class="container" v-if="isLogged">
      Ruche: {{ name }}
     <hr>
     <highcharts class="chart" :options="chartOptions"  style="width:60%;margin:0 auto;"></highcharts>
    </div>
    <div v-else class="container">
      Connectez vous d'abord
      <br>
      <br>
      <button type="button" name="button" class="btn btn-primary btn-sm" v-on:click="login()">Connexion</button>
    </div>
  </div>
</template>
<script>
import Endpoint from '@/services/Endpoint'
export default {
  name: 'Composant',
  data () {
    return {
      isLogged: false,
      id: this.$session.get('composantVueId'),
      name: this.$session.get('composantVueNom'),
      humidite: {},
      temperature: {},
      poids: {},
      chartOptions: {
        credits: {
          enabled: false
        },
        title: {
          text: 'Mesures'
        },
        yAxis: {
          title: {
            text: 'Valeur'
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAligne: 'middle'
          }
        },
        xAxis: {
          type: 'datetime'
        },
        series: [{
          name: 'Humidité',
          data: []
        }, {
          name: 'Temperature',
          color: '#FF0000',
          data: []
        }, {
          name: 'Poids',
          color: '#00FF7F',
          data: []
        }]
      }
    }
  },
  beforeCreate: function () {
    if (this.$route.params.id !== undefined) {
      this.$session.set('composantVueId', this.$route.params.id)
      this.$session.set('composantVueNom', this.$route.params.name)
    }
  },
  created: function () {
    this.getData()
    if ((this.$session.get('login') !== undefined) && (this.$session.get('login') !== '')) {
      this.isLogged = true
    }
  },
  methods: {
    getData: async function () {
      // Humidite
      var data = await Endpoint.rucheData(this.id)
      this.humidite = data.data.humidite
      var tmp = this.humidite.map(function (obj) {
        let newObj = [obj.date_mesure, parseInt(obj.val)]
        return newObj
      })
      this.chartOptions.series[0].data = tmp
      // temperature
      data = await Endpoint.rucheData(this.id)
      this.temperature = data.data.temperature
      tmp = this.temperature.map(function (obj) {
        let newObj = [obj.date_mesure, parseInt(obj.val)]
        return newObj
      })
      this.chartOptions.series[1].data = tmp
      // Poids
      this.poids = data.data.poids
      tmp = this.poids.map(function (obj) {
        let newObj = [obj.date_mesure, parseInt(obj.val)]
        return newObj
      })
      this.chartOptions.series[2].data = tmp
    },
    login: function () {
      this.$router.push({name: 'Login'})
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    margin-top: 2em;
  }
</style>
