import React from 'react';
import $ from 'jquery';

import { Form, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;

import './comment.scss'

export default class Comment extends React.Component{
  	constructor(props) {
  		super(props);
  	}

      render() {
        const {display, comments, commentList, replyList, commentMsg, isReturn, commentGroupNum, handleDisplay, 
              handleChange, handleComment, handleReturn, handleDelComment, handleReply, userName
            }=this.props;
    	    return (
            <section id="comment">
                <div className="commentlist">
                {
                    commentList[0]?
                    commentList.map((item, index)=>{
                        return (
                            <div className="list" id={item.group_num} key={item.comment_id}>
                                <div className="commenter">
                                    <p className="info">
                                        <strong>
                                            <span>{item.group_num+"楼"}</span>&nbsp;
                                            <span>用户：</span><span className="name">{item.commenter}</span>
                                        </strong>
                                        <span className="time">{item.join_time}</span>
                                        <span className="reply">
                                            <a href="javascript:;" 
                                                onClick={(e, field)=>handleReply(e.target, "comment")}
                                            >回复</a>
                                        </span>
                                        {
                                            (userName==="admin" || item.commenter===userName) && 
                                            <span className="del">
                                                <a href="javascript:;" 
                                                    onClick={(e, field)=>handleDelComment(e.target, "comment")}
                                                >删除</a>
                                            </span>
                                        }
                                    </p>
                                    <p className="commentcontent">{item.content}</p>
                                </div>
                                {
                                    replyList?
                                    replyList.map((item1, index1)=>{
                                        if (item1.group_num==item.group_num) { //将“回复”放在相应评论项下的关键，同一条评论下的所有回复的组数量和相应评论的相同
                                            return (
                                                <div className="replyer" key={item1.comment_id}>
                                                    <em className="replytowho">
                                                        <span className="replyername">{item1.replyer}</span>&nbsp;Reply to:
                                                        <span className="commentername">{item1.commenter}</span>&nbsp;&nbsp;
                                                        <span className="time">{item1.join_time}</span>
                                                        <span className="reply">
                                                            <a href="javascript:;" 
                                                                onClick={(e, field)=>handleReply(e.target, "reply")}
                                                            >回复</a>
                                                        </span>
                                                        {
                                                            (userName==="admin" || item1.replyer===userName) && 
                                                            <span className="del">
                                                                <a href="javascript:;" 
                                                                    onClick={(e, field)=>handleDelComment(e.target, "reply")}
                                                                >删除</a>
                                                            </span>
                                                        }
                                                        &nbsp;
                                                    </em>
                                                    <p>{item1.content}</p>
                                                </div>
                                            )
                                        }
                                    }):""
                                }
                            </div>
                        )
                    }):commentMsg
                }

                </div>

                <p className="head" onClick={handleDisplay}>我要评论
                    {!display? <Icon type="caret-down" />:<Icon type="caret-up" /> }
                </p>
                <div className="addcomment">
                    <p className="user">
                        <span className="name">昵&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：</span>
                        <span>{userName || "尚未登录！"}</span>
                    </p>
                    <div className="addone">
                        <span className="add">发表评论：</span>
                        <FormItem>
                            <Input className="content" type="textarea" value={comments.value} name="comments" 
                                placeholder="在此输入评论" onChange={handleChange}
                            /> 
                        </FormItem>
                        <Button className="" size="small" onClick={handleComment}>提交</Button>&nbsp;
                        {
                            isReturn && 
                            <Button className="" size="small" onClick={handleReturn}>返回评论</Button>
                        }
                        {
                            !comments.valid && 
                            <span className="error">{comments.error}</span>
                        }
                    </div>
                </div>

            </section>
    	    )
      }
}