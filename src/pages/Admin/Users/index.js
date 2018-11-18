import React from 'react';
import $ from 'jquery';

import {Icon, Table, Pagination} from 'antd';
import BASE_PATH from '../../../config/'

export default class Users extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			display: false,
			current: 1,
			total: 0,
			dataSource: [],

			columns: [{
			  title: 'ID',
			  dataIndex: 'id',
			  key: 'id',
			},{
			  title: '称呼',
			  dataIndex: 'username',
			  key: 'username',
			}, {
			  title: '注册时间',
			  dataIndex: 'join_time',
			  key: 'join_time',
			}, {
			  title: '最近登录',
			  dataIndex: 'new_time',
			  key: 'new_time',
			}]
		}
	}

	handleDisplay() {
		if (!this.state.display) {
			$(".displayUsers").stop().slideDown(300, ()=>{
				const {current}=this.state;
				if (this.state.dataSource.length) return; 
				$.ajax({ type:"GET", url:BASE_PATH + "/admin/users/"+current,
					success: (data)=>{
						if (data.total==0) return;
						let userList=data.current.map((item)=>{
							return {
								key:item.user_id, 
								id:item.user_id, 
								username:item.username, 
								join_time:item.join_time,
								new_time:item.new_time
							}
						})
						// console.log(userList);
						this.setState({ dataSource:userList, total:data.total })
					},
					error: (xhr)=>{
						alert("获取用户信息失败："+xhr.status)
					}
				})
			});
		} else {
			$(".displayUsers").stop().slideUp(300, "swing");
		}
		this.setState({ display: !this.state.display })				
	}

	handleChange(page) {
		this.setState({ current: page }, ()=>{
			const {current}=this.state;
			$.ajax({type:"GET", url:BASE_PATH + "/admin/users/"+current,
				success:(data)=>{
					if (data.total==0) return;
					let userList=data.current.map((item)=>{
						return {
							key:item.user_id, 
							id:item.user_id, 
							username:item.username, 
							join_time:item.join_time,
							new_time:item.new_time
						}
					})
					this.setState({ dataSource:userList, total:data.total })
				},
				error:(xhr)=>{
					alert("获取用户信息失败："+xhr.status);
				}
			})
		})
	}

	render() {
		const {dataSource, total, current}=this.state;
		return (
			<div id="users">
				<p className="admintitle" onClick={this.handleDisplay.bind(this)}>管理用户信息
					{!this.state.display? <Icon type="down" />:<Icon type="up" />}
				</p>
				<div className="displayUsers" style={{display: "none"}}>
				{
					dataSource.length?
					<div>
						<Table dataSource={dataSource} columns={this.state.columns} 
							pagination={false}
						/>
						<div className="pagination textcenter">
							<Pagination defaultCurrent={1} pageSize={10} total={total}
		                		current={current}
		                		onChange={this.handleChange.bind(this)}
		                	 />
		                </div>
					</div>:"尚无用户注册！"
				}
				</div>
			</div>
		)
	}
}