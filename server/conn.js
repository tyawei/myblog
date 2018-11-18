function conn(sql, deal) {
	var mysql=require('mysql');
	var pool=mysql.createPool({
		// connectionLimit: 100,
		// host: "47.75.44.225",
		// port: 3306,
		// user: "root", 
		// password: "7t8y9w4/",
		// database: "myblog"
		connectionLimit: 100,
		host: "localhost",
		port: 3306,
		user: "root", 
		password: "20402991GnAt",
		database: "myblog"
	});
	pool.getConnection(function(err, connection) {
		if (err) throw err;
		connection.query(sql, function(err, rows, keys) {
			connection.release();
			if (err) throw err;
			deal(rows, keys);
		})
	})
	// pool.query(sql, function(err, rows, keys) {
	// 	if (err) throw err;
	// 	deal(rows, keys);

	// })
}
module.exports=conn;