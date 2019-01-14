// Require tous les modules dont nous avons besoins
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const Api = require('./services/Api.js')

// Parametrage d'express pour permetre le CORS et utiliser le body des requêtes POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

// Endpoint pour essayer de se connecter
// Params : login , password
// Return 200 : OK
// Return 401 : Unauthorized
app.post('/login', (req, res) => {
  // Récuperation des parametres
  const login = req.body.login
  const password = req.body.password
  // J'execute la requête dans mon module Api
  Api.tryConnect(login, password).then(function(rows){
    // Si il y a un user, return 200
    if(rows[0]) {
      res.sendStatus(200)
    } else {
    // Sinon return 401
      res.sendStatus(401)
    }
  }).catch(function(error){
    // Si error : return 401
      res.sendStatus(401)
  })

})

// Lancement du script sur le port 8081
app.listen(8081, function () {
    console.log('ON')
})