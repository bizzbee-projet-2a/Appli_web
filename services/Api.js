// Initialisation des exports
var exports = module.exports = {}
// Import de pgsql
const pg = require('pg')
// Configuration pgsql
const Bizbee = new pg.Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'postgres',
  password: 'root',
  port: 5432
});

// Export de la connection (inutile pour le moment)
exports.connection = Bizbee;

exports.tryConnect = function (login, password) {
    // Je retourne une promesse pour gerer l'asynchronité
    return new Promise (( resolve, reject) => {
        // La requête est a passé en requête parametré
        var sql = "SELECT id, login, mdp FROM bizzbee._apiculteur WHERE login = '"+login+"' AND  mdp = '"+password+"'"
        console.log(sql)
        // Execution de la requete
        Bizbee.query(sql, (err, res) => {
            if(err)
              return reject(err)
            resolve(JSON.parse(JSON.stringify(res)))
        });
    });
}
