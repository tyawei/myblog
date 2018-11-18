import $ from 'jquery';
import BASE_PATH from '../../config/'

export const CHANGE_TEXT='change_text';
export const RETURN_TO_COMMENT='return_to_comment';
export const GET_COMMENTS='get_comments';
export const GET_REPLYS='get_replys';
export const REPLY_INIT='reply_init';
export const COMMENT_MSG='comment_msg';

export function changeText(comments) {
	return {
		type: CHANGE_TEXT,
		comments: comments
	}
}

export function returnComment() {
	return {
		type: RETURN_TO_COMMENT
	}
}

export function comment(articleId, articleTitle, user, toWho, comments, commentGroupNum) {
	return function(dispatch) {
		$.ajax({
			type: "POST", 
			url: BASE_PATH+"/comment/comments/0",
			data: {
				articleId: articleId,
				articleTitle: articleTitle,
		        commenter: user,
		        replyer: toWho, //undefined就是评论，非回复某人
		        content: comments.value,
		        commentGroupNum: commentGroupNum,
		        isRead: "0" //"0"表示未读，"1"表示已读。提交瞬间自然是未读
			},
			success:(data)=>{
				if (!data) {
					return;
				} else if (data && !data[0].replyer) { //留言没有回复者就是评论
					dispatch({
						type: GET_COMMENTS,
						commentList: data
					})
				} else if (data[0].replyer) {
					dispatch({
						type: GET_REPLYS,	//这儿是不是这样的？
						replyList: data
					})
				}
			}, 
			error:(xhr)=>{
				alert("发表评论失败："+xhr.status)
			}
				
		})
	}
}

export function replyInitState(commentGroupNum) { //点击对评论的回复或对回复的回复
	return {
		type: REPLY_INIT,
		commentGroupNum: commentGroupNum
	}
}

export function delComment(articleId, commentGroupNum, commentNodeNum, replyTime, field) {
	return function(dispatch) {
		$.ajax({
        	type: "POST", 
        	url: BASE_PATH+"/comment/delcomment/0",
        	data: {
          		articleId: articleId,
          		commentGroupNum:commentGroupNum,
          		commentNodeNum: commentNodeNum, 
    //“评论”的条数。和组数量一起，用于删除评论的时候判断是评论是否只有一条或者删除的评论是否是第一条，以手动更新数组量即楼层数
          		replyTime: replyTime,
          		field: field
        	},
        	success: (data)=>{
        		// console.log(data);
          		if (field=="comment") {
          			dispatch({
          				type: GET_COMMENTS,
          				commentList: data
          			})
          		} else if (field=="reply") { //删除回复。以文章id和回复时间作为判断条件，此时1秒内同时回复的回复将被同时删除。
            		dispatch({
          				type: GET_REPLYS,
          				replyList: data
          			})
          		}
        	},
        	error: (xhr)=>{
          		alert("删除评论出错："+xhr.status);
        	}
      	})
	}
}

export function getInitComments(id) {
	return function(dispatch) {
		$.ajax({
			type: "GET",
			url: BASE_PATH+"/comment/getcomments/"+id,
			success: (data)=>{
				// console.log(data);
				if (!data[0]) {
					dispatch({
						type: COMMENT_MSG,
						flag: false
					})
				} else {
					dispatch({
						type: COMMENT_MSG, 
						flag: true
					})
				}
				dispatch({
					type: GET_COMMENTS,
					commentList: data
				})
			}
		})
	}
}

export function getInitReplys(id) {
	return function(dispatch) {
		$.ajax({
			type: "GET",
			url: BASE_PATH+"/comment/getreplys/"+id,
			success: (data)=>{
				// console.log(data);
				if (!data[0]) return;
				dispatch({
					type: GET_REPLYS,
					replyList: data
				})
			}
		})
	}
}