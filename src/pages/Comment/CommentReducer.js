import {
	CHANGE_TEXT, 
	RETURN_TO_COMMENT, 
	GET_COMMENTS, 
	GET_REPLYS,
	REPLY_INIT, 
	COMMENT_MSG
} from './CommentAction';

const initialState={
	articleId: 0,           
  	comments: {
  		error: "",
  		value: "",
  		valid: false
  	},  //验证评论
  	commentList: [],  //所有“评论”留言的数据
  	replyList: [],  //所有评论留言下的对应的所有回复留言
  	commentMsg: "",  //“暂无评论”和“评论正在加载中”
    commentGroupNum: 0  //评论组数量，用于倒数盖楼的数字
}

function commentReducer(state=initialState, action) {
	const comments={error: "", value: "", valid: false}
	switch(action.type) {
		case CHANGE_TEXT:
			return Object.assign({}, state, {comments: action.comments})
		case RETURN_TO_COMMENT:
			return Object.assign({}, state, {comments: comments}, {commentGroupNum: 0})
		case GET_COMMENTS:
			return Object.assign({}, state, {commentList: action.commentList}, {comments: comments})
		case GET_REPLYS: 
			return Object.assign({}, state, {replyList: action.replyList}, {comments: comments})
		case REPLY_INIT:
			return Object.assign({}, state, {comments: comments}, {commentGroupNum: action.commentGroupNum})
		case COMMENT_MSG:
			return Object.assign({}, state, {commentMsg: action.flag? "评论正在加载中。。。":"暂无评论"})
		default:
			return state
	}
}

export default commentReducer;