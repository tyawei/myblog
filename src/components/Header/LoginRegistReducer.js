import {
	CHANGE_VALUE,
	LOGIN_NOT_MATCH,
	LOGIN_SUCCESS,
	REGIST_USERNAME_EXIST,
	REGIST_SUCCESS,
	GET_USER_COMMENT_LIST,
	NOT_READ,
	LOGOUT
} from './LoginRegistAction';

const initialState={
	user: {
		error: "",
		value: "",
		valid: true
	},
	pwd: {
		error: "",
		value: "",
		valid: true
	},
	repPwd: {
		error: "",
		value: "",
		valid: true
	},
	validate: true,
	errMsg: "",
	userType: "",
	userName: "",
	notReadMsg: [],
	submitType: ""
}

function loginRegistReducer(state=initialState, action) {
	switch(action.type) {
		case CHANGE_VALUE:
			return {...state, [action.field]: action.newState}
		case LOGIN_NOT_MATCH:
			return {...state, errMsg: "用户名和密码不匹配！", validate:false, submitType:"loginsubmit"}
		case LOGIN_SUCCESS:
			return {
				...state,
				validate: true,
				submitType: "loginsubmit",
				userType: action.userType,
				userName: action.userName,
				user: {
					error: "",
					value: "",
					valid: true
				},
				pwd: {
					error: "",
					value: "",
					valid: true
				}
			}
		case REGIST_USERNAME_EXIST:
			return {...state, errMsg: "用户名已存在！", validate:false, submitType: "registsubmit"}
		case REGIST_SUCCESS:
			return {
				...state,
				validate: true,
				submitType: "registsubmit",
				userType: action.userType,
				userName: action.userName,
				user: {
					error: "",
					value: "",
					valid: true
				},
				pwd: {
					error: "",
					value: "",
					valid: true
				},
				repPwd: {
					error: "",
					value: "",
					valid: true
				}
			}
		case GET_USER_COMMENT_LIST:
			return {...state, notReadMsg: action.notReadMsg}
		case LOGOUT:
			return {
				...state,
				validate: true,
				userName: "",
				userType: "",
				submitType: ""
			}
		case NOT_READ:
			return state
		default:
			return state
	}
}

export default loginRegistReducer;