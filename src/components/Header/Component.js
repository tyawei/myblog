import React from 'react';
import $ from 'jquery';
import {NavLink} from 'react-router-dom'; 

import './header.scss';

import LoginRegistComp from './LoginRegistForm';

export default class Header extends React.Component{
	render() {
		const {num, url, handleNav, handleSlide, handleLogout, showModal, userName, userType, 
			notReadMsg, handleClick}=this.props;
		return (
			<header id="header">
				<div className="head">
					<h2 className="name">跨越南墙</h2>
					<p className="words">俗话说，不撞南墙不回头。可我撞了也不回头，因为我要跨过去！</p>
				</div>
				<nav className="nav clearfix">
					<ul className="n textcenter">
						<li className="left">
							<NavLink activeClassName="active" className="list" to="/"
								onClick={handleNav}
								isActive={()=>{return url==="/"} }
							>首页</NavLink>
						</li>
						<li className="left">
							<NavLink activeClassName="active" className="list" to="/file"
								onClick={handleNav}	
								isActive={()=>{return url==="/file"} }
							>归档</NavLink>
						</li>
						<li className="left">
							<NavLink activeClassName="active" className="list" to="/catagory"
								onClick={handleNav}
								isActive={()=>{return url==="/catagory"} }
							>分类</NavLink>
						</li>
						<li className="left">
							<NavLink activeClassName="active" className="list" to="/friend"
								onClick={handleNav}
								isActive={()=>{return url==="/friend"} }
							>友链</NavLink>
						</li>
					</ul>
					{
						(userName && userType)?
						<div className="userinfo">
							<ul className="check right borderbox">
								<li className="right" onClick={handleLogout}>
									<a className="list" href="javascript:;">退出</a>
								</li>
								<li className="right" onClick={handleSlide}
									title={notReadMsg.length? "你有新消息！":""}
								>
									<a className="list" href="javascript:;">{userName}</a>
									{
										(notReadMsg.length && num%2==0)? 
										<span className="msgtip">!</span>:""
									}
								</li>
							</ul> 
							<div className="infobar borderbox">
							{
								notReadMsg.length? 
								notReadMsg.map((item, index)=>{
									if (item.replyer!="" && item.commenter==userName) {
										return (
											<div className="" key={item.comment_id}>
												<p>
													<span>{item.replyer}  回复你：</span>
													<a href="javascript:;" 
														onClick={(articleId, commentId)=>handleClick(item.article_id, item.comment_id)}
													>
														{"“"+item.content+"”"}
													</a>
												</p>
												<p>
													>>进入博文
													<a href="javascript:;" 
														onClick={(articleId, commentId)=>handleClick(item.article_id, item.comment_id)}
													>
														{decodeURIComponent(item.article_title)}
													</a>
												</p>
												{/*<p><a href="javascript:;">{item.content}</a></p>目前还差如何获取自己的评论或者回复！*/}
											</div>
										)
									} else if (item.replyer=="" && userName=="admin") {
										return (
											<div className="" key={item.comment_id}>
												<p>
													{item.commenter}  评论你的文章
													<a href="javascript:;" 
														onClick={(articleId, commentId)=>handleClick(item.article_id, item.comment_id)}
													>
														{decodeURIComponent(item.article_title)}
													</a>
												</p>
												<p>
													<a href="javascript:;" 
														onClick={(articleId, commentId)=>handleClick(item.article_id, item.comment_id)}
													>
														{"“"+item.content+"”"}
													</a>
												</p>
												{/*<p><a href="javascript:;">{item.content}</a></p>目前还差如何获取自己的评论或者回复！*/}
											</div>
										)
									}
								}) : "暂无消息！"
							}
							</div>
						</div> 
						:
						<ul className="check right textcenter borderbox">
							<li className="right">
								<a className="list" onClick={showModal} href="javascript:;">注册</a>
							</li>
							<li className="right">
								<a className="list" onClick={showModal} href="javascript:;">登录</a>
							</li>
						</ul>
					}
				</nav>
				<LoginRegistComp {...this.props} />
			</header>
		)
	}
}
