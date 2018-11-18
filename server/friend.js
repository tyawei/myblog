var express=require("express");
var router=express.Router();
var conn=require("./conn.js");
var timeStr=require("./time.js");

router.all("/:action", function(req, res) {
	let action=req.params.action;
	let name=req.body.name;
	let link=req.body.link;
	let content=req.body.content;

	let sql=action==="get"?
			`SELECT * FROM friends WHERE is_agree="1"`:
			`INSERT INTO friends VALUES(NULL, "${name}", "${link}", "${content}", "0")`;

	conn(sql, function(rows, fields) {
		res.send(rows);
	})
		
})

module.exports=router;