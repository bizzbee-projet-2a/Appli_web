// Initialisation des exports
var exports = module.exports = {}
// Import de pgsql
const pg = require('pg')
// Configuration pgsql
const Bizbee = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '',
  port: 5432
});

// Export de la connection (inutile pour le moment)
exports.connection = Bizbee;

exports.tryConnect = function (login, password) {
    // Je retourne une promesse pour gerer l'asynchronité
    return new Promise (( resolve, reject) => {
        // La requête est a passé en requête parametré
        var sql = "SELECT id, login, mdp FROM bizzbee._apiculteur WHERE login = '"+login+"' AND  mdp = '"+password+"'"
        // Execution de la requete
        Bizbee.query(sql, (err, res) => {
            if(err)
              return reject(err)
            resolve(JSON.parse(JSON.stringify(res)))
        });
    });
}

// Retourne les ruchers d'un apiculteur
exports.getRucherByProprio =  function (idApiculteur) {
  return new Promise(function(resolve, reject) {
    const sql = "SELECT * FROM bizzbee._permission WHERE id_apiculteur = " + idApiculteur;
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

exports.changePassword =  function (login, password) {
  return new Promise(function(resolve, reject) {
    const sql = "UPDATE bizzbee._apiculteur SET mdp ='"+ password +"' WHERE login = '" + login + "'";
    console.log(sql)
    Bizbee.query(sql, (err, res) => {
      if (err)
        console.log(err)
        return reject(err)
      console.log('success')
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}



// Retourne les informations d'un apiculteur
exports.getApiculteurInformations = function (login) {
    return new Promise(function(resolve, reject) {
      var sql = "SELECT * FROM bizzbee._apiculteur WHERE login ='" + login + "'";
      Bizbee.query(sql, (err, res) => {
        if (err)
          return reject(err)
        resolve(JSON.parse(JSON.stringify(res.rows)))
      })
    });
}

exports.apiculteur = async function(login) {
  var obj = {}
  obj.informations = await exports.getApiculteurInformations(login)
  obj.composant = await exports.getRucherByProprio(obj.informations[0].id)
  console.log(obj.composant)
  for(var i = 0;i< Object.keys(obj.composant).length ;i++) {
    // informations générales
    obj.composant[i].data = await exports.getComposant(obj.composant[i].id_composant)
    // Ajout humidité
    var all = await exports.getHumidite(obj.composant[i].id_composant)
    obj.composant[i].humidite = all[Object.keys(all).length - 1].val
    // Ajout _temperature
    all = await exports.getTemperature(obj.composant[i].id_composant)
    obj.composant[i].temperature = all[Object.keys(all).length - 1].val
    // Ajout poids
    all = await exports.getPoids(obj.composant[i].id_composant)
    obj.composant[i].poids = all[Object.keys(all).length - 1].val
  }
  return obj
}

// Retourne toutes les prises d'humidité d'une ruche
exports.getHumidite = function(idRucher) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM bizzbee._humidite WHERE id_ruche = " + idRucher;
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

// Retourne toutes les prises de poid d'une ruche
exports.getPoids = function(idRucher) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM bizzbee._poids WHERE id_ruche = " + idRucher;
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

// Retourne toutes les prises de températures d'une ruche
exports.getTemperature = function(idRucher) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM bizzbee._temperature WHERE id_ruche = " + idRucher;
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

exports.getComposant = function (id) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM bizzbee._composant WHERE id = " + id;
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

// Retourne toutes les prises de mesures d'une ruche
exports.getInfoRuche = async function(idRuche) {
  const rucheData = await exports.getComposant(idRuche)
  var obj = {}
  obj.id = idRuche;
  obj.name = rucheData[0].nom;
  obj.date = rucheData[0].date_creation;
  obj.humidite = await exports.getHumidite(idRuche)
  obj.temperature = await exports.getTemperature(idRuche)
  obj.poids = await exports.getPoids(idRuche)
  return obj
}
