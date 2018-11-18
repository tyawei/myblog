import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import PropTypes from 'prop-types';

import './header.scss';

import store from '../../reducer/store';

import Component from './Component';

import {
	changeValue, 
	loginRegist, 
	getUserCommentList, 
	notRead, 
	logout
} from './LoginRegistAction';

class Container extends React.Component{
	constructor(props) {
		super(props);
		this.handleNav=this.handleNav.bind(this);
		this.handleSlide=this.handleSlide.bind(this);

		this.showModal=this.showModal.bind(this);
		this.handleSubmit=this.handleSubmit.bind(this);
		this.handleLogout=this.handleLogout.bind(this);

		this.handleChange=this.handleChange.bind(this);
		this.handleClick=this.handleClick.bind(this);
		this.state={
			url: "",
			num:0,
			title: "",		//登录框的头部“请登录”和“请注册”
			field: "",		//记录此时是login还是regist
			visible: false,		//ant组件modal的出现true状态和退出false状态
			confirmLoading: false	//点击modal确定按钮时的loading状态
		}		
	} 

	static contextTypes={
		router:PropTypes.object.isRequired
	}

  	showModal(e) {	//Header上的的登录和注册点击项，出现登录注册框
  		if (e.target.innerHTML==="登录") {
  			this.setState({
  				visible: true,
  				title: "请登录",
  				field: "login"
  			})
  		} else if (e.target.innerHTML==="注册") {
  			this.setState({
  				visible: true,
  				title: "请注册",
  				field: "regist"
  			})
  		}
  	}
	
  	handleSlide(event) {
		// event.stopPropagation();
		if (!this.flag) {
			$(".infobar").stop().slideDown(500, ()=>{
				
			});
		} else {
			$(".infobar").stop().slideUp(500);
		}
		this.flag=!this.flag;
	}

	handleNav(e) {
		let href=$(e.target).attr("href");
		this.setState({
			url: href
		})
	}

	handleClick(articleId, commentId) {	//点击未读消息跳转到哪篇文章并标为已读a
		const {userName}=this.props;
		store.dispatch(notRead(commentId, userName));
		this.context.router.history.push("/article/"+articleId);
	    
	}

