var express=require("express");
var router=express.Router();
var conn=require("./conn.js");
var timeStr=require("./time.js");

router.post("/:suburl", function(req, res) {
	let suburl=req.params.suburl;
	let {username, password, repPwd}=req.body;

//登录
//注册
//用户直接get，如果cookie尚未过期就传页面，如果已经过期就向前台提醒
//用户直接get，验证该请求携带的cookie是否是该请求规定的用户类型，否则转入非法页面

	if (suburl==="loginsubmit" && !repPwd) {
		let sql=`SELECT * FROM user WHERE username="${username}" AND password="${password}"`;

	    conn(sql, function(rows, fields) {
	      	if (!rows.length) {
	        	res.send(""); //密码与用户名不一致
	      	} else {
	      		conn(`UPDATE user SET new_time="${timeStr(new Date())}" WHERE user_id="${rows[0].user_id}"`, function(rows, fields) {return})
	        	let data={
	        		userName: rows[0].username,
	        		userType: rows[0].username==="admin"? "admin":"user"
	        	}
	        	req.session.userInfo=data;
	        	res.json(data); //登录验证成功之后就将user的id值传给前台作为cookie保存，以及渲染用户信息页面
	      	}
	    })

	} else if (suburl==="registsubmit" && repPwd) {
		conn(`SELECT * FROM user WHERE username="${username}"`, function(rows, fields) {
			if (rows.length) { res.send("");return; };

			let sql=`INSERT INTO user VALUES(NULL,"${username}","${password}","${timeStr(new Date())}","${timeStr(new Date())}")`;
		    let data={
		    	userName: username,
	    		userType: "user"
		    }
		    conn(sql, function(rows, fields) {
		    	req.session.userInfo=data;
		    	res.json(data);
		    })

		})

	}

})

module.exports=router;
//cookie在前台和后台的操作
//前台地址栏get请求的权限问题和非法页面（这个可能还有问题）
//404页面（也在生产模式吗）
//配置生产开模式的webpack和后台

//用户验证
// router.get("/userInfo",function (req,res) {
//     if(req.session.userInfo){
//         responseClient(res,200,0,",req.session.userInfo)
//     }else{
//         responseClient(res,200,1,"请重新登录",req.session.userInfo)
//     }
// });

// router.get("/logout",function (req,res) {
//     req.session.destroy();
//     res.redirect("/");
// });