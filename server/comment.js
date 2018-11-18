var express=require("express");
var router=express.Router();
var conn=require("./conn.js");
var timeStr=require("./time.js");

router.post("/notread", function(req, res) {
	let commentId=req.body.commentId;
	let userName=req.body.userName; 

    let sql=`UPDATE comment SET is_read="1" WHERE comment_id="${commentId}"`;
    conn(sql, function(rows, fields) {
      	let sql1=userName==="admin"? 
	      	`SELECT * FROM comment WHERE is_read="0"` : //or之前是别人对管理员评论的回复，or之后是别人对文章的评论
	      	`SELECT * FROM comment WHERE commenter="${userName}" AND is_read="0" AND replyer!=""`; //别人对普通用户本人评论的回复
	      //commenter设置登陆者（管理员或者普通用户）,就是获取别人对本人发表过的评论的回复

	  	conn(sql1, function(rows, fields) {   //以上判断部分有点问题，replyer条件没有起效？所以前台渲染判断relyer为空则是对admin提醒，非空对普通用户提醒
	    	res.send(rows);
	  	})

    })
})

router.get("/usercommentlist/:user", function(req, res) {
	let data=req.session.userInfo; 
	if (!data.userName) {
		res.sendFile(path.join(__dirname, "../", "noRight.html"));
	}

	let user=req.params.user;

    let sql=user==="admin"? 
      	`SELECT * FROM comment WHERE is_read="0"` : //or之前是别人对管理员评论的回复，or之后是别人对文章的评论
      	`SELECT * FROM comment WHERE commenter="${user}" AND is_read="0" AND replyer!=""`; //别人对普通用户本人评论的回复
      //commenter设置登陆者（管理员或者普通用户）,就是获取别人对本人发表过的评论的回复

  	conn(sql, function(rows, fields) {   //以上判断部分有点问题，replyer条件没有起效？所以前台渲染判断relyer为空则是对admin提醒，非空对普通用户提醒
    	console.log(rows.length);
    	res.send(rows);
  	})
})

router.all("/:action/:id", function(req, res) {
	var action=req.params.action, id=req.params.id;

	if (action==="getcomments") {
	    let sql=`SELECT * FROM comment WHERE article_id="${id}" AND replyer="" ORDER BY group_num DESC`;

	    conn(sql, function(rows, fields) {
	      	res.send(rows);
	    })
	} else if (action==="getreplys") {
	    let sql=`SELECT * FROM comment WHERE article_id="${id}" AND replyer!="" ORDER BY comment_id ASC`;

	    conn(sql, function(rows, fields) {
	      	res.send(rows);
	    })
	} else if (action==="delcomment") {
		let articleId=req.body.articleId;
	    let commentGroupNum=req.body.commentGroupNum;
	    let commentNodeNum=req.body.commentNodeNum;
	    let replyTime=req.body.replyTime;
	    let field=req.body.field;

	    if (field==="comment") {
	      	let sql=`DELETE FROM comment WHERE article_id="${articleId}" AND group_num="${commentGroupNum}"`;
	      	if (commentGroupNum==1 && commentNodeNum==1) { //删除有且仅有一条的评论
	        	conn(sql, function(rows, fields) {
	          		var sql=`SELECT * FROM comment WHERE article_id="${articleId}" AND replyer="" ORDER BY group_num DESC`;
	          		conn(sql, function(rows, fields) {
	            		res.send(rows); 
	          		})
	        	})
	      	} else if (commentNodeNum>1) { //删除多条评论的第一条或者其他条目，包括commentGroupNum最大的一条没问题
	        	conn(sql, function(rows, fields) {
	          		var sql=`UPDATE comment SET group_num=group_num-1 WHERE article_id="${articleId}" AND group_num>"${commentGroupNum}"`;
	          		conn(sql, function(rows, fields) {
	            		var sql=`SELECT * FROM comment WHERE article_id="${articleId}" AND replyer="" ORDER BY group_num DESC`;
	            		conn(sql, function(rows, fields) {
	              			res.send(rows); 
	            		})
	          		})
	        	})
	      	}
	    } else if (field==="reply") {
	      	let sql= `DELETE FROM comment WHERE article_id="${articleId}" AND join_time="${replyTime}"`;
	      	//如果同一个评论组有多个人时间上1秒内同时回复，就会删除多条回复，不过概率很小
	      	conn(sql, function(rows, fields) {
	        	var sql=`SELECT * FROM comment WHERE article_id="${articleId}" AND replyer!="" ORDER BY comment_id ASC`;
	        	conn(sql, function(rows, fields) {
	          		res.send(rows);
	        	})
	      	})

	    }
	} else if (action==="comments") {	//提交评论
		let articleId=req.body.articleId;
		let articleTitle=req.body.articleTitle;
	    let commenter=req.body.commenter;
	    let re=req.body.replyer, replyer; //前台传一个标识符判断、处理replyer
	    	replyer=re? re:"";
	    let content=req.body.content;
	    let commentGroupNum=req.body.commentGroupNum;
	    let isRead=req.body.isRead;

	    //下面需要做的是，回复某条评论时获取该条评论的group_num.
	    if (!replyer && commentGroupNum==0) { //评论
	      	let sql=`SELECT * FROM comment WHERE article_id="${articleId}" AND replyer="" 
	      			ORDER BY group_num DESC LIMIT 1`;
	      	conn(sql, function(rows, fields) {//首条评论之前没有group_num值
	        	var mGroupNum=rows[0]? rows[0].group_num+1:1;
	        	var sql=`INSERT INTO comment VALUES(NULL,"${articleId}", "${articleTitle}", "${mGroupNum}","${commenter}",
	        			"${replyer}","${content}","${isRead}","${timeStr(new Date())}")`;
	        
	        	conn(sql, function(rows, fields) {
	          		var sql=`SELECT * FROM comment WHERE article_id="${articleId}" AND replyer="" ORDER BY group_num DESC`;
	          		conn(sql, function(rows, fields) {
	            		res.send(rows);
	          		})
	        	})
	      	})
	    } else if (replyer && commentGroupNum>0) { //回复
	      	let sql=`INSERT INTO comment VALUES(NULL,"${articleId}","${commentGroupNum}","${replyer}","${commenter}","${content}","${isRead}","${timeStr(new Date())}")`;
	      	conn(sql, function(rows, fields) {
	        	var sql=`SELECT * FROM comment WHERE article_id="${articleId}" AND replyer!="" ORDER BY comment_id ASC`;
	        	conn(sql, function(rows, fields) {
	          		res.send(rows);
	        	})
	      	})
	    }
	}

})

module.exports=router;