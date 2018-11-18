import React from 'react';
import $ from 'jquery';
import {Icon, Button} from 'antd';

import './friends.scss';
import BASE_PATH from '../../../config/'

export default class Friends extends React.Component {
	constructor(props) {
		super(props);
		this.handleDeal=this.handleDeal.bind(this);
		this.state={
			display: false,
			friends: []
		}
	} 

	handleDeal(id, field) {
		if ( confirm(field==="agree"? "你确定要同意该友链？"+id:"你确定要忽略该友链？") ) {
			$.ajax({
				type: "POST",
				url: BASE_PATH + "/admin/friend/"+field,
				data: { id: id },
				success: (data)=>{
					// console.log(data); //yes
					this.setState({ friends: data });
					alert("操作成功！");
				},
				error: (xhr)=>{
					alert("处理友链失败："+xhr.status);
				}
			})
		}
	}

	handleDisplay() {
		if (!this.state.display) {
			$(".displayFriends").stop().slideDown(300, ()=>{//获取友链表中is_agree为0的
				if (this.state.friends.length) return;
				$.ajax({type:"GET", url:BASE_PATH + "/admin/friend/get",  
					success:(data)=>{
						// console.log(data);
						this.setState({
							friends: data
						})
					}, 
					error:(xhr)=>{
						alert("获取友链申请信息失败："+xhr.status);
					}
				})
			});
		} else {
			$(".displayFriends").stop().slideUp(300, "swing");
		}
		this.setState({ display: !this.state.display })
	}

	render() {
		const {friends}=this.state;
		return (
			<div id="friends">
				<p className="admintitle" onClick={this.handleDisplay.bind(this)}>管理友情链接申请
					{!this.state.display? <Icon type="down" />:<Icon type="up" />}
				</p>
				<div className="displayFriends"  style={{display: "none"}}>
				{
					friends.length?
					friends.map((item)=>{
						return (
							<div className="list" id={item.id} key={item.id}>
								<p className="item"><span>称呼：</span><span>{item.name}</span></p>
								<p className="item"><span>网址：</span><span>{item.url}</span></p>
								<div className="details">
									<span className="d">申请理由：</span>
									<p className="content">
										{item.reason}
									</p>
								</div>
								<Button htmlType="button" onClick={(id, field)=>this.handleDeal(item.id, "agree")}>同意</Button>
								<Button htmlType="button" onClick={(id, field)=>this.handleDeal(item.id, "ignore")}>忽略</Button>
							</div>
						)
					}):"尚无友链申请！"
				}
				</div>
			</div>
		)
	}
}