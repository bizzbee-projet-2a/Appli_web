<template>
  <div class="Home">
    <div class="container">
      <div v-if="isLogged">

        <!-- Modal -->
        <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Modifier le mot de passe</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <form class="form" v-on:submit.prevent="changePassword()">
              <div class="modal-body">
                  <div class="form-group">
                    <label for="">Nouveau mot de passe:</label>
                    <input type="password" name="" value="" class="form-control" v-model="password">
                  </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
                <input type="submit" class="btn btn-primary" value="Modifier"/>
              </div>
              </form>
            </div>
          </div>
        </div>

        <h1>Bonjour {{ data.data.informations[0].login }}</h1>
        <small v-on:click="passwordModif">Modifier le mot de passe</small>
        <hr>
        <div v-for="composant in data.data.composant" v-bind:key="composant.id">
          <u>{{composant.data[0].nom}} :</u>
          <ul>
            <li>Temperature: {{ composant.temperature }} </li>
            <li>Humidité: {{ composant.humidite }} </li>
            <li>Poids: {{ composant.poids }} </li>
          </ul>
          <router-link :to="{ name: 'Composant', params: { id: composant.id_composant, name: composant.data[0].nom }}">Plus d'informations</router-link>
          <hr>
        </div>
        <button type="button" name="button" class="btn btn-danger btn-sm" v-on:click="disconnect()">Déconnexion</button>
      </div>
      <div v-else>
        Connectez vous d'abord
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import Endpoint from '@/services/Endpoint'
export default {
  name: 'Home',
  data () {
    return {
      data: 'Accueil bizzbee',
      isLogged: false,
      password: ''
    }
  },
  created: function () {
    this.getApiculteurInformations()
    if ((this.$session.get('login') !== undefined) && (this.$session.get('login') !== '')) {
      this.isLogged = true
    }
  },
  methods: {
    getApiculteurInformations: async function () {
      this.data = await Endpoint.apiculteurInformations(this.$session.get('login'))
    },
    disconnect: function () {
      this.isLogged = false
      this.$session.destroy()
      this.$router.push({name: 'Login'})
    },
    passwordModif: function () {
      $('#myModal').modal()
    },
    changePassword: function () {
      Endpoint.changePassword(this.data.data.informations[0].login, this.password)
      $('#myModal').modal('hide')
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
