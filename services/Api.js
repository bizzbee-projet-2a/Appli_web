// Initialisation des exports
var exports = module.exports = {}
// Import de pgsql
const pg = require('pg')
const fs = require('fs')
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
        console.log(sql);
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


exports.test =  function (idApiculteur) {
  return new Promise(function(resolve, reject) {
    const sql = "with a as (SELECT * from bizzbee._permission inner join bizzbee._composant on bizzbee._permission.id_composant = bizzbee._composant.id where id_apiculteur = 1)"
    + "select * from a left outer join bizzbee._rucher on bizzbee._rucher.id = a.id_composant"
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}


exports.allComposant =  function (id_apiculteur) {
  return new Promise(function(resolve, reject) {
    const sql = "select * from bizzbee._permission inner join bizzbee._composant on _composant.id = _permission.id_composant where id_apiculteur = " + id_apiculteur;
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
// Arbre des ruche / ruchers
// MERCI STACK OVER FLOW TOUJOURS LA POUR MOI QUAND JE SAIS PAS CODER
exports.getTree = async function (id) {
  var all = await exports.allComposant(1)
  console.log(all)
  var map = {};
    for(var i = 0; i < all.length; i++){
        var obj = all[i];
        obj.enfant= [];
        map[obj.id] = obj;
        var parent = obj.id_parent || '-';
        if(!map[parent]){
            map[parent] = {
                enfant: []
            };
        }
        map[parent].enfant.push(obj);
    }
    return map['-'].enfant;
}

exports.apiculteur = async function(login) {
  var obj = {}
  obj.informations = await exports.getApiculteurInformations(login)
  obj.composant = await exports.getRucherByProprio(obj.informations[0].id)
  console.log(obj.composant)
  for(var i = 0;i< Object.keys(obj.composant).length ;i++) {
    // informations générales
    var result = await exports.estRucher(obj.composant[i].id_composant);
    console.log(result)
    if (result  == 0) {
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
    // Ajout image en base64 png
    const path = './data/img/' + obj.composant[i].id_composant + '.png'
    if(fs.existsSync(path)) {
      obj.composant[i].img = new Buffer(fs.readFileSync(path)).toString('base64')
    } else {
      obj.composant[i].img = ''
    }

  }
  console.log('Finit');
  return obj
}

// Retourne toutes les prises d'humidité d'une ruche
exports.getHumidite = function(idRucher) {
  console.log('Humidité');
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM bizzbee._humidite WHERE id_ruche = " + idRucher;
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

exports.estRucher = function(id) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM bizzbee._rucher WHERE id = " + id;
    console.log(sql);
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      var result = true;
      console.log(res.rowCount);
      if (res.rowCount == 0) {
        result = false;
      }
      resolve(result);
    })
  });
}


// Retourne toutes les prises de poid d'une ruche
exports.getPoids = function(idRucher) {
  console.log('Poids');
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
  console.log('Temperature');
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
  console.log('Composant');
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

/**


CRUD


**/


exports.ajout_temperature = async function (ruche, mesure, date) {
  return new Promise(function(resolve, reject) {
    var sql = `INSERT INTO bizzbee._temperature (val, date_mesure, id_ruche) VALUES (${mesure},${date},${ruche})`;
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  })
}

exports.ajout_humidite = async function (ruche, mesure, date) {
  return new Promise(function(resolve, reject) {
    var sql = `INSERT INTO bizzbee._humidite (val, date_mesure, id_ruche) VALUES (${mesure},${date},${ruche})`;
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  })
}

exports.ajout_poids = async function (ruche, mesure, date) {
  return new Promise(function(resolve, reject) {
    var sql = `INSERT INTO bizzbee._poids (val, date_mesure, id_ruche) VALUES (${mesure},${date},${ruche})`;
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  })
}
