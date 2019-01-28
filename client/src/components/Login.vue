<template>
  <div class="Home">
    <div class="container">
        <h1>Connexion</h1>
        <hr>
        <div class="alert alert-danger" role="alert" v-if="err !== ''">
          {{ err }}
        </div>
        <form class="form" v-on:submit.prevent="tryConnection()">
          <div class="form-group">
            <label for="">Utilisateur</label>
            <input type="text" name="" value="" class="form-control" placeholder="Utilisateur" v-model="login">
          </div>
          <div class="form-group">
            <label for="">Mot de passe</label>
            <input type="password" name="" value="" class="form-control" placeholder="Mot de passe" v-model="password">
          </div>
          <input type="submit" name="" value="Connexion" class="btn btn-primary">
        </form>
    </div>
  </div>
</template>
<script>
import Endpoint from '@/services/Endpoint'
export default {
  name: 'Home',
  data () {
    return {
      data: 'Accueil bizzbee',
      login: '',
      password: '',
      err: ''
    }
  },
  created: function () {
    this.getApiculteurInformations()
  },
  methods: {
    getApiculteurInformations: async function () {
      this.data = await Endpoint.apiculteurInformations('thomas')
    },
    tryConnection: async function () {
      const isOk = await Endpoint.tryConnection(this.login, this.password)
      if (isOk.status === 200) {
        this.err = ''
        this.$session.set('login', this.login)
        this.$router.push({name: 'Home'})
      } else {
        this.err = 'Connexion refusée'
      }
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.container {
  margin-top: 2em;
}

form, .alert {
  width: 60%;
}

</style>
