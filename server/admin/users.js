var express=require("express");
var router=express.Router();
var conn=require("../conn.js");

router.get('/users/:current', function(req, res) {
	let current=parseInt( req.params.current );
	const num=(current-1)*10;

    conn(`SELECT * FROM user ORDER BY user_id ASC`, function(rows, fields) {
    	let currentList= current===1? 
    					(rows.length<=10? rows:rows.slice(0, current*10)):
    					(rows.length<=current*10? rows.slice(num):rows.slice(num, current*10))
      	res.json({total:rows.length, current:currentList});
    })
	
})

module.exports=router;