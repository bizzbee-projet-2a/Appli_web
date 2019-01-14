// Initialisation des exports
var exports = module.exports = {}
// Import de mysql
var mysql = require('mysql');

// Connection à la base de données => gérer erreurs à faire
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bizbee'
});
connection.connect();

// Export de la connection (inutile pour le moment)
exports.connection = connection;

exports.tryConnect = function (login, password) {
    // Je retourne une promesse pour gerer l'asynchronité
    return new Promise (( resolve, reject) => {
        // La requête est a passé en requête parametré
        var sql = "SELECT * FROM USER WHERE NAME ='" + login + "' AND PASSWORD = '" + password + "'"
        // Execution de la requete
        connection.query( sql, (err, rows) => {
            if (err)
                // Si erreur je reject
                return reject(err)
            // Sinon j'envoie la réponse
            resolve(JSON.parse(JSON.stringify(rows)))
        });
    });
}
