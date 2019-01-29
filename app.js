// Require tous les modules dont nous avons besoins
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const Api = require('./services/Api.js')
const fs = require('fs')

// Parametrage d'express pour permetre le CORS et utiliser le body des requêtes POST
app.use(bodyParser.json({limit: '2000kb'}));
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
    console.log("ERREUR ?");
    console.log(rows)
    if(rows.rowCount === 1) {
      res.sendStatus(200)
    } else {
    // Sinon return 401
      res.sendStatus(201)
    }
  }).catch(function(error){
    // Si error : return 401
      res.sendStatus(201)
  })

})

// Endpoint pour changer un mot de passe
app.post('/changePassword', (req, res) => {
  const login = req.body.login
  const password = req.body.password
  Api.changePassword(login, password).then(function(rows){
      res.sendStatus(200)
  }).catch(function(error){
      res.sendStatus(201)
  })
})

app.post('/sendImage', (req, res) => {
  const image = req.body.file
  const id = req.body.idRuche
  console.log('Gonna change dude id: ' + id);
  fs.writeFile('./data/img/' + id +'.png', image, {encoding: 'base64'}, function(err) {
    if(err) console.log(err);
    console.log('success');
  })
})

// Endpoint pour recuperer toutes les données d'un apiculteur
app.get('/apiculteurInfos', (req, res) => {
  const apiculteur = req.query.apiculteur
  Api.apiculteur( apiculteur).then(function(rows){
    res.status(200).send(rows)
  }).catch(function(err){
    res.send(err)
  })
})

// Endpoint pour recuperer toutes les données d'une ruche
app.get('/rucheInfos', (req, res) => {
  const ruche = req.query.ruche
  Api.getInfoRuche( ruche).then(function(rows){
    res.status(200).send(rows)
  }).catch(function(err){
    res.send(err)
  })
})


// Lancement du script sur le port 8081
app.listen(8081, function () {
    console.log('ON')
})
