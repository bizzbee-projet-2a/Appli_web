<template>
  <div class="Index">
    <div class="container">
      <h1>Accueil</h1>
      <hr>
      Application web du projet <b>Bizzbee</b> <br> <b>Monitoring</b> de ruche
      <br>
      <br>
      <button type="button" name="button" class="btn btn-primary btn-sm" v-on:click="login()">Connexion</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Index',
  data () {
    return {
    }
  },
  created: function () {
  },
  methods: {
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
