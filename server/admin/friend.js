var express=require("express");
var router=express.Router();
var conn=require("../conn.js");

router.all('/friend/:deal', function(req, res) {
	var deal=req.params.deal;

	if (typeof id==="undefined" && deal==="get") {
		conn(`SELECT * FROM friends WHERE is_agree="0"`, function(rows, fields) {
    		res.send(rows);
    	})
	} else {
		let id=req.body.id;
		let sql=deal==="agree"?
				`UPDATE friends SET is_agree="1" WHERE id="${id}"`:
				`DELETE FROM friends WHERE id="${id}"`;	
		conn(sql, function(rows, fields) {
	    	conn(`SELECT * FROM friends WHERE is_agree="0"`, function(rows, fields) {
	    		res.send(rows);
	    	})
	    })
	}

})

module.exports=router;