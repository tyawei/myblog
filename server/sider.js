var express=require("express");
var router=express.Router();
var conn=require("./conn.js");

router.get("/:list", function(req, res) {
	let list=req.params.list;
	let sql=list==="zanmaxlist"?
			`SELECT * FROM article ORDER BY good_times DESC LIMIT 5`:
			`SELECT * FROM article ORDER BY read_times DESC LIMIT 5`;

	conn(sql, function(rows, fields) {
		res.send(rows);
	})
})

module.exports=router;