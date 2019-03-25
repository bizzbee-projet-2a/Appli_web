// Require tous les modules dont nous avons besoins
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const Api = require('./services/Api.js')
const fs = require('fs')
var passwordHash = require('password-hash')

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
  console.log(req.body);
  const login = req.body.login
  const password = req.body.password
  // J'execute la requête dans mon module Api
  Api.tryConnect(login, password).then(function(rows){
    // Si il y a un user, return 200
    if(rows.ok == true) {
      res.status(200).send(rows)
    } else {
    // Sinon return 401
      res.sendStatus(201)
    }
  }).catch(function(error){
    // Si error : return 401
    console.log(error);
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

app.post('/ajouterAdministrateur', (req, res) => {
  const user = req.body.id
  Api.ajouterAdministrateur(user).then(function(rows){
      res.sendStatus(200)
  }).catch(function(error){
      res.sendStatus(201)
  })
})


app.post('/addComponentToUser', (req, res) => {
  console.log('Try d ajout');
  const user = req.body.user
  const component = req.body.component
  Api.addComponentToUser(user, component).then(function(rows){
      res.sendStatus(200)
  }).catch(function(error){
      res.sendStatus(201)
  })
})

app.post('/removeComponentToUser', (req, res) => {
  const user = req.body.user
  const component = req.body.component
  Api.removeComponentToUser(user, component).then(function(rows){
      res.sendStatus(200)
  }).catch(function(error){
      res.sendStatus(201)
  })
})


app.post('/retirerAdministrateur', (req, res) => {
  const user = req.body.id
  Api.retirerAdministrateur(user).then(function(rows){
      res.sendStatus(200)
  }).catch(function(error){
      res.sendStatus(201)
  })
})

app.post('/ajouterUtilisateur', (req, res) => {
  const login    = req.body.login
  const password = passwordHash.generate(req.body.password);
  Api.ajouterUtilisateur(login, password).then(function(rows){
      res.sendStatus(200)
  }).catch(function(error){
      res.sendStatus(201)
  })
})


app.get('/test', (req, res) => {
  const apiculteur = req.query.apiculteur
  console.log(apiculteur)
  Api.getTree( apiculteur).then(function(rows){
    res.status(200).send(rows)
    console.log(rows)
  }).catch(function(err){
    res.send(err)
  })
})

app.get('/getComponents', (req, res) => {
  const apiculteur = req.query.user
  Api.getComponents( apiculteur).then(function(rows){
    res.status(200).send(rows)
    console.log(rows)
  }).catch(function(err){
    res.send(err)
  })
})


app.get('/getUsers', (req, res) => {
  Api.getUsers().then(function(rows){
    res.status(200).send(rows)
  }).catch(function(err){
    res.send(err)
  })
})

app.get('/getAdmins', (req, res) => {
  Api.getAdmins().then(function(rows){
    res.status(200).send(rows)
  }).catch(function(err){
    res.send(err)
  })
})

app.get('/getAllUsers', (req,res)=> {
  Api.getAllUsers().then(function(rows){
    res.status(200).send(rows)
  }).catch(function(err){
    res.send(err)
  })
})

app.get('/getComponentUnadded', (req,res)=> {
  var user = req.query.user
  Api.getComponentUnadded(user).then(function(rows){
    res.status(200).send(rows)
  }).catch(function(err){
    res.send(err)
  })
})


app.get('/getComponentAdded', (req,res)=> {
  var user = req.query.user
  Api.getComponentAdded(user).then(function(rows){
    res.status(200).send(rows)
  }).catch(function(err){
    res.send(err)
  })
})



app.post('/sendImage', (req, res) => {
  const image = req.body.file
  const id = req.body.idRuche
  fs.writeFile('./data/img/' + id +'.png', image, {encoding: 'base64'}, function(err) {
    if(err) res.send(201);
    res.send(200)
  })
})

// Endpoint pour recuperer toutes les données d'un apiculteur
app.get('/apiculteurInfos', (req, res) => {
  const apiculteur = req.query.apiculteur
  console.log(apiculteur)
  Api.apiculteur( apiculteur).then(function(rows){
    res.status(200).send(rows)
    console.log(rows)
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

app.get('/getRucheActualData', (req, res) => {
  const ruche = req.query.ruche
  Api.getRucheActualData( ruche).then(function(rows){
    res.status(200).send(rows)
  }).catch(function(err){
    res.send(err)
  })
})

app.get('/listeRucher', (req, res) => {
  const apiculteur = req.query.apiculteur
  const avecImage = req.query.img
  Api.listeRucher(apiculteur, avecImage).then(function(rows){
    res.status(200).send(rows)
  }).catch(function(err){
    res.status(201).send(err)
  })
})

app.get('/informationsAPI', (req, res) => {
    res.status(200).send('API bizzbee version 1.0')
})

app.get('/contenuRucher', (req, res) => {
  const rucher = req.query.rucher
  Api.contenuRucher(rucher).then(function(rows){
    res.status(200).send(rows)
  }).catch(function(err){
    res.status(201).send(err)
  })
})






app.get('/estRucher', (req, res) => {
  const ruche = req.query.ruche
  console.log(ruche);
  Api.estRucher( ruche).then(function(rows){
    res.send(rows)
  }).catch(function(err){
    console.log(err);
    res.send(err)
  })
})

// Arbre ruche /rucher
app.get('/getTree', (req, res) => {
  const apiculteur = req.query.apiculteur
  Api.getTree(apiculteur).then( function (rows)  {
    res.status(200).send(rows)
  }).catch( function (err){
    res.send(err)
  })
})

app.get('/racine', (req, res) => {
  Api.Racine().then( function (rows)  {
    res.status(200).send(rows)
  }).catch( function (err){
    res.send(err)
  })
})

/**

C R U D


**/

app.post('/ajout_humidite', (req, res) => {
  const ruche = req.body.idRuche
  const mesure = req.body.mesure
  const date = req.body.date
  Api.ajout_humidite(ruche, mesure, date).then( function (rows)  {
    res.status(200).send(rows)
  }).catch( function (err){
    res.send(err)
  })
})

app.post('/ajout_temperature', (req, res) => {
  const ruche = req.body.idRuche
  const mesure = req.body.mesure
  const date = req.body.date
  Api.ajout_temperature(ruche, mesure, date).then( function (rows)  {
    res.status(200).send(rows)
  }).catch( function (err){
    res.send(err)
  })
})

app.post('/ajout_poids', (req, res) => {
  const ruche = req.body.idRuche
  const mesure = req.body.mesure
  const date = req.body.date
  Api.ajout_poids(ruche, mesure, date).then( function (rows)  {
    res.status(200).send(rows)
  }).catch( function (err){
    res.send(err)
  })
})






// Lancement du script sur le port 8081
app.listen(8081, function () {
    console.log('ON')
})
