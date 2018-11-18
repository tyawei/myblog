var express=require("express");
var path=require("path");
var router=express.Router();
var conn=require("./conn.js");
var timeStr=require("./time.js");

router.all("/:action/:id", function(req, res) {
	var action=req.params.action, id=req.params.id;
	if (action==="get" && typeof id!=="undefined") {
		conn(`UPDATE article SET read_times=read_times+1 WHERE article_id="${id}"`, function(rows, fields) {
			conn(`SELECT * FROM article WHERE article_id="${id}"`, function(rows, fields) {
				res.send(rows[0])
			})
		})			
	} else if (action==="eva") {
		let articleId=req.body.id;
		let flag=req.body.flag;
		let evaluate=flag==="good"? "good_times":"bad_times";

		conn(`UPDATE article SET ${evaluate}=${evaluate}+1 WHERE article_id="${articleId}"`, function(rows, fields) {
			conn(`SELECT * FROM article WHERE article_id="${articleId}"`, function(rows, fields) {
				res.send(rows[0]);
			})
		})
	} else if (action==="del") {
		let articleId=req.body.id;

		conn(`DELETE FROM article WHERE article_id="${articleId}"`, function() {
			res.send("yes");
		})
	} else if (action==="add" || action==="edit") {
		let title=req.body.title, 
			content=req.body.content, 
			catagory=req.body.catagory,
			articleId=req.body.id; 

		let sql=(articleId==0 && action==="add")?
				`INSERT INTO article VALUES(NULL, "${title}", "${content}", "${catagory}", 
				"0", "0", "0" ,"${timeStr(new Date())}", "${timeStr(new Date())}")`
				:
				`UPDATE article SET title="${title}", content="${content}", catagory="${catagory}"
				WHERE article_id="${articleId}"`;

		conn(sql, function(rows, fields) {
			let sqlsql=(articleId==0 && action==="add")?
						`SELECT * FROM article ORDER BY article_id DESC LIMIT 1`:
						`SELECT * FROM article WHERE article_id="${articleId}"`;
			conn(sqlsql, function(rows, fields) {
				res.send(rows[0]);
			})
		})
	}

})

module.exports=router;