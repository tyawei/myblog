var express=require("express");
var router=express.Router();
var conn=require("./conn.js");

router.get('/:page', function(req, res) {
	let page=parseInt( req.params.page );
	const num=(page-1)*10;

    conn(`SELECT * FROM article ORDER BY article_id DESC`, function(rows, fields) {
    	let currentList= page===1? 
    					(rows.length<=10? rows:rows.slice(0, page*10)):
    					(rows.length<=page*10? rows.slice(num):rows.slice(num, page*10));
      	res.json({total:rows.length, current:currentList});
    })
})

module.exports=router;

//page < rows/10   currentList=rows.slice(NUM, )
//page > rows/10   

//1: rows如果只有最多10个，那么就直接返回rows；
//		如果大于10个，rows.slice(0, page*10);
//2: rwos如果最多20个，rows.slice(NUM)
//		如果大于20个，rows.slice(NUM, page*10)