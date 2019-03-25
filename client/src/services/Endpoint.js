import axios from 'axios'

export default {
  apiculteurInformations (login) {
    return axios.get('http://localhost:8081/test', {params: {apiculteur: login}})
  },
  rucheData (id) {
    return axios.get('http://localhost:8081/rucheInfos', {params: {ruche: id}})
  },
  tryConnection (login, password) {
    return axios.post('http://localhost:8081/login', {login: login, password: password})
  },
  changePassword (login, newPassword) {
    return axios.post('http://localhost:8081/changePassword', {login: login, password: newPassword})
  },
  sendImage (formData, idRuche) {
    return axios.post('http://localhost:8081/sendImage', {file: formData, idRuche: idRuche})
  },
  rucheActualData (id) {
    return axios.get('http://localhost:8081/getRucheActualData', {params: {ruche: id}})
  },
  getUsers () {
    return axios.get('http://localhost:8081/getUsers')
  },
  getAdmins () {
    return axios.get('http://localhost:8081/getAdmins')
  },
  getComponents (login) {
    return axios.get('http://localhost:8081/getComponents', {params: {user: login}})
  },
  ajouterAdministrateur (user) {
    return axios.post('http://localhost:8081/ajouterAdministrateur', {id: user})
  },
  retirerAdministrateur (user) {
    return axios.post('http://localhost:8081/retirerAdministrateur', {id: user})
  },
  getAllUsers () {
    return axios.get('http://localhost:8081/getAllUsers')
  },
  getComponentUnadded (login) {
    return axios.get('http://localhost:8081/getComponentUnadded', {params: {user: login}})
  },
  getComponentAdded (login) {
    return axios.get('http://localhost:8081/getComponentAdded', {params: {user: login}})
  },
  addComponentToUser (user, component) {
    return axios.post('http://localhost:8081/addComponentToUser', {user: user, component: component})
  },
  removeComponentToUser (user, component) {
    return axios.post('http://localhost:8081/removeComponentToUser', {user: user, component: component})
  },
  ajouterUtilisateur (login, password) {
    return axios.post('http://localhost:8081/ajouterUtilisateur', {login: login, password: password})
  }
}
