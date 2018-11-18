var express=require("express");
var router=express.Router();
var conn=require("../conn.js");

router.all('/catagories', function(req, res) {
	//req.body.value为undefined或者""可以区分get和post请求
	var id=req.body.id, value=req.body.value; 
	if ( typeof value==="undefined" ) {
		conn(`SELECT * FROM catagory`, function(rows, fields) {
	    	res.send(rows);
	    })
	} else if ( typeof value==="string" ) {
		let sql=id==0?
				`INSERT INTO catagory VALUES(NULL, "${value}")`:
				`UPDATE catagory SET catagory="${value}" WHERE id="${id}"`;
		conn(sql, function(rows, fields) {
	    	conn(`SELECT * FROM catagory`, function(rows, fields) {
	    		res.send(rows);
	    	})
	    })

	}
})

module.exports=router;