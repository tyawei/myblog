import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';

import Comment from './Component';
import {
  changeText, returnComment, comment, replyInitState, delComment,
  getArticleId, getInitComments, getInitReplys
} from './CommentAction';

import store from '../../reducer/store'

import { Form, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;

import './comment.scss'

class Container extends React.Component{
	constructor(props) {
		super(props);
    this.handleChange=this.handleChange.bind(this);
    this.handleReturn=this.handleReturn.bind(this); //取消对某人回复转而对文章评论
    this.handleComment=this.handleComment.bind(this); //提交评论或者回复，视isReturn和placeholder定
    this.handleDelComment=this.handleDelComment.bind(this); //删除对文章的评论或者其他回复
    this.handleReply=this.handleReply.bind(this); //点击对评论的回复或者对回复的回复
    this.state={
      // user: {
      //   userName: window.sessionStorage.getItem("userName"),
      //   userType: window.sessionStorage.getItem("userType")
      // },
      articleId: 0,
      articleTitle: "",
      display: false,         //放到组件内部，不放在store中
      isReturn: false  //区分留言是对文章发表评论还是发表回复(包括对评论的回复和对回复的回复)
    }
	}

  handleChange(e) { //验证输入的评论内容。注意xss
    let val=e.target.value;
    let newObj={error: "", value: val, valid: true};
    // let replyReg=/\bto\s[\u4e00-\u9fa5A-Za-z0-9_]{1,20}:$/;
    if ($.trim(val) && $.trim(val).length<2) {
      newObj.error="评论不少于2个字！";
      newObj.valid=false
    } 
    store.dispatch(changeText(newObj));

  }

  handleComment() {
    let {comments, commentGroupNum, userName, userType}=this.props;
    let {isReturn, articleId, articleTitle}=this.state;
    let placeholder=$("textarea[name=comments]").attr("placeholder"), toWho;

    if (!userName && !userType) {
      alert("你尚未登录！");
      return;
    }

    if (!comments.value) return; //评论不能为空
    if ( placeholder.indexOf("to ")>-1 && isReturn) { //根据发言是评论还是回复取到回复对象，以便存入数据库replyer
      toWho=placeholder.substring(3, placeholder.indexOf(":")) //towho取到后，提交此回复到后台保存到相应组数量评论下
    }
    store.dispatch(comment(articleId, articleTitle, userName, toWho, comments, commentGroupNum));
  }

  handleReturn() { //取消对某人的回复转而对文章评论
    $("textarea[name=comments]").attr("placeholder", "在此输入评论");
    this.setState({ isReturn: false }, function() {
      store.dispatch(returnComment())
    })
  }

  handleDelComment(self, field) { //删除对文章的评论或者某人的回复
    let commentGroupNum=$(self).closest("[id]").attr("id");
    let commentNodeNum=$(self).closest(".commentlist").find(".commenter").length;
    let replyTime=$(self).closest(".replyer").find(".time").text();   //如果是评论，时间没有
    let conf=field==="comment"? "你确定要删除评论吗？":"你确定要删除回复吗？";

    if ( confirm(conf) ) {
      store.dispatch(delComment(this.state.articleId, commentGroupNum, commentNodeNum, replyTime, field))
    }
  }

  handleReply(self, field) { //点击对评论的回复或者对回复的回复
    let commentGroupNum=$(self).closest("[id]").attr("id");
    let replyer=field=="comment"? 
        $(self).closest("p").find(".name").text():
        $(self).closest("em").find(".replyername").text();

    this.setState({ display: true }, function() {
      $(".addcomment").stop().animate({"opacity":1}, 200, "swing").slideDown(200, ()=>{
        $("textarea[name=comments]").focus();
        $("textarea[name=comments]").attr("placeholder", "to "+replyer+":");
      });
    })

    this.setState({ isReturn:true}, function() {
      store.dispatch(replyInitState(commentGroupNum));  
      //重置comments三个内容，记录组数量，提交的时候保存在数据库，取出来的时候才能确定是哪一条评论下的回复
    })
  }

  handleDisplay() {
      const {display}=this.state;
      if (!display) {
          $(".addcomment").stop().animate({"opacity":1}, 200, "swing").slideDown(200, ()=>{
            $("textarea[name=comments]").focus();
          });
      } else {
          $(".addcomment").stop().animate({"opacity":0}, 200, "swing").slideUp();
      }
      this.setState({  display: !display })
  }

  componentDidMount() {
    let {articleId, articleTitle}=this.props; //来自article的文章id。放到store中，同时以备编辑处使用
    this.setState({ 
      articleId: articleId,
      articleTitle: articleTitle
    })
    if (articleId==0) return;

    store.dispatch(getInitComments(articleId));
    store.dispatch(getInitReplys(articleId));
  }

	  render() {
        const {display, isReturn}=this.state;
        const {comments, commentList, replyList, commentMsg, commentGroupNum}=this.props;
        let userName=this.props.userName || window.sessionStorage.getItem("userName");
        let userType=this.props.userType || window.sessionStorage.getItem("userType");
		    return (
            <Comment 
                display={display}
                isReturn={isReturn}
                userName={userName}

                comments={comments}
                commentList={commentList}
                replyList={replyList}
                commentMsg={commentMsg}
                commentGroupNum={commentGroupNum}

                handleDisplay={this.handleDisplay.bind(this)}
                handleChange={this.handleChange}
                handleComment={this.handleComment}
                handleReturn={this.handleReturn}
                handleDelComment={this.handleDelComment}
                handleReply={this.handleReply}
            />
        )            
	  }
}

function mapStateToProps(state) {
  return {
    comments: state.CommentReducer.comments,
    commentList: state.CommentReducer.commentList,
    replyList: state.CommentReducer.replyList,
    commentMsg: state.CommentReducer.commentMsg,
    commentGroupNum: state.CommentReducer.commentGroupNum,

    userName: state.LoginRegistReducer.userName,
    userType: state.LoginRegistReducer.userType
  }
}
function mapDispatchToProps(dispatch, ownProps) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);

