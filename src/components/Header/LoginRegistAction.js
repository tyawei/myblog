import $ from 'jquery';
import BASE_PATH from '../../config'

export const CHANGE_VALUE='change_value';
export const LOGIN_NOT_MATCH='login_not_match';
export const LOGIN_SUCCESS='login_success';
export const REGIST_USERNAME_EXIST='regist_username_exist';
export const REGIST_SUCCESS='regist_success';
export const GET_USER_COMMENT_LIST='get_user_comment_list';
export const NOT_READ='not_read';
export const LOGOUT='logout';

export function changeValue(field, newState) {
	return {
		type: CHANGE_VALUE,
		field: field,
		newState: newState
	}
}

export function loginRegist(suburl, username, password, repPwd) {
	return function(dispatch) {
		$.ajax({
			type: "POST",
			url: BASE_PATH + "/check/"+suburl, 
			timeout: 6666,
			data: {
				username: $.trim(username),
				password: $.trim(password),
				repPwd: $.trim(repPwd)
			},
			success: (data)=>{
				console.log(data)
				if (suburl==="loginsubmit") {
					if (!data) {
						dispatch({
							type: LOGIN_NOT_MATCH
						})
					} else {
						window.sessionStorage.setItem("userName", data.userName);
						window.sessionStorage.setItem("userType", data.userType);
						dispatch({
							type: LOGIN_SUCCESS,
							userName: window.sessionStorage.getItem("userName"),
							userType: window.sessionStorage.getItem("userName")
						})
					}
				} else if (suburl==="registsubmit") {
					if (!data) {
						dispatch({
							type: REGIST_USERNAME_EXIST
						})
					} else {
						window.sessionStorage.setItem("userName", data.userName);
						window.sessionStorage.setItem("userType", data.userType);
						dispatch({
							type: REGIST_SUCCESS,
							userName: window.sessionStorage.getItem("userName"),
							userType: window.sessionStorage.getItem("userName")
						})
					}
				}
			},
			error: (xhr)=>{
				alert("登录注册失败啦："+xhr.status)
			}
		});
	}
}

export function getUserCommentList(userName) {
	return function(dispatch) {
		$.ajax({ 
    		type: "GET", 
    		url: BASE_PATH + "/comment/usercommentlist/"+userName,
    		success: (data)=>{
    			dispatch({
    				type: GET_USER_COMMENT_LIST,
    				notReadMsg: data
    			})
    		},
    		error: (xhr)=>{
    			alert("获取用户评论信息失败："+xhr.status);
    		}
    	})
	}
}

export function notRead(commentId, userName) {
	return function(dispatch) {
		$.ajax({
	    	type: "POST",
	    	url: BASE_PATH + "/comment/notread",
	    	data: {
	    		commentId: commentId,
	    		userName: userName
	    	},
	    	success: (data)=>{
	    		dispatch({
	    			type: GET_USER_COMMENT_LIST,
	    			notReadMsg: data
	    		})
	    	},
	    	error: (xhr)=>{
	    		alert("标为已读失败："+xhr.status);
	    	}
	    })
	}
}

export function logout() {
	return {
		type: LOGOUT
	}
}