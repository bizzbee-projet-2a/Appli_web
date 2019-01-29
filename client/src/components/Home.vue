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
          <br>
          <img :src="'data:image/png;base64,' + composant.img" alt="Image de la ruche" v-if="composant.img != ''">
          <br>
          <label :for="composant.id_composant">
            <small>Changer l'image</small>
            <input type="file" :id="composant.id_composant" placeholder="Image" v-on:change="uploadImage" style="display:none;" :name="composant.id_composant">
          </label>
          <br>
          <br>
          <ul>
            <li>Temperature: {{ composant.temperature }} </li>
            <li>Humidité: {{ composant.humidite }} </li>
            <li>Poids: {{ composant.poids }} </li>
          </ul>
          <router-link :to="{ name: 'Composant', params: { id: composant.id_composant, name: composant.data[0].nom }}">Plus d'informations</router-link>
          <hr>
        </div>
        <button type="button" name="button" class="btn btn-danger btn-sm" v-on:click="disconnect()">Déconnexion</button>
        <br><br>
      </div>
      <div v-else>
        Connectez vous d'abord
        <br>
        <br>
        <button type="button" name="button" class="btn btn-primary btn-sm" v-on:click="login()">Connexion</button>
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
      password: '',
      file: ''
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
    },
    login: function () {
      this.$router.push({name: 'Login'})
    },
    uploadImage: async function (globalEvent) {
      const file = globalEvent.target.files[0]
      console.log('Changement: ' + parseInt(globalEvent.target.id))
      var reader = new FileReader()
      reader.onload = async function (event) {
        await Endpoint.sendImage(event.target.result.split(';base64,').pop(), parseInt(globalEvent.target.id))
        document.location.reload(true)
      }
     reader.readAsDataURL(file)
    },
    loadUpload: function (files) {
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.container {
  margin-top: 2em;
}

img {
  border-radius: 15px;
  width: 14em;
  margin: 1em 0;
}

</style>
