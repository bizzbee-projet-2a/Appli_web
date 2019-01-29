import axios from 'axios'

export default {
  apiculteurInformations (login) {
    return axios.get('http://localhost:8081/apiculteurInfos', {params: {apiculteur: login}})
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
    console.log('Gonna post with id: ' + idRuche)
    return axios.post('http://localhost:8081/sendImage', {file: formData, idRuche: idRuche})
  }
}
