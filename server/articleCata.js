var express=require("express");
var router=express.Router();
var conn=require("./conn.js");

router.get('/catagories', function(req, res) {

	conn(`SELECT * FROM article ORDER BY article_id DESC`, function(rows, fields) {
		let articleList=rows;
		conn(`SELECT * FROM catagory`, function(rows, fields) {
			res.json({catagories:rows, articleList:articleList});
		})
	})

})

module.exports=router;
