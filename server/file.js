var express=require("express");
var path=require("path");
var router=express.Router();
var conn=require("./conn.js");

router.get("/get", function(req, res) {

	conn(`SELECT * FROM article ORDER BY article_id DESC`, function(rows, fields) {
		if (!rows.length) {
			res.send(""); return;
		}

		let arr=rows.map((item, index)=>{
			return item.join_time.substring(0, 8);
		});
		let timeArr=Array.from(new Set(arr));

		res.json({timeArr:timeArr, fileList:rows})

	})

})

module.exports=router;