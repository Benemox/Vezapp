
const HOST_SQL = process.env.HOST_SQL;
const USER_SQL = process.env.USER_SQL;
const PASSWORD_SQL = process.env.PASSWORD_SQL;
const DATABASE_SQL = process.env.DATABASE_SQL;
const sql = require("mysql");



//////////////////////Connect SQL database/////////////////////////////////////-

let connection = sql.createConnection({

	"host"     : HOST_SQL,
	"user"     : USER_SQL,
	"password" : PASSWORD_SQL,
	"database" : DATABASE_SQL
});


///////////////////////FUNCTIONS ///////////////////////////////////////////////-



//////////////////QUERY/////////////////////////////////////////////-

function SQLquery(string, options = {}) {
	return new Promise((resolve, reject) => {
		connection.query(string, options, (err, response) => {
			if (err) {
				reject(err);
			} else {
				resolve(response);
			}
		});
	});
}


module.exports = SQLquery