	handleChange(kinds, val) {
		let pwdReg=/^[0-9A-Za-z]{6,20}$/g;
		// let emailReg=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]{2,})+$/;
		let newState={error: "", value: val, valid: true};
		let xssReg=/[<>\"\']+/g;
		switch(kinds) {
			case "user": {
				if (!val.length) {
					newState.error="输入不能为空";
					newState.valid=false;
				} else if (val.length>20) {
					newState.error="用户名不得超过20位";
					newState.valid=false;
				} else if ( xssReg.test(val) ) {
					newState.error="用户名不得包含尖括号和英文引号";
					newState.valid=false;
				}
				store.dispatch(changeValue("user", newState))
				break;
			}
			case "pwd": {
				if (!val.length) {
					newState.error="输入不能为空";
					newState.valid=false;
				} else if (!pwdReg.test(val)) {
					newState.error="字母数字组合6-20位";
					newState.valid=false;
				} 
				store.dispatch(changeValue("pwd", newState))
				break;
			}
			case "repPwd": {
				if (!val.length) {
					newState.error="输入不能为空";
					newState.valid=false;
				} else if (!pwdReg.test(val)) {
					newState.error="字母数字组合6-20位";
					newState.valid=false;
				} else if (val!==this.props.pwd.value) {
					newState.error="与上次输入不一致";
					newState.valid=false
				}
				store.dispatch(changeValue("repPwd", newState))
				break;
			}
		}
	}
	
	handleSubmit() {	
		let {title, visible, confirmLoading}=this.state;
		const {user, pwd, repPwd}=this.props;
		const subUrl=title==="请登录"? "loginsubmit":"registsubmit";
		// 注意，当输入框没有任何点击输入时value为空，valid默认为true，此时可以点击提交。所以条件要加入value的验证！
		if (subUrl==="registsubmit") {
			if (!user.valid || !pwd.valid || !$.trim(user.value) || !$.trim(pwd.value) || !repPwd.valid || !$.trim(repPwd.value) ) {
				alert("请修改相关信息！");
				return;
			} 
		} else if (subUrl==="loginsubmit") {
			if (!user.valid || !pwd.valid || !$.trim(user.value) || !$.trim(pwd.value)) {
				alert("请修改相关信息！");
				return;
			} 
		}
		store.dispatch(loginRegist(subUrl, user.value, pwd.value, repPwd.value))

		this.setState({
      		confirmLoading: true
    	});
    	setTimeout(() => {	//点击确定的loading状态持续500毫秒
    		// if (!this.props.validate) {
    		// 	this.setState({visible: true, confirmLoading: false})
    		// }
    		
    		//这儿，如果未能成功登录或者注册，框就不消失
      		this.setState({visible: !this.props.validate, confirmLoading: false}, ()=>{
      			// if (!this.props.validate) return;
      			// !this.props.validate? true:false

      			//500毫秒后，登录框消失，请求未读消息。
      			let {notReadMsg, userName, userType}=this.props;
				let n=0, timer;

				if (userName==="" || userType==="" || notReadMsg.length) return; 

			    timer=setInterval(()=>{
			      n++;
			      this.setState({
			        num: n
			      })
			    }, 666)

			    store.dispatch(getUserCommentList(userName))

      		});
    	}, 500);
    }

    handleLogout() {
    	if (confirm("你确定要退出？")) {
    		$.ajax({
	    		type: "POST",
	    		url: "http://localhost:3000/logout",
	    		data: {},
	    		success: (data)=>{
	    			window.sessionStorage.removeItem("userName");
	    			window.sessionStorage.removeItem("userType");
	    			store.dispatch(logout());
	    			this.context.router.history.push("/")
	    		}, 
	    		error: (xhr)=>{
	    			alert("退出登录失败："+xhr.status);
	    		}
	    	})
    	}
	    	
    }

    componentDidMount() {
    	let href=window.location.href; 
		let index=href.lastIndexOf("/");
		let suburl=href.substring(index); 

		this.setState({ url: suburl })

    }

	render() {
		const {num, url, title, field, visible, confirmLoading }=this.state;
		const {user, pwd, repPwd, validate, errMsg, submitType, notReadMsg}=this.props;
		let userName=this.props.userName || window.sessionStorage.getItem("userName");
		let userType=this.props.userType || window.sessionStorage.getItem("userType");
		return (
			<Component
				num={num}
				url={url}
				handleNav={this.handleNav}
				handleSlide={this.handleSlide}

				title={title}
          		field={field}
          		visible={visible} 
          		confirmLoading={confirmLoading}
          		handleSubmit={this.handleSubmit}
          		handleReset={function(){alert("重新注册吧\^-\^")}.bind(this)}
          		handleLogout={this.handleLogout}
	    		showModal={this.showModal}
          		handleCancel={function(){this.setState({visible:false})}.bind(this)}

				// userError={user.error} //store中的err试试{user.error || err}

				userName={userName}
				userType={userType}
				validate={validate}
				errMsg={errMsg}
				submitType={submitType}
				userError={user.error}
				pwdError={pwd.error}
				repPwdError={repPwd.error}
				userValid={user.valid}
				pwdValid={pwd.valid}
				repPwdValid={repPwd.valid}
				userValue={user.value}
				pwdValue={pwd.value}
				repPwdValue={repPwd.value}
				handleChange={this.handleChange} 

				notReadMsg={notReadMsg}
				handleClick={this.handleClick}
			/>
		)
	}
}

function mapStateToProps(state, ownProps) {
	return {
		user: state.LoginRegistReducer.user,
		pwd: state.LoginRegistReducer.pwd,
		repPwd: state.LoginRegistReducer.repPwd,
		validate: state.LoginRegistReducer.validate,
		errMsg: state.LoginRegistReducer.errMsg,
		notReadMsg: state.LoginRegistReducer.notReadMsg,
		userName: state.LoginRegistReducer.userName,
		userType: state.LoginRegistReducer.userType,
		submitType: state.LoginRegistReducer.submitType
	}
}

function mapDispatchToProps(dispatch, ownProps) {
	return {

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);