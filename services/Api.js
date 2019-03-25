// Initialisation des exports
var exports = module.exports = {}
// Import de pgsql
const pg = require('pg')
const fs = require('fs')
var arrayToTree = require('array-to-tree');
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

exports.Racine =  function (idApiculteur) {
  return new Promise(function(resolve, reject) {
    const sql = "SELECT * bizzbe._composant where id_parent = -1";
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

exports.getComponents =  function (login) {
  return new Promise(function(resolve, reject) {
    const sql = `SELECT nom,id_composant from bizzbee._apiculteur
                  INNER JOIN bizzbee._permission
                  ON bizzbee._permission.id_apiculteur = bizzbee._apiculteur.id
                  INNER JOIN bizzbee._composant
                  ON bizzbee._composant.id = bizzbee._permission.id_composant
                  WHERE login = '${login}'`
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

exports.getAllUsers =  function () {
  return new Promise(function(resolve, reject) {
    const sql = `SELECT * FROM bizzbee._apiculteur`
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

exports.getComponentUnadded =  function (user) {
  return new Promise(function(resolve, reject) {
    const sql = `SELECT id,nom FROM bizzbee._composant
                WHERE ID NOT IN (
                SELECT bizzbee._permission.id_composant
                FROM bizzbee._apiculteur
                INNER JOIN bizzbee._permission
                ON bizzbee._permission.id_apiculteur = bizzbee._apiculteur.id
                where bizzbee._apiculteur.id = '${user}')`
      console.log(sql);
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

exports.getComponentAdded =  function (user) {
  return new Promise(function(resolve, reject) {
    const sql = `SELECT id_composant, nom
                 FROM bizzbee._permission
                 INNER JOIN bizzbee._composant
                 ON bizzbee._permission.id_composant = bizzbee._composant.id
                 WHERE id_apiculteur = ${user}`

    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

exports.addComponentToUser =  function (user, component) {
  return new Promise(function(resolve, reject) {
    const sql = `INSERT INTO bizzbee._permission VALUES (${user},${component})`
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

exports.removeComponentToUser =  function (user, component) {
  return new Promise(function(resolve, reject) {
    const sql = `DELETE FROM bizzbee._permission
                 WHERE id_apiculteur = ${user}
                 AND id_composant = ${component}`
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

exports.ajouterUtilisateur =  function (login, password) {
  return new Promise(function(resolve, reject) {
    const sql = `INSERT INTO bizzbee._apiculteur(login,mdp) VALUES('${login}','${password}')`
    console.log(sql);
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

exports.listeRucher =  function (idApiculteur) {
  return new Promise(function(resolve, reject) {

    const sql = `select id_composant as id_rucher, nom, date_creation
                  from bizzbee._permission
                  inner join bizzbee._rucher on bizzbee._rucher.id = bizzbee._permission.id_composant
                  inner join bizzbee._composant on bizzbee._permission.id_composant = bizzbee._composant.id
                  WHERE id_apiculteur = ${idApiculteur}`

    Bizbee.query(sql, img,  (err, res) => {
      if (err)
        return reject(err)
      var response = JSON.parse(JSON.stringify(res.rows))
      if (img == 1) {
        for (var i = 0; i < response.length; i++) {
          // Ajout de l'img (png base64 à chaque rucher)
          const path = `./data/img/${response[i].id_rucher}.png`
          if(fs.existsSync(path)) {
            response[i].img = new Buffer(fs.readFileSync(path)).toString('base64')
          } else {
            response[i].img = ''
          }
        }
      }
      return resolve(response)
    })
  });

}

exports.contenuRucher =  function (idRucher) {
  return new Promise(function(resolve, reject) {
    const sql = `SELECT  nom, id from bizzbee._permission
                inner join bizzbee._composant
                on bizzbee._composant.id = bizzbee._permission.id_composant
                where bizzbee._composant.id_parent = ${idRucher}`
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

exports.getUsers =  function () {
  return new Promise(function(resolve, reject) {
    const sql = `SELECT id,login FROM bizzbee._apiculteur WHERE id NOT IN (SELECT id from bizzbee._administrateur)`
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

exports.getAdmins =  function () {
  return new Promise(function(resolve, reject) {
    const sql = `SELECT  bizzbee._administrateur.id,login
                 FROM bizzbee._administrateur
                 INNER JOIN bizzbee._apiculteur
                 ON bizzbee._administrateur.id = bizzbee._apiculteur.id`
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

exports.ajouterAdministrateur =  function (id) {
  return new Promise(function(resolve, reject) {
    const sql = `INSERT INTO bizzbee._administrateur VALUES (${id})`
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}

exports.retirerAdministrateur =  function (id) {
  return new Promise(function(resolve, reject) {
    const sql = `DELETE FROM bizzbee._administrateur WHERE id = ${id}`
    Bizbee.query(sql, (err, res) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(JSON.stringify(res.rows)))
    })
  });
}





exports.test =  function (idApiculteur) {
  return new Promise(function(resolve, reject) {
    const sql = `with permission as (
              	SELECT id_composant as permission from bizzbee._permission where id_apiculteur = ${idApiculteur}
                )
                ,component as (
                	select * from permission inner join bizzbee._composant on permission.permission = bizzbee._composant.id
                )
                select component.id, nom, date_creation, COALESCE(id_parent, -1) as id_parent, COALESCE(bizzbee._rucher.id,-1) as isRucher from component left join bizzbee._rucher on bizzbee._rucher.id = component.id`
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
  var all = await exports.test(id)
  return arrayToTree(all, {
    parentProperty: 'id_parent',
    customID: 'id',
    childrenProperty: 'child'
  })
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
  obj.actual = {
    humidite:obj.humidite[Object.keys(obj.humidite).length - 1],
    temperature:obj.temperature[Object.keys(obj.temperature).length - 1],
    poids:obj.poids[Object.keys(obj.poids).length - 1]
  }
  const path = `./data/img/${obj.id}.png`
  if(fs.existsSync(path)) {
    obj.img = new Buffer(fs.readFileSync(path)).toString('base64')
  } else {
    obj.img = ''
  }
  return obj
}

exports.getRucheActualData = async function(idRuche) {
  const rucheData = await exports.getComposant(idRuche)
  var obj = {}
  obj.id = idRuche;
  obj.name = rucheData[0].nom;
  obj.date = rucheData[0].date_creation;
  obj.humidite = await exports.getHumidite(idRuche)
  obj.temperature = await exports.getTemperature(idRuche)
  obj.poids = await exports.getPoids(idRuche)
  obj.actual = {
    humidite:obj.humidite[Object.keys(obj.humidite).length - 1],
    temperature:obj.temperature[Object.keys(obj.temperature).length - 1],
    poids:obj.poids[Object.keys(obj.poids).length - 1]
  }
  const path = `./data/img/${obj.id}.png`
  if(fs.existsSync(path)) {
    obj.img = new Buffer(fs.readFileSync(path)).toString('base64')
  } else {
    obj.img = ''
  }

  delete obj.humidite
  delete obj.poids
  delete obj.temperature

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
