<template>
  <div class="Home">
    <div class="container" v-if="isLoaded">
        <h1>Espace administrateur de {{user}}</h1>
        <hr>
        <h3>Ajouter un administrateur</h3>

        <div class="form-inline">
          Selectionner un nouveau administrateur:
          &nbsp;
          <select v-model="userSelected" class="form-control" id="addAdmin" required>
            <option value="" >Selectionner un utilisateur</option>
            <option v-for="user in users.data" v-bind:key="user.id" v-bind:value="user.id">
                {{ user.login }}
            </option>
          </select>
          &nbsp;
          <button type="button" name="button" class="btn btn-primary btn-sm" v-on:click="ajouterAdministrateur">Ajouter cette administrateur</button>
        </div>
        <hr>
        <h3>Retirer un administrateur</h3>
        <div class="form-inline">
          Selectionner un administrateur à retirer:
          &nbsp;
          <select v-model="adminSelected" class="form-control" id="removeAdmin" required>
            <option value="" selected>Selectionner un administrateur</option>
            <option v-for="admin in admins.data" v-bind:key="admin.id" v-bind:value="admin.id">
                {{ admin.login }}
            </option>
          </select>
          &nbsp;
          <button type="button" name="button" class="btn btn-primary btn-sm" v-on:click="retirerAdministrateur">Retirer cette administrateur</button>
        </div>
        <hr>
        <h3>Ajouter un composant à un utilisateur</h3>
        Lancer la fenetre d'ajout: &nbsp;
        <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modalAdd">
          Ajouter un composant
        </button>
        <hr>
        <h3>Retirer un composant à un utilisateur</h3>
        Lancer la fenetre de suppresion: &nbsp;
        <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modalRemove">
          Supprimer un composant
        </button>
        <hr>
        <h3>Ajouter un apiculteur</h3>
        <small>L'apiculteur pourra changer son mot de passe à tout moment depuis son espace personnel</small>
        <small>Le mot de passe et le nom doivent être supérieur à 6 caractères</small>
        <br>
        <div class="form-inline">
          <label for="">Nom de l'apiculteur:</label>
          &nbsp;&nbsp;
          <input type="text" name="" value="" class="form-control form-control-sm" v-model="ajoutUtilisateurNom">
          &nbsp;&nbsp;
          <label for="">Mot de passe:</label>
          &nbsp;&nbsp;
          <input type="password" name="" value="" class="form-control form-control-sm" v-model="ajoutUtilisateurPassword">
          &nbsp;&nbsp;
          <button type="button" name="button" class="btn btn-primary btn-sm" v-on:click="addUser" v-if="ajoutUtilisateurNom.length > 6 && ajoutUtilisateurPassword.length > 6">Ajouter cette utilisateur</button>
        </div>
        <br>
        <div class="modal" id="modalAdd">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Ajout un composant</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
                <div class="form-inline">
                  <div class="form-inline">
                    Selectionner un utilisateur
                    &nbsp;
                    <select v-model="addComponentUser" class="form-control" v-on:change="addComponentChange"  required>
                      <option value="" selected>Selectionner un utilisateur</option>
                      <option v-for="user in allUsers.data" v-bind:key="user.id" v-bind:value="user.id">
                          {{ user.login }}
                      </option>
                    </select>
                  </div>
                </div>
                <br>
                <div class="form-inline" v-if="addComponentUser">
                  <div class="form-inline">
                    Selectionner un composant
                    &nbsp;
                    <select v-model="addComponentComponent" class="form-control"  required>
                      <option value="" selected>Selectionner un composant</option>
                      <option v-for="component in modalAddComponent.data" v-bind:key="component.id" v-bind:value="component.id">
                          {{ component.nom }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal" v-if="addComponentComponent" v-on:click="addComponentToUser">Ajouter</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal">Fermer</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal" id="modalRemove">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Supprimer un composant</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
                <div class="form-inline">
                  <div class="form-inline">
                    Selectionner un utilisateur
                    &nbsp;
                    <select v-model="removeComponentUser" class="form-control" v-on:change="removeComponentChange"  required>
                      <option value="" selected>Selectionner un utilisateur</option>
                      <option v-for="user in allUsers.data" v-bind:key="user.id" v-bind:value="user.id">
                          {{ user.login }}
                      </option>
                    </select>
                  </div>
                </div>
                <br>
                <div class="form-inline" v-if="removeComponentUser">
                  <div class="form-inline">
                    Selectionner un composant
                    &nbsp;
                    <select v-model="removeComponentComponent" class="form-control"  required>
                      <option value="" selected>Selectionner un composant</option>
                      <option v-for="component in modalRemoveComponent.data" v-bind:key="component.id_composant" v-bind:value="component.id_composant">
                          {{ component.nom }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal" v-if="removeComponentComponent" v-on:click="removeComponentToUser">Supprimer</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal">Fermer</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script
  src="http://code.jquery.com/jquery-3.3.1.js"
  integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60="
  crossorigin="anonymous"></script>
<script>
import Endpoint from '@/services/Endpoint'
export default {
  name: 'Home',
  data () {
    return {
      user: this.$session.get('login'),
      isLoaded: '',
      users: [],
      admins: [],
      userSelected: '',
      adminSelected: '',
      addComponentUser: '',
      addComponentComponent: '',
      removeComponentUser: '',
      ajoutUtilisateurPassword: '',
      ajoutUtilisateurNom: '',
      removeComponentComponent: 'ata',
      allUsers: '',
      modalAddComponent: '',
      modalRemoveComponent: '',
      userComponents: []
    }
  },
  created: async function () {
    this.users = await Endpoint.getUsers()
    this.admins = await Endpoint.getAdmins()
    this.userComponents = await Endpoint.getComponents(this.user)
    this.allUsers = await Endpoint.getAllUsers()
    this.isLoaded = true
  },
  methods: {
    ajouterAdministrateur: function () {
      Endpoint.ajouterAdministrateur(this.userSelected)
    },
    retirerAdministrateur: function () {
      Endpoint.retirerAdministrateur(this.adminSelected)
    },
    addComponentChange: async function () {
      if (this.addComponentUser.length != 0) {
        this.modalAddComponent = await Endpoint.getComponentUnadded(this.addComponentUser)
      }
    },
    addComponentToUser: async function () {
      Endpoint.addComponentToUser(this.addComponentUser, this.addComponentComponent)
      window.location.reload()
    },
    removeComponentChange: async function () {
      if (this.removeComponentUser.length != 0) {
        this.modalRemoveComponent = await Endpoint.getComponentAdded(this.removeComponentUser)
      }
    },
    removeComponentToUser: async function () {
      Endpoint.removeComponentToUser(this.removeComponentUser, this.removeComponentComponent)
      window.location.reload()
    },
    addUser: async function () {
      if (this.ajoutUtilisateurNom.length > 6 && this.ajoutUtilisateurPassword.length > 6) {
        Endpoint.ajouterUtilisateur(this.ajoutUtilisateurNom, this.ajoutUtilisateurPassword)
        window.location.reload()
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

img {
  border-radius: 15px;
  width: 14em;
  margin: 1em 0;
}

</style>
